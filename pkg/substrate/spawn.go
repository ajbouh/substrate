package substrate

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"sync"
	"time"

	"cuelang.org/go/cue"
	"github.com/ajbouh/substrate/pkg/activityspec"
	"github.com/ajbouh/substrate/pkg/substratefs"

	ulid "github.com/oklog/ulid/v2"
)

func (s *Substrate) ProvisionReverseProxy(views *activityspec.ServiceSpawnRequest) http.Handler {
	return s.ProvisionerCache.ProvisionReverseProxy(views)
}

func (s *Substrate) ProvisionRedirector(views *activityspec.ServiceSpawnRequest, redirector func(targetFunc activityspec.AuthenticatedURLJoinerFunc) (int, string, error)) http.Handler {
	return s.ProvisionerCache.ProvisionRedirector(views, redirector)
}

var spawnEnvironmentPath = cue.MakePath(cue.Str("spawn"), cue.Str("environment"))

var parameterTypePath = cue.MakePath(cue.Str("type"))

func (s *Substrate) newSpawnRequest(ctx context.Context, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResolution, error) {
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

	env := map[string]string{}

	env["JAMSOCKET_LENS"] = req.ServiceName
	env["JAMSOCKET_SUBSTRATE_ORIGIN"] = s.Origin
	env["JAMSOCKET_SUBSTRATE_ORIGIN_RESOLVER"] = s.OriginResolver

	env["PUBLIC_EXTERNAL_ORIGIN"] = s.Origin
	env["ORIGIN"] = s.Origin
	// TODO we shouldn't hardcode this.
	env["INTERNAL_SUBSTRATE_HOST"] = "substrate:8080"
	env["INTERNAL_SUBSTRATE_PROTOCOL"] = "http:"

	if req.User != "" {
		env["JAMSOCKET_USER"] = req.User
	}

	if s.Origin != "" {
		env["JAMSOCKET_IFRAME_DOMAIN"] = s.Origin
	}

	serviceDefValue = serviceDefValue.FillPath(spawnEnvironmentPath, cueCtx.Encode(env))

	serviceDef := &activityspec.ServiceDef{}
	err := serviceDefValue.Decode(serviceDef)
	if err != nil {
		return nil, err
	}

	return &activityspec.ServiceSpawnResolution{
		ServiceName:  req.ServiceName,
		Parameters:   parameters,
		ServiceDefSpawn: serviceDef.Spawn,
	}, nil
}

func (s *Substrate) SpawnService(ctx context.Context, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResponse, error) {
	as, err := s.newSpawnRequest(ctx, req)
	if err != nil {
		return nil, err
	}
	return s.Driver.Spawn(ctx, as)
}

