package defset

import (
	"context"
	"fmt"

	"cuelang.org/go/cue"
	lru "github.com/hashicorp/golang-lru/v2"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
)

type DefSet struct {
	ServicesCueValues map[string]cue.Value
	RootValue         cue.Value

	serviceSpawnCueValueLRU *lru.Cache[string, cue.Value]
	isConcreteLRU           *lru.Cache[string, bool]

	CueMu      *CueMutex
	CueContext *cue.Context
	Err        error
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
