package defset

import (
	"context"
	"fmt"

	"cuelang.org/go/cue"
	lru "github.com/hashicorp/golang-lru/v2"
)

type DefSet struct {
	ServicesCueValues map[string]cue.Value
	RootValue         cue.Value

	serviceSpawnCueValueLRU *lru.Cache[string, cue.Value]

	CueMu      *CueMutex
	CueContext *cue.Context
	Err        error
}

func (s *DefSet) Initialize() {
	s.serviceSpawnCueValueLRU, _ = lru.New[string, cue.Value](128)
}

func (s *DefSet) DecodeLookupPath(p cue.Path, target any) error {
	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	return s.RootValue.LookupPath(p).Decode(target)
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
