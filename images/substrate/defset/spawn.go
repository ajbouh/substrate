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

func (s *DefSet) ResolveService(ctx context.Context, sr activityspec.SpaceViewResolver, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResolution, bool, error) {
	serviceDefSpawnValue, err := s.resolveServiceDefSpawn(req)
	if err != nil {
		return nil, false, err
	}

	// TODO move this logic directly into cue expressions. Seems weird and redundant to have it here.

	parameterTypes := map[string]string{}
	parameters := activityspec.ServiceSpawnParameters{}
	spawnDef := &activityspec.ServiceInstanceDef{}

	err = func() error {
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
		return nil, false, err
	}

	varying := false

	for parameterName, parameterType := range parameterTypes {
		parameterReq := req.Parameters[parameterName]

		switch activityspec.ServiceSpawnParameterType(parameterType) {
		case activityspec.ServiceSpawnParameterTypeString:
			// This makes it easy to request a *new* id.
			if parameterName == "id" && parameterReq == "" {
				parameterReq = "id-" + ulid.Make().String()
				varying = true
			}
			parameters[parameterName] = &activityspec.ServiceSpawnParameter{String: &parameterReq}
		case activityspec.ServiceSpawnParameterTypeSpace:
			view, err := sr.ResolveSpaceView(ctx, parameterReq, req.ForceReadOnly, true, req.User)
			if err != nil {
				return nil, varying, err
			}

			if view != nil {
				if view.Creation != nil {
					varying = true
				}
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
					return nil, varying, err
				}

				if view != nil {
					if view.Creation != nil {
						varying = true
					}
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
	}, varying, nil
}
