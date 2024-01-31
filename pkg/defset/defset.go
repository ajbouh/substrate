package defset

import (
	"context"
	"fmt"
	"sync"

	"cuelang.org/go/cue"

	"github.com/ajbouh/substrate/pkg/activityspec"
	"github.com/ajbouh/substrate/pkg/blackboard"
	"github.com/ajbouh/substrate/pkg/substratefs"
)

type DefSet struct {
	Blackboard *blackboard.Blackboard
	Services   map[string]cue.Value
	CueMu      *sync.Mutex
	CueContext *cue.Context
	Err        error

	Layout *substratefs.Layout
}

func (s *DefSet) ResolveActivity(ctx context.Context, activityName string) ([]*activityspec.ResolvedActivity, error) {
	s.CueMu.Lock()
	defer s.CueMu.Unlock()

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

func (s *DefSet) ResolveService(ctx context.Context, serviceName string) (*activityspec.ServiceDef, error) {
	s.CueMu.Lock()
	defer s.CueMu.Unlock()

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

func (s *DefSet) AllServices(ctx context.Context) (map[string]*activityspec.ServiceDef, error) {
	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	// use JSON encoding to defensively clone s.Services
	var result map[string]*activityspec.ServiceDef
	if err := deepCloneViaJSON(&result, s.Services); err != nil {
		return nil, err
	}
	return result, nil
}

func (s *DefSet) ResolveSpaceView(v *activityspec.SpaceViewRequest, ownerIfCreation, aliasIfCreation string) (view *substratefs.SpaceView, err error) {
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
