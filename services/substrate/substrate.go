package substrate

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/url"
	"sync"
	"time"

	"github.com/ajbouh/substrate/pkg/activityspec"
	"github.com/ajbouh/substrate/pkg/substratefs"

	ulid "github.com/oklog/ulid/v2"
)

type Substrate struct {
	Driver activityspec.ProvisionDriver

	Layout *substratefs.Layout

	Services map[string]*activityspec.ServiceDef

	Origin         string
	OriginResolver string

	Mu *sync.RWMutex
	DB *sql.DB
}

func deepCloneViaJSON(dst, src interface{}) error {
	b, err := json.Marshal(src)
	if err != nil {
		return err
	}
	err = json.Unmarshal(b, &dst)
	if err != nil {
		return err
	}
	return nil
}

func (s *Substrate) ResolveActivity(ctx context.Context, activityName string) ([]*activityspec.ResolvedActivity, error) {
	s.Mu.RLock()
	defer s.Mu.RUnlock()

	activities := []*activityspec.ResolvedActivity{}

	for lensName, lens := range s.Services {
		for _, activity := range lens.Activities {
			if activity.Activity == activityName {
				activity0 := activity
				activities = append(activities, &activityspec.ResolvedActivity{
					ServiceName: lensName,
					Service:     lens,
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

func (s *Substrate) ResolveService(ctx context.Context, lensName string) (*activityspec.ServiceDef, error) {
	s.Mu.RLock()
	defer s.Mu.RUnlock()

	lens := s.Services[lensName]
	if lens == nil {
		return nil, nil
	}
	var result *activityspec.ServiceDef
	if err := deepCloneViaJSON(&result, lens); err != nil {
		return nil, err
	}
	return result, nil
}

func (s *Substrate) AllServices(ctx context.Context) (map[string]*activityspec.ServiceDef, error) {
	s.Mu.RLock()
	defer s.Mu.RUnlock()

	// use JSON encoding to defensively clone s.Services
	var result map[string]*activityspec.ServiceDef
	if err := deepCloneViaJSON(&result, s.Services); err != nil {
		return nil, err
	}
	return result, nil
}

func (s *Substrate) ResolveSpaceView(v *activityspec.SpaceViewRequest, ownerIfCreation, aliasIfCreation string) (view *substratefs.SpaceView, err error) {
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

func (s *Substrate) newSpawnRequest(ctx context.Context, req *activityspec.ActivitySpecRequest) (*activityspec.ActivitySpec, error) {
	lens := s.Services[req.ServiceName]
	if lens == nil {
		lenses := []string{}
		for k := range s.Services {
			lenses = append(lenses, k)
		}
		return nil, fmt.Errorf("no such lens: %q (have %#v)", req.ServiceName, lenses)
	}

	parameters := activityspec.ServiceSpawnParameters{}

	env := map[string]string{}

	if lens.Spawn.Env != nil {
		for k, v := range lens.Spawn.Env {
			env[k] = v
		}
	}

	env["JAMSOCKET_LENS"] = req.ServiceName
	env["JAMSOCKET_SUBSTRATE_ORIGIN"] = s.Origin
	env["JAMSOCKET_SUBSTRATE_ORIGIN_RESOLVER"] = s.OriginResolver

	env["PUBLIC_EXTERNAL_ORIGIN"] = s.Origin
	// env["ORIGIN"] = s.Origin

	if req.User != "" {
		env["JAMSOCKET_USER"] = req.User
	}

	if s.Origin != "" {
		env["JAMSOCKET_IFRAME_DOMAIN"] = s.Origin
	}

	// TODO need to check schema before we know how to interpret a given parameter...
	// Maybe write a method for each interpretation? Can return an error if it's impossible...
	for parameterName, parameterReq := range req.Parameters {
		parameterSchema := lens.Spawn.Schema[parameterName]
		switch parameterSchema.Type {
		case activityspec.ServiceSpawnParameterTypeString:
			parameters[parameterName] = &activityspec.ServiceSpawnParameter{
				EnvVars: map[string]string{
					*parameterSchema.EnvironmentVariableName: parameterReq.String(),
				},
			}
		case activityspec.ServiceSpawnParameterTypeSpace:
			space := parameterReq.Space(req.ForceReadOnly)
			view, err := s.ResolveSpaceView(space, req.User, "")
			if err != nil {
				return nil, err
			}

			if view != nil {
				if view.IsReadOnly {
					env["JAMSOCKET_SPACE_"+parameterName+"_readonly"] = "1"
				}

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

	// Present env vars as parameters
	parameters[""] = &activityspec.ServiceSpawnParameter{
		EnvVars: env,
	}

	return &activityspec.ActivitySpec{
		ServiceName: req.ServiceName,
		Parameters:  parameters,
		Schema: activityspec.ActivitySchema{
			Spawn: lens.Spawn.Schema,
		},
		Path: req.Path,

		Image: lens.Spawn.Image,
		// RequireBearerToken: false,
	}, nil
}

func (s *Substrate) Spawn(ctx context.Context, req *activityspec.ActivitySpecRequest) (*activityspec.ActivitySpawnResponse, error) {
	as, err := s.newSpawnRequest(ctx, req)
	if err != nil {
		return nil, err
	}
	return s.Driver.Spawn(ctx, as)
}

func (s *Substrate) Status(ctx context.Context, name string) (activityspec.ProvisionEvent, error) {
	return s.Driver.Status(ctx, name)
}

func (s *Substrate) StatusStream(ctx context.Context, name string) (<-chan activityspec.ProvisionEvent, error) {
	return s.Driver.StatusStream(ctx, name)
}

func (s *Substrate) NewProvisionFunc(cacheKey string, req *activityspec.ActivitySpecRequest) activityspec.ProvisionFunc {
	logf := func(fmt string, values ...any) {
		log.Printf(fmt+" cacheKey=%s", append(values, cacheKey)...)
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

		sres, err := s.Spawn(spawnCtx, req)
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
	req *activityspec.ActivitySpecRequest,
	views *activityspec.ActivitySpec,
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
	viewspecReq, _ := req.ActivitySpec()
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

	viewspec, _ := views.ActivitySpec()

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
