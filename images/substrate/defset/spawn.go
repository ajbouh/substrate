package defset

import (
	"context"
	"fmt"
	"sort"
	"strings"

	"cuelang.org/go/cue"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/oklog/ulid/v2"
)

func (s *DefSet) ResolveService(ctx context.Context, sr activityspec.SpaceViewResolver, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResolution, error) {
	serviceDefSpawnValue, err := s.resolveServiceDefSpawn(req)
	if err != nil {
		return nil, err
	}

	return s.resolveServiceSpawn(ctx, sr, req, serviceDefSpawnValue)
}

func (s *DefSet) IsConcrete(sr activityspec.SpaceViewResolver, req *activityspec.ServiceSpawnRequest) (bool, error) {
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

		if !sr.IsSpaceViewConcrete(req.Parameters[parameterName], activityspec.ServiceSpawnParameterType(parameterType)) {
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
			parameterReq,
		)
	}

	s.serviceSpawnCueValueLRU.Add(req.CanonicalFormat, serviceDefSpawnValue)
	return serviceDefSpawnValue, nil
}

// TODO move this logic directly into cue expressions. Seems weird and redundant to have it here.
func (s *DefSet) resolveServiceSpawn(ctx context.Context, sr activityspec.SpaceViewResolver, req *activityspec.ServiceSpawnRequest, serviceDefSpawnValue cue.Value) (*activityspec.ServiceSpawnResolution, error) {
	parameterTypes := map[string]string{}
	parameters := activityspec.ServiceSpawnParameters{}
	spawnDef := &activityspec.ServiceInstanceDef{}

	err := func() error {
		s.CueMu.Lock()
		defer s.CueMu.Unlock()

		parametersValue, err := serviceDefSpawnValue.LookupPath(cue.MakePath(cue.Str("parameters"))).Fields()
		if err != nil {
			return fmt.Errorf("error decoding service parametersValue: %w", err)
		}

		for parametersValue.Next() {
			sel := parametersValue.Selector()
			if !sel.IsString() {
				continue
			}
			parameterName := sel.Unquoted()

			parameterType, err := parametersValue.Value().LookupPath(cue.MakePath(cue.Str("type"))).String()
			if err != nil {
				return err
			}

			parameterTypes[parameterName] = parameterType
		}

		err = serviceDefSpawnValue.Decode(spawnDef)
		if err != nil {
			return fmt.Errorf("error decoding ServiceDefSpawn: %w", err)
		}

		return nil
	}()
	if err != nil {
		return nil, err
	}

	for parameterName, parameterType := range parameterTypes {
		parameterReq := req.Parameters[parameterName]

		switch activityspec.ServiceSpawnParameterType(parameterType) {
		case activityspec.ServiceSpawnParameterTypeString:
			// This makes it easy to request a *new* id.
			if parameterName == "id" && parameterReq == "" {
				parameterReq = "id-" + ulid.Make().String()
			}
			parameters[parameterName] = &activityspec.ServiceSpawnParameter{String: &parameterReq}
		case activityspec.ServiceSpawnParameterTypeSpace:
			view, err := sr.ResolveSpaceView(ctx, parameterReq, req.ForceReadOnly, true, req.User)
			if err != nil {
				return nil, err
			}

			if view != nil {
				parameters[parameterName] = &activityspec.ServiceSpawnParameter{Space: view}
			}
		case activityspec.ServiceSpawnParameterTypeSpaces:
			split := strings.Split(parameterReq, activityspec.SpaceViewMultiSep)
			multi := []activityspec.SpaceView{}
			for _, m := range split {
				if m == "" {
					continue
				}
				view, err := sr.ResolveSpaceView(ctx, m, req.ForceReadOnly, true, req.User)
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

	return &activityspec.ServiceSpawnResolution{
		ServiceName:        req.ServiceName,
		Parameters:         parameters,
		ServiceInstanceDef: *spawnDef,
	}, nil
}
