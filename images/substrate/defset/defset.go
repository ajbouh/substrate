package defset

import (
	"context"
	"fmt"

	"cuelang.org/go/cue"
	lru "github.com/hashicorp/golang-lru/v2"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	substratefs "github.com/ajbouh/substrate/images/substrate/fs"
)

type DefSet struct {
	ServicesCueValues map[string]cue.Value
	RootValue         cue.Value

	serviceSpawnCueValueLRU *lru.Cache[string, cue.Value]
	isConcreteLRU           *lru.Cache[string, bool]

	CueMu      *CueMutex
	CueContext *cue.Context
	Err        error

	Layout *substratefs.Layout
}

func (s *DefSet) Initialize() {
	s.serviceSpawnCueValueLRU, _ = lru.New[string, cue.Value](128)
	s.isConcreteLRU, _ = lru.New[string, bool](128)
}

func decodeServiceInstanceSpawnDef(service cue.Value) (*activityspec.ServiceInstanceDef, error) {
	v := service.LookupPath(cue.MakePath(cue.Str("instances"), cue.AnyString))
	var result activityspec.ServiceInstanceDef
	return &result, v.Decode(&result)
}

func (s *DefSet) ResolveServiceByName(ctx context.Context, serviceName string) (*activityspec.ServiceInstanceDef, error) {
	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	v, ok := s.ServicesCueValues[serviceName]
	if !ok {
		return nil, nil
	}
	return decodeServiceInstanceSpawnDef(v)
}

func (s *DefSet) LookupServiceInstanceJSON(ctx context.Context, serviceName, instanceName string, path cue.Path) ([]byte, error) {
	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	serviceCueValue, ok := s.ServicesCueValues[serviceName]
	if !ok {
		return nil, fmt.Errorf("unknown service: %s", serviceName)
	}

	instanceCueValue := serviceCueValue.LookupPath(cue.MakePath(cue.Str("instances"), cue.Str(instanceName)))
	cueValue := instanceCueValue.LookupPath(path)
	return cueValue.MarshalJSON()
}

func (s *DefSet) ResolveSpaceView(v *activityspec.SpaceViewRequest, ownerIfCreation string) (view *substratefs.SpaceView, err error) {
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

		var alias string
		if v.SpaceAlias != nil {
			alias = *v.SpaceAlias
		}
		view, err = s.Layout.NewSpaceView(tip, base, v.ReadOnly, v.CheckpointExistingFirst, ownerIfCreation, alias)
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
