package defset

import (
	"context"
	"fmt"
	"sort"
	"strings"

	"cuelang.org/go/cue"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	substratefs "github.com/ajbouh/substrate/images/substrate/fs"
)

func (s *DefSet) ResolveService(ctx context.Context, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResolution, error) {
	serviceDefSpawnValue, err := s.resolveServiceDefSpawn(req)
	if err != nil {
		return nil, err
	}

	return s.resolveServiceSpawn(req, serviceDefSpawnValue)
}

func (s *DefSet) IsConcrete(req *activityspec.ServiceSpawnRequest) (bool, error) {
	isConcrete, ok := s.isConcreteLRU.Get(req.CanonicalFormat)
	if ok {
		return isConcrete, nil
	}

	serviceDefSpawnValue, err := s.resolveServiceDefSpawn(req)
	if err != nil {
		s.isConcreteLRU.Add(req.CanonicalFormat, false)
		return false, err
	}

	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	parametersValue, err := serviceDefSpawnValue.LookupPath(cue.MakePath(cue.Str("parameters"))).Fields()
	if err != nil {
		s.isConcreteLRU.Add(req.CanonicalFormat, false)
		return false, fmt.Errorf("error decoding service parametersValue: %w", err)
	}

	for parametersValue.Next() {
		sel := parametersValue.Selector()
		if !sel.IsString() {
			continue
		}
		parameterName := sel.Unquoted()

		parameterType, err := parametersValue.Value().LookupPath(cue.MakePath(cue.Str("type"))).String()
		if err != nil {
			s.isConcreteLRU.Add(req.CanonicalFormat, false)
			return false, err
		}

		if !req.Parameters[parameterName].IsConcrete(activityspec.ServiceSpawnParameterType(parameterType)) {
			s.isConcreteLRU.Add(req.CanonicalFormat, false)
			return false, nil
		}
	}

	s.isConcreteLRU.Add(req.CanonicalFormat, true)
	return true, nil
}

func (s *DefSet) resolveServiceDefSpawn(req *activityspec.ServiceSpawnRequest) (cue.Value, error) {
	serviceDefSpawnValue, ok := s.serviceSpawnCueValueLRU.Get(req.CanonicalFormat)
	if ok {
		return serviceDefSpawnValue, nil
	}

	serviceDefValue, ok := s.ServicesCueValues[req.ServiceName]
	if !ok {
		services := []string{}
		for k := range s.ServicesCueValues {
			services = append(services, k)
		}
		sort.Strings(services)
		return cue.Value{}, fmt.Errorf("no such service: %q (have %#v)", req.ServiceName, strings.Join(services, ", "))
	}

	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	serviceDefSpawnValue = serviceDefValue.LookupPath(cue.MakePath(cue.Str("instances"), cue.AnyString))
	serviceDefSpawnValue = serviceDefSpawnValue.FillPath(
		cue.MakePath(cue.Str("environment"), cue.Str("SUBSTRATE_URL_PREFIX")),
		req.URLPrefix,
	)

	viewspec := req.CanonicalFormat
	serviceDefSpawnValue = serviceDefSpawnValue.FillPath(
		cue.MakePath(cue.Str("environment"), cue.Str("SUBSTRATE_VIEWSPEC")),
		viewspec,
	)

	for parameterName, parameterReq := range req.Parameters {
		serviceDefSpawnValue = serviceDefSpawnValue.FillPath(
			cue.MakePath(cue.Str("parameters"), cue.Str(parameterName), cue.Str("value")),
			parameterReq.String(),
		)
	}

	s.serviceSpawnCueValueLRU.Add(req.CanonicalFormat, serviceDefSpawnValue)
	return serviceDefSpawnValue, nil
}

func (s *DefSet) resolveServiceSpawn(req *activityspec.ServiceSpawnRequest, serviceDefSpawnValue cue.Value) (*activityspec.ServiceSpawnResolution, error) {
	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	parametersValue, err := serviceDefSpawnValue.LookupPath(cue.MakePath(cue.Str("parameters"))).Fields()
	if err != nil {
		return nil, fmt.Errorf("error decoding service parametersValue: %w", err)
	}

	parameters := activityspec.ServiceSpawnParameters{}
	for parametersValue.Next() {
		sel := parametersValue.Selector()
		if !sel.IsString() {
			continue
		}
		parameterName := sel.Unquoted()

		parameterType, err := parametersValue.Value().LookupPath(cue.MakePath(cue.Str("type"))).String()
		if err != nil {
			return nil, err
		}

		parameterReq := req.Parameters[parameterName]

		switch activityspec.ServiceSpawnParameterType(parameterType) {
		case activityspec.ServiceSpawnParameterTypeString:
			s := parameterReq.String()
			parameters[parameterName] = &activityspec.ServiceSpawnParameter{String: &s}
		case activityspec.ServiceSpawnParameterTypeSpace:
			space := parameterReq.Space(req.ForceReadOnly)
			view, err := s.ResolveSpaceView(space, req.User)
			if err != nil {
				return nil, err
			}

			if view != nil {
				parameters[parameterName] = &activityspec.ServiceSpawnParameter{Space: view}
			}
		case activityspec.ServiceSpawnParameterTypeSpaces:
			spaces := parameterReq.Spaces(req.ForceReadOnly)
			multi := make([]substratefs.SpaceView, 0, len(spaces))
			for _, v := range spaces {
				view, err := s.ResolveSpaceView(&v, req.User)
				if err != nil {
					return nil, err
				}

				if view != nil {
					multi = append(multi, *view)
				}
			}

			parameters[parameterName] = &activityspec.ServiceSpawnParameter{Spaces: &multi}
		}
	}

	spawnDef := &activityspec.ServiceInstanceDef{}
	err = serviceDefSpawnValue.Decode(spawnDef)
	if err != nil {
		return nil, fmt.Errorf("error decoding ServiceDefSpawn: %w", err)
	}

	return &activityspec.ServiceSpawnResolution{
		ServiceName:        req.ServiceName,
		Parameters:         parameters,
		ServiceInstanceDef: *spawnDef,
	}, nil
}