func (s *Substrate) SpawnActivity(ctx context.Context, req *activityspec.ActivitySpecRequest) (*activityspec.ActivitySpawnResponse, error) {
	viewspec, _ := req.ActivitySpec()

	sres, err := s.SpawnService(ctx, &req.ServiceSpawnRequest)
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

func (s *Substrate) Status(ctx context.Context, name string) (activityspec.ProvisionEvent, error) {
	return s.Driver.Status(ctx, name)
}

func (s *Substrate) StatusStream(ctx context.Context, name string) (<-chan activityspec.ProvisionEvent, error) {
	return s.Driver.StatusStream(ctx, name)
}

func (s *Substrate) NewProvisionFunc(req *activityspec.ServiceSpawnRequest) activityspec.ProvisionFunc {
	logf := func(fmt string, values ...any) {
		log.Printf(fmt, values...)
	}

	mu := &sync.Mutex{}
	var gen = 0
	var cached *url.URL
	var cachedToken *string
	var cachedJoiner activityspec.AuthenticatedURLJoinerFunc
	set := func(v *url.URL, t *string, j activityspec.AuthenticatedURLJoinerFunc) {
		gen++
		copy := *v
		cached = &copy
		cachedToken = t
		cachedJoiner = j
		logf("action=cache:set gen=%d url=%s", gen, v)
	}
	get := func() (*url.URL, *string, activityspec.AuthenticatedURLJoinerFunc, bool) {
		logf("action=cache:get gen=%d url=%s", gen, cached)
		if cached != nil {
			copy := *cached
			return &copy, cachedToken, cachedJoiner, true
		}
		return nil, nil, nil, false
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

	return func(ctx context.Context) (activityspec.AuthenticatedURLJoinerFunc, bool, func(error), error) {
		mu.Lock()
		defer mu.Unlock()

		if _, _, joiner, ok := get(); ok {
			return joiner, false, makeCleanup(), nil
		}

		spawnCtx, _ := context.WithCancel(context.Background())

		sres, err := s.SpawnService(spawnCtx, req)
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

		ch, err := s.StatusStream(streamCtx, sres.Name)
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

		set(parsed, parsedToken, sres.URLJoiner)
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

		return sres.URLJoiner, true, cleanup, nil
	}
}

func (s *Substrate) WriteSpawn(
	ctx context.Context,
	req *activityspec.ServiceSpawnRequest,
	views *activityspec.ServiceSpawnResolution,
	res *activityspec.ActivitySpawnResponse,
) error {
	var err error

	var spaces = []*Space{}
	entropy := ulid.DefaultEntropy()
	now := time.Now()
	nowTs := ulid.Timestamp(now)

	visitSpace := func(viewName string, multi bool, view *substratefs.SpaceView) error {
		spaceID := view.Tip.SpaceID.String()

		if view.Creation != nil {
			var forkedFromRef *string
			var forkedFromID *string
			baseRef := view.Creation.Base
			if baseRef != nil {
				base := baseRef.String()
				baseID := baseRef.TipRef.SpaceID.String()
				forkedFromRef = &base
				forkedFromID = &baseID
			}
			spaces = append(spaces, &Space{
				Owner:         req.User,
				Alias:         spaceID, // initial alias is just the ID itself
				ID:            spaceID,
				ForkedFromRef: forkedFromRef,
				ForkedFromID:  forkedFromID,
				CreatedAt:     now,
				// InitialService:   &req.ActivitySpec.ServiceName,
				// InitialMount: &SpaceMount{
				// 	Name:  viewName,
				// 	Multi: multi,
				// },
			})
		}

		err := s.WriteCollectionMembership(ctx, &CollectionMembership{
			Owner:       "system",
			Name:        "spawn",
			SpaceID:     spaceID,
			ServiceSpec: req.ServiceName,
			CreatedAt:   now,
			IsPublic:    true,
			Attributes:  map[string]any{},
		})
		return err
	}

	for viewName, view := range views.Parameters {
		switch {
		case view.Space != nil:
			err = visitSpace(viewName, false, view.Space)
			if err != nil {
				return err
			}
		case view.Spaces != nil:
			for _, v := range *view.Spaces {
				err = visitSpace(viewName, true, &v)
				if err != nil {
					return err
				}
			}
		}
	}

	eventULID := ulid.MustNew(nowTs, entropy)
	eventID := "ev-" + eventULID.String()
	viewspecReq, _ := req.Format()
	err = s.WriteEvent(ctx, &Event{
		ID:        eventID,
		Type:      "spawn",
		Timestamp: now,
		// Parameters:       req.ActivitySpec.Parameters,
		ActivitySpec: viewspecReq,
		User:         req.User,
		Service:      req.ServiceName,
		Response:     res,
	})
	if err != nil {
		return err
	}

	for _, sp := range spaces {
		err = s.WriteSpace(ctx, sp)
		if err != nil {
			return err
		}
	}

	viewspec, _ := views.Format()

	if !req.Ephemeral {
		err = s.WriteActivity(ctx, &Activity{
			ActivitySpec: viewspec,
			CreatedAt:    now,
			Service:      req.ServiceName,
		})
		if err != nil {
			return err
		}
	}

	return nil
}
