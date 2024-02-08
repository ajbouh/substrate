package defset

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"sync"

	"cuelang.org/go/cue"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/fs"
)

func (s *DefSet) SpawnActivity(ctx context.Context, driver activityspec.ProvisionDriver, req *activityspec.ActivitySpecRequest) (*activityspec.ActivitySpawnResponse, error) {
	viewspec, _ := req.ActivitySpec()

	as, err := s.NewSpawnRequest(ctx, &req.ServiceSpawnRequest)
	if err != nil {
		return nil, err
	}

	sres, err := driver.Spawn(ctx, as)
	if err != nil {
		return nil, err
	}

	pathURL, err := url.Parse(req.Path)
	if err != nil {
		return nil, err
	}

	return &activityspec.ActivitySpawnResponse{
		ActivitySpec: viewspec,

		PathURL: pathURL,
		Path:    req.Path,

		ServiceSpawnResponse: *sres,
	}, nil
}

var parameterTypePath = cue.MakePath(cue.Str("type"))

func (s *DefSet) NewSpawnRequest(ctx context.Context, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResolution, error) {
	s.CueMu.Lock()
	defer s.CueMu.Unlock()

	log.Printf("newSpawnRequest req %#v", req)
	serviceDefValue, ok := s.Services[req.ServiceName]
	if !ok {
		lenses := []string{}
		for k := range s.Services {
			lenses = append(lenses, k)
		}
		return nil, fmt.Errorf("no such service: %q (have %#v)", req.ServiceName, lenses)
	}

	parameters := activityspec.ServiceSpawnParameters{}
	cueCtx := serviceDefValue.Context()

	for parameterName, parameterReq := range req.Parameters {
		parameterTypeValue := serviceDefValue.LookupPath(parameterTypePath)
		parameterType, err := parameterTypeValue.String()
		if err != nil {
			return nil, err
		}

		serviceDefValue = serviceDefValue.FillPath(
			cue.MakePath(cue.Str("spawn"), cue.Str("parameters"), cue.Str(parameterName), cue.Str("value")),
			cueCtx.Encode(parameterReq.String()),
		)

		switch activityspec.ServiceSpawnParameterType(parameterType) {
		case activityspec.ServiceSpawnParameterTypeResource:
			r := parameterReq.Resource()
			parameters[parameterName] = &activityspec.ServiceSpawnParameter{Resource: r}
			serviceDefValue = serviceDefValue.FillPath(
				cue.MakePath(cue.Str("spawn"), cue.Str("parameters"), cue.Str(parameterName), cue.Str("resource")),
				cueCtx.Encode(map[string]any{
					"unit":    r.Unit,
					"quantiy": r.Quantity,
				}))
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

	serviceDef := &activityspec.ServiceDef{}
	err := serviceDefValue.Decode(serviceDef)
	if err != nil {
		return nil, err
	}

	return &activityspec.ServiceSpawnResolution{
		ServiceName:     req.ServiceName,
		Parameters:      parameters,
		ServiceDefSpawn: serviceDef.Spawn,
		ExtraEnvironment: map[string]string{
			"SUBSTRATE_URL_PREFIX": req.URLPrefix,
		},
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

		spawnCtx, _ := context.WithCancel(context.Background())

		as, err := s.NewSpawnRequest(spawnCtx, req)
		if err != nil {
			return nil, false, nil, err
		}

		sres, err := driver.Spawn(ctx, as)
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
