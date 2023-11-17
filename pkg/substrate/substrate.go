package substrate

import (
	"context"
	"database/sql"
	"fmt"
	"strconv"
	"sync"

	"cuelang.org/go/cue"
	"cuelang.org/go/cue/cuecontext"

	"github.com/ajbouh/substrate/pkg/activityspec"
	"github.com/ajbouh/substrate/pkg/blackboard"
	"github.com/ajbouh/substrate/pkg/substratefs"
)

type Substrate struct {
	Driver           activityspec.ProvisionDriver
	ProvisionerCache *activityspec.ProvisionerCache

	Blackboard *blackboard.Blackboard

	Layout *substratefs.Layout

	Services map[string]cue.Value
	CueMu    *sync.Mutex

	Origin         string
	OriginResolver string

	Mu *sync.RWMutex
	DB *sql.DB
}

func New(fileName, substratefsMountpoint, lensesExpr string, driver activityspec.ProvisionDriver, origin string, cpuMemoryTotalMB, cudaMemoryTotalMB int) (*Substrate, error) {
	db, err := newDB(fileName)
	if err != nil {
		return nil, fmt.Errorf("error starting db: %s", err)
	}

	services := map[string]cue.Value{}
	servicesCueCtx := cuecontext.New()
	servicesValue := servicesCueCtx.CompileString(lensesExpr)
	servicesValue = servicesValue.FillPath(
		cue.MakePath(cue.AnyString, cue.Str("spawn"), cue.Str("parameters"), cue.Str("cpu_memory_total"), cue.Str("resource"), cue.Str("quantity")),
		servicesCueCtx.CompileString("number | *"+strconv.Itoa(cpuMemoryTotalMB)),
	)
	servicesValue = servicesValue.FillPath(
		cue.MakePath(cue.AnyString, cue.Str("spawn"), cue.Str("parameters"), cue.Str("cuda_memory_total"), cue.Str("resource"), cue.Str("quantity")),
		servicesCueCtx.CompileString("number | *"+strconv.Itoa(cudaMemoryTotalMB)),
	)

	if fields, err := servicesValue.Fields(); err != nil {
		return nil, fmt.Errorf("error decoding LENSES: %s", err)
	} else {
		for fields.Next() {
			if sel := fields.Selector(); sel.IsString() {
				services[sel.Unquoted()] = fields.Value()
			}
		}
	}

	bbCueCtx := cuecontext.New()
	bb := blackboard.New(bbCueCtx)
	var s *Substrate
	s = &Substrate{
		Driver: driver,
		ProvisionerCache: activityspec.NewProvisionerCache(
			func(asr *activityspec.ServiceSpawnRequest) activityspec.ProvisionFunc {
				return s.NewProvisionFunc(asr)
			},
		),
		Layout:     substratefs.NewLayout(substratefsMountpoint),
		Services:   services,
		Blackboard: bb,
		DB:         db,
		Mu:         &sync.RWMutex{},
		CueMu:      &sync.Mutex{},
		Origin:     origin,
	}
	ctx := context.Background()
	if fields, err := bbCueCtx.CompileString(lensesExpr).Fields(); err != nil {
		return nil, fmt.Errorf("error decoding LENSES: %s", err)
	} else {
		for fields.Next() {
			sel := fields.Selector()
			if !sel.IsString() {
				continue
			}
			serviceName := sel.Unquoted()
			serviceDef := fields.Value()
			callDefs, err := serviceDef.LookupPath(cue.MakePath(cue.Str("calls"))).List()
			if err != nil {
				continue
			}
			for callDefs.Next() {
				callDef := callDefs.Value()
				bb.Offer(ctx, blackboard.Input{Value: callDef}, s.serviceDefRefinement(serviceName, serviceDef, callDef))
			}
		}
	}

	return s, nil
}

func (s *Substrate) ResolveActivity(ctx context.Context, activityName string) ([]*activityspec.ResolvedActivity, error) {
	s.Mu.RLock()
	defer s.Mu.RUnlock()

	activities := []*activityspec.ResolvedActivity{}

	for serviceName, service := range s.Services {
		var serviceDef *activityspec.ServiceDef
		if err := service.Decode(&serviceDef); err != nil {
			return nil, err
		}

		for _, activity := range serviceDef.Activities {
			if activity.Activity == activityName {
				activity0 := activity
				activities = append(activities, &activityspec.ResolvedActivity{
					ServiceName: serviceName,
					Service:     serviceDef,
					Activity:    &activity0,
				})
			}
		}
	}

	var result []*activityspec.ResolvedActivity
	if err := deepCloneViaJSON(&result, activities); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *Substrate) ResolveService(ctx context.Context, serviceName string) (*activityspec.ServiceDef, error) {
	s.Mu.RLock()
	defer s.Mu.RUnlock()

	service, ok := s.Services[serviceName]
	if !ok {
		return nil, nil
	}
	var result *activityspec.ServiceDef
	if err := service.Decode(&result); err != nil {
		return nil, err
	}
	return result, nil
}

func (s *Substrate) AllServices(ctx context.Context) (map[string]*activityspec.ServiceDef, error) {
	s.Mu.RLock()
	defer s.Mu.RUnlock()

	// use JSON encoding to defensively clone s.Services
	var result map[string]*activityspec.ServiceDef
	if err := deepCloneViaJSON(&result, s.Services); err != nil {
		return nil, err
	}
	return result, nil
}

func (s *Substrate) ResolveSpaceView(v *activityspec.SpaceViewRequest, ownerIfCreation, aliasIfCreation string) (view *substratefs.SpaceView, err error) {
	if v.SpaceID != "scratch" {
		var tip *substratefs.TipRef
		tip, err = substratefs.ParseTipRef(v.SpaceID)
		if err != nil {
			return nil, fmt.Errorf("error parsing tip=%s err=%s", v.SpaceID, err)
		}

		var base *substratefs.Ref
		if v.SpaceBaseRef != nil && *v.SpaceBaseRef != "scratch" {
			base, err = substratefs.ParseRef(*v.SpaceBaseRef)
			if err != nil {
				return nil, fmt.Errorf("error parsing base=%s err=%s", *v.SpaceBaseRef, err)
			}
		}

		view, err = s.Layout.NewSpaceView(tip, base, v.ReadOnly, v.CheckpointExistingFirst, ownerIfCreation, aliasIfCreation)
		if err != nil {
			return nil, fmt.Errorf("error creating view err=%s", err)
		}

		err = view.Await()
		if err != nil {
			return nil, fmt.Errorf("error creating view err=%s", err)
		}
	}

	return view, nil
}
