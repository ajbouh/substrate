package defset

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"sync"

	"cuelang.org/go/cue"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	substratefs "github.com/ajbouh/substrate/images/substrate/fs"
)

func (s *DefSet) SpawnService(ctx context.Context, driver activityspec.ProvisionDriver, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResponse, error) {
	serviceDefSpawnValue, err := s.resolveServiceDefSpawn(req)
	if err != nil {
		return nil, err
	}

	serviceSpawnResolution, err := s.resolveServiceSpawn(req, serviceDefSpawnValue)
	if err != nil {
		return nil, err
	}

	serviceSpawnResponse, err := driver.Spawn(ctx, serviceSpawnResolution)
	if err != nil {
		return nil, err
	}

	for _, fn := range s.ServiceSpawned {
		if err := fn.ServiceSpawned(ctx, driver, req, serviceSpawnResponse); err != nil {
			log.Printf("error notifying ServiceSpawned listener: %s", err)
		}

	}

	return serviceSpawnResponse, nil
}

var parameterTypePath = cue.MakePath(cue.Str("type"))

func (s *DefSet) IsConcrete(req *activityspec.ServiceSpawnRequest) (bool, error) {
	serviceDefSpawnValue, err := s.resolveServiceDefSpawn(req)
	if err != nil {
		return false, err
	}

	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	parametersValue, err := serviceDefSpawnValue.LookupPath(cue.MakePath(cue.Str("parameters"))).Fields()
	if err != nil {
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
			return false, err
		}

		if !req.Parameters[parameterName].IsConcrete(activityspec.ServiceSpawnParameterType(parameterType)) {
			return false, nil
		}
	}

	return true, nil
}

func (s *DefSet) resolveServiceDefSpawn(req *activityspec.ServiceSpawnRequest) (cue.Value, error) {
	serviceDefValue, ok := s.Services[req.ServiceName]
	if !ok {
		services := []string{}
		for k := range s.Services {
			services = append(services, k)
		}
		return cue.Value{}, fmt.Errorf("no such service: %q (have %#v)", req.ServiceName, services)
	}

	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	serviceDefSpawnValue := serviceDefValue.LookupPath(cue.MakePath(cue.Str("spawn")))
	serviceDefSpawnValue = serviceDefSpawnValue.FillPath(
		cue.MakePath(cue.Str("environment"), cue.Str("SUBSTRATE_URL_PREFIX")),
		req.URLPrefix,
	)

	for parameterName, parameterReq := range req.Parameters {
		serviceDefSpawnValue = serviceDefSpawnValue.FillPath(
			cue.MakePath(cue.Str("parameters"), cue.Str(parameterName), cue.Str("value")),
			parameterReq.String(),
		)
	}

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
			view, err := s.ResolveSpaceView(space, req.User, "")
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
				view, err := s.ResolveSpaceView(&v, req.User, "")
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

	serviceDefSpawn := &activityspec.ServiceDefSpawn{}
	err = serviceDefSpawnValue.Decode(serviceDefSpawn)
	if err != nil {
		return nil, err
	}

	return &activityspec.ServiceSpawnResolution{
		ServiceName:     req.ServiceName,
		Parameters:      parameters,
		ServiceDefSpawn: *serviceDefSpawn,
	}, nil
}

func (s *DefSet) NewProvisionFunc(driver activityspec.ProvisionDriver, req *activityspec.ServiceSpawnRequest) activityspec.ProvisionFunc {
	logf := func(fmt string, values ...any) {
		log.Printf(fmt, values...)
	}

	mu := &sync.Mutex{}
	var gen = 0
	var cached *url.URL
	var cachedToken *string
	set := func(v *url.URL, t *string) {
		gen++
		copy := *v
		cached = &copy
		cachedToken = t
		logf("action=cache:set gen=%d url=%s", gen, v)
	}
	get := func() (*url.URL, *string, bool) {
		logf("action=cache:get gen=%d url=%s", gen, cached)
		if cached != nil {
			copy := *cached
			return &copy, cachedToken, true
		}
		return nil, nil, false
	}
	makeCleanup := func() func(error) {
		cleanupGen := gen

		return func(reason error) {
			mu.Lock()
			defer mu.Unlock()
			if gen == cleanupGen {
				cached = nil
				logf("action=cache:clear gen=%d cleanupGen=%d err=%s", gen, cleanupGen, reason)
			} else {
				logf("action=cache:staleclear gen=%d cleanupGen=%d err=%s", gen, cleanupGen, reason)
			}
		}
	}

	return func(ctx context.Context) (*url.URL, bool, func(error), error) {
		mu.Lock()
		defer mu.Unlock()

		if target, _, ok := get(); ok {
			return target, false, makeCleanup(), nil
		}

		sres, err := s.SpawnService(ctx, driver, req)
		if err != nil {
			return nil, false, nil, err
		}

		var parsedToken *string
		if sres.BearerToken != nil {
			parsedToken = sres.BearerToken
		}

		parsed, err := url.Parse(sres.BackendURL)
		if err != nil {
			return nil, false, nil, err
		}

		streamCtx, streamCancel := context.WithCancel(context.Background())

		ch, err := driver.StatusStream(streamCtx, sres.Name)
		if err != nil {
			streamCancel()
			return nil, false, nil, err
		}

		ready := false

		for event := range ch {
			if event.Error() != nil {
				streamCancel()
				return nil, false, nil, fmt.Errorf("backend will never be ready; err=%w", event.Error())
			}

			if event.IsPending() {
				continue
			}

			if event.IsReady() {
				ready = true
				break
			}

			if event.IsGone() {
				streamCancel()
				return nil, false, nil, fmt.Errorf("backend will never be ready; event=%s", event.String())
			}
		}

		if !ready {
			streamCancel()
			return nil, false, nil, fmt.Errorf("status stream ended without ready")
		}

		set(parsed, parsedToken)
		// Do this AFTER we've loaded the cache.
		cleanup := makeCleanup()
		go func() {
			// Stay subscribed and cleanup once it's gone.
			defer cleanup(fmt.Errorf("backend error or gone"))
			defer streamCancel()
			for event := range ch {
				if event.Error() != nil || event.IsGone() {
					break
				}
			}
		}()

		return parsed, true, cleanup, nil
	}
}
