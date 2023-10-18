package substrate

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"sync"
	"time"

	"github.com/ajbouh/substrate/pkg/jamsocket"
	"github.com/ajbouh/substrate/pkg/substratefs"

	ulid "github.com/oklog/ulid/v2"
)

type Substrate struct {
	JamsocketClient *jamsocket.Client

	Layout *substratefs.Layout

	Lenses map[string]*Lens

	Origin         string
	OriginResolver string

	Mu *sync.RWMutex
	DB *sql.DB
}

type LensSpawnParameterType string

const LensSpawnParameterTypeString LensSpawnParameterType = "string"
const LensSpawnParameterTypeSpace LensSpawnParameterType = "space"
const LensSpawnParameterTypeSpaces LensSpawnParameterType = "spaces"

type LensSpawnParameterSchema struct {
	Type                    LensSpawnParameterType `json:"type"`
	EnvironmentVariableName string                 `json:"environment_variable_name,omitempty"`
	Description             string                 `json:"description,omitempty"`
	Optional                bool                   `json:"optional,omitempty"`
}

type LensSpawnOptions struct {
	Jamsocket *LensJamsocketOptions               `json:"jamsocket,omitempty"`
	Schema    map[string]LensSpawnParameterSchema `json:"schema,omitempty"`
	Env       map[string]string                   `json:"env,omitempty"`
}

type LensSpaceOptions struct {
	Preview string `json:"preview,omitempty"`
}

type LensJamsocketOptions struct {
	Service string            `json:"service"`
	Image   string            `json:"image"`
	Env     map[string]string `json:"env,omitempty"`
}

type LensActivityResponse struct {
	Schema map[string]any `json:"schema,omitempty"`
}

type LensActivityRequest struct {
	Path        string `json:"path"`
	Method      string `json:"method,omitempty"`
	Interactive bool   `json:"interactive,omitempty"`

	Schema map[string]any `json:"schema,omitempty"`
}

type LensActivity struct {
	Activity string                `json:"activity"`
	Label    string                `json:"label"`
	Image    *string               `json:"image,omitempty"`
	Priority *int                  `json:"priority,omitempty"`
	Request  *LensActivityRequest  `json:"request,omitempty"`
	Response *LensActivityResponse `json:"response,omitempty"`
}

type Lens struct {
	Name       string                  `json:"name"`
	Spawn      LensSpawnOptions        `json:"spawn"`
	Space      LensSpaceOptions        `json:"space"`
	Activities map[string]LensActivity `json:"activities"`
}

type ResolvedLensActivity struct {
	LensName string
	Lens     *Lens
	Activity *LensActivity
}

type SpawnRequest struct {
	ActivitySpec  ActivitySpecRequest
	User          string
	Ephemeral     bool
	ForceReadOnly bool
}

type SpawnResult struct {
	Name         string
	ActivitySpec string

	BackendURL  string
	Path        string
	BearerToken *string

	urlJoiner AuthenticatedURLJoinerFunc
	pathURL   *url.URL
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

func (s *Substrate) ResolveActivity(ctx context.Context, activityName string) ([]*ResolvedLensActivity, error) {
	s.Mu.RLock()
	defer s.Mu.RUnlock()

	activities := []*ResolvedLensActivity{}

	for lensName, lens := range s.Lenses {
		for _, activity := range lens.Activities {
			if activity.Activity == activityName {
				activity0 := activity
				activities = append(activities, &ResolvedLensActivity{
					LensName: lensName,
					Lens:     lens,
					Activity: &activity0,
				})
			}
		}
	}

	var result []*ResolvedLensActivity
	if err := deepCloneViaJSON(&result, activities); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *Substrate) ResolveLens(ctx context.Context, lensName string) (*Lens, error) {
	s.Mu.RLock()
	defer s.Mu.RUnlock()

	lens := s.Lenses[lensName]
	if lens == nil {
		return nil, nil
	}
	var result *Lens
	if err := deepCloneViaJSON(&result, lens); err != nil {
		return nil, err
	}
	return result, nil
}

func (s *Substrate) AllLenses(ctx context.Context) (map[string]*Lens, error) {
	s.Mu.RLock()
	defer s.Mu.RUnlock()

	// use JSON encoding to defensively clone s.Lenses
	var result map[string]*Lens
	if err := deepCloneViaJSON(&result, s.Lenses); err != nil {
		return nil, err
	}
	return result, nil
}

func (s *Substrate) ResolveSpaceView(v *SpaceViewRequest, ownerIfCreation, aliasIfCreation string) (view *substratefs.SpaceView, err error) {
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

func (s *Substrate) newSpawnRequest(ctx context.Context, req *SpawnRequest) (*jamsocket.SpawnRequest, *ActivitySpec, error) {
	lens := s.Lenses[req.ActivitySpec.LensName]
	if lens == nil {
		lenses := []string{}
		for k := range s.Lenses {
			lenses = append(lenses, k)
		}
		return nil, nil, fmt.Errorf("no such lens: %q (have %#v)", req.ActivitySpec.LensName, lenses)
	}

	spawnRequest := &jamsocket.SpawnRequest{
		Service: lens.Spawn.Jamsocket.Service,
		Env:     map[string]string{},
		// TODO need to add to preview, ui, and gateway first
		// TODO need to add headers to return value of provision func (gateway, ui)
		// TODO need to allow provisionfun to return a URL that will redirect (preview)
		RequireBearerToken: false,
	}

	if lens.Spawn.Jamsocket.Env != nil {
		for k, v := range lens.Spawn.Jamsocket.Env {
			spawnRequest.Env[k] = v
		}
	}

	if lens.Spawn.Env != nil {
		for k, v := range lens.Spawn.Env {
			spawnRequest.Env[k] = v
		}
	}

	spawnRequest.Env["JAMSOCKET_LENS"] = req.ActivitySpec.LensName
	spawnRequest.Env["JAMSOCKET_SUBSTRATE_ORIGIN"] = s.Origin
	spawnRequest.Env["JAMSOCKET_SUBSTRATE_ORIGIN_RESOLVER"] = s.OriginResolver

	spawnRequest.Env["PUBLIC_EXTERNAL_ORIGIN"] = s.Origin
	// spawnRequest.Env["ORIGIN"] = s.Origin

	if req.User != "" {
		spawnRequest.Env["JAMSOCKET_USER"] = req.User
	}

	if s.Origin != "" {
		spawnRequest.Env["JAMSOCKET_IFRAME_DOMAIN"] = s.Origin
	}

	views := LensSpawnParameters{}

	includeView := func(viewName string, includeSpaceIDInTarget bool, viewOpt *SpaceViewRequest) (*substratefs.SpaceView, error) {
		view, err := s.ResolveSpaceView(viewOpt, req.User, "")
		if err != nil {
			return nil, err
		}

		if view == nil {
			return nil, nil
		}

		targetPrefix := "/spaces/" + viewName
		if includeSpaceIDInTarget {
			targetPrefix += "/" + view.Tip.SpaceID.String()
		}

		spawnRequest.VolumeMounts = append(spawnRequest.VolumeMounts,
			&jamsocket.Mount{
				Type:     jamsocket.TypeBind,
				Source:   view.TreePath(),
				Target:   targetPrefix + "/tree",
				ReadOnly: view.IsReadOnly,
			},
			&jamsocket.Mount{
				Type:     jamsocket.TypeBind,
				Source:   view.OwnerFilePath(),
				Target:   targetPrefix + "/owner",
				ReadOnly: true,
			},
			&jamsocket.Mount{
				Type:     jamsocket.TypeBind,
				Source:   view.AliasFilePath(),
				Target:   targetPrefix + "/alias",
				ReadOnly: true,
			},
		)

		return view, nil
	}

	// TODO need to check schema before we know how to interpret a given parameter...
	// Maybe write a method for each interpretation? Can return an error if it's impossible...
	for viewName, viewReq := range req.ActivitySpec.Parameters {
		viewSchema := lens.Spawn.Schema[viewName]
		switch viewSchema.Type {
		case LensSpawnParameterTypeString:
			spawnRequest.Env[viewSchema.EnvironmentVariableName] = viewReq.String()
		case LensSpawnParameterTypeSpace:
			space := viewReq.Space(req.ForceReadOnly)
			view, err := includeView(viewName, false, space)
			if err != nil {
				return nil, nil, err
			}

			if view != nil {
				if view.IsReadOnly {
					spawnRequest.Env["JAMSOCKET_SPACE_"+viewName+"_readonly"] = "1"
				}

				views[viewName] = &LensSpawnParameter{Space: view}
			}
		case LensSpawnParameterTypeSpaces:
			spaces := viewReq.Spaces(req.ForceReadOnly)
			multi := make([]substratefs.SpaceView, 0, len(spaces))
			for _, v := range spaces {
				view, err := includeView(viewName, true, &v)
				if err != nil {
					return nil, nil, err
				}

				if view != nil {
					multi = append(multi, *view)
				}
			}

			views[viewName] = &LensSpawnParameter{Spaces: &multi}
		}
	}

	return spawnRequest, &ActivitySpec{
		LensName:   req.ActivitySpec.LensName,
		Parameters: views,
		Schema: ActivitySchema{
			Spawn: lens.Spawn.Schema,
		},
		Path: req.ActivitySpec.Path,
	}, nil
}

func (s *Substrate) Spawn(ctx context.Context, req *SpawnRequest) (*SpawnResult, error) {
	jsr, views, err := s.newSpawnRequest(ctx, req)
	if err != nil {
		return nil, err
	}
	if s.JamsocketClient == nil {
		return nil, fmt.Errorf("no jamsocket client")
	}
	r, err := s.JamsocketClient.Spawn(ctx, jsr)
	if err != nil {
		return nil, err
	}

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
				// InitialLens:   &req.ActivitySpec.LensName,
				// InitialMount: &SpaceMount{
				// 	Name:  viewName,
				// 	Multi: multi,
				// },
			})
		}

		err := s.WriteCollectionMembership(ctx, &CollectionMembership{
			Owner:      "system",
			Name:       "spawn",
			SpaceID:    spaceID,
			LensSpec:   req.ActivitySpec.LensName,
			CreatedAt:  now,
			IsPublic:   true,
			Attributes: map[string]any{},
		})
		return err
	}

	for viewName, view := range views.Parameters {
		switch {
		case view.Space != nil:
			err = visitSpace(viewName, false, view.Space)
			if err != nil {
				return nil, err
			}
		case view.Spaces != nil:
			for _, v := range *view.Spaces {
				err = visitSpace(viewName, true, &v)
				if err != nil {
					return nil, err
				}
			}
		}
	}

	eventULID := ulid.MustNew(nowTs, entropy)
	eventID := "ev-" + eventULID.String()
	viewspecReq, _ := req.ActivitySpec.ActivitySpec()
	err = s.WriteEvent(ctx, &Event{
		ID:        eventID,
		Type:      "spawn",
		Timestamp: now,
		// Parameters:       req.ActivitySpec.Parameters,
		ActivitySpec: viewspecReq,
		User:         req.User,
		Lens:         req.ActivitySpec.LensName,
		JamsocketSpawn: &JamsocketSpawnEvent{
			Request:  jsr,
			Response: r,
		},
	})
	if err != nil {
		return nil, err
	}

	for _, sp := range spaces {
		err = s.WriteSpace(ctx, sp)
		if err != nil {
			return nil, err
		}
	}

	viewspec, _ := views.ActivitySpec()

	if !req.Ephemeral {
		err = s.WriteActivity(ctx, &Activity{
			ActivitySpec: viewspec,
			CreatedAt:    now,
			Lens:         req.ActivitySpec.LensName,
		})
		if err != nil {
			return nil, err
		}
	}

	// TODO should ProvisionerCookieAuthenticationMode be a parameter?
	u, err := url.Parse(r.URL)
	if err != nil {
		return nil, err
	}

	pathURL, err := url.Parse(req.ActivitySpec.Path)
	if err != nil {
		return nil, err
	}

	return &SpawnResult{
		Name:         r.Name,
		ActivitySpec: viewspec,

		urlJoiner: MakeJoiner(u, r.BearerToken),
		pathURL:   pathURL,

		BackendURL:  r.URL,
		Path:        req.ActivitySpec.Path,
		BearerToken: r.BearerToken,
	}, nil
}

func (s *SpawnResult) URL(mode ProvisionerAuthenticationMode) (*url.URL, http.Header) {
	return s.urlJoiner(s.pathURL, mode)
}

func MakeJoiner(target *url.URL, token *string) AuthenticatedURLJoinerFunc {
	return func(rest *url.URL, mode ProvisionerAuthenticationMode) (*url.URL, http.Header) {
		var u url.URL
		if rest != nil {
			u = *rest
			targetQuery := target.RawQuery
			u.Scheme = target.Scheme
			u.Host = target.Host
			u.Path, u.RawPath = JoinURLPath(target, &u)
			if targetQuery == "" || u.RawQuery == "" {
				u.RawQuery = targetQuery + u.RawQuery
			} else {
				u.RawQuery = targetQuery + "&" + u.RawQuery
			}
		} else {
			u = *target
		}

		if token == nil {
			return &u, nil
		}

		switch mode {
		case ProvisionerCookieAuthenticationMode:
			var redirect url.URL
			redirect = u
			redirect.Host = ""
			redirect.Scheme = ""
			redirect.User = nil
			return &url.URL{
				Scheme:     u.Scheme,
				User:       u.User,
				Host:       u.Host,
				Path:       "/_plane_auth",
				RawPath:    "",
				OmitHost:   u.OmitHost,
				ForceQuery: false,
				RawQuery:   "token=" + *token + "&redirect=" + url.QueryEscape(redirect.String()),
				Fragment:   u.Fragment,
			}, nil
		case ProvisionerHeaderAuthenticationMode:
			fallthrough
		default:
			h := http.Header{
				"Authorization": []string{"Bearer " + *token},
			}
			return &u, h
		}
	}
}

// TODO either use AuthorizationHeader OR redirection
func (s *Substrate) MakeProvisioner(logf func(fmt string, values ...any), req *SpawnRequest) ProvisionFunc {
	mu := &sync.Mutex{}
	var gen = 0
	var cached *url.URL
	var cachedToken *string
	var cachedJoiner AuthenticatedURLJoinerFunc
	set := func(v *url.URL, t *string, j AuthenticatedURLJoinerFunc) {
		gen++
		copy := *v
		cached = &copy
		cachedToken = t
		cachedJoiner = j
		logf("action=cache:set gen=%d url=%s", gen, v)
	}
	get := func() (*url.URL, *string, AuthenticatedURLJoinerFunc, bool) {
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

	return func(ctx context.Context) (AuthenticatedURLJoinerFunc, bool, func(error), error) {
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

		if s.JamsocketClient == nil {
			return nil, false, nil, fmt.Errorf("no jamsocket client")
		}
		ch, err := s.JamsocketClient.StatusStream(streamCtx, sres.Name)
		if err != nil {
			streamCancel()
			return nil, false, nil, err
		}

		ready := false

		for event := range ch {
			if event.Error != nil {
				streamCancel()
				return nil, false, nil, fmt.Errorf("backend will never be ready; err=%w", event.Error)
			}

			if event.State.IsPending() {
				continue
			}

			if event.State.IsReady() {
				ready = true
				break
			}

			if event.State.IsGone() {
				streamCancel()
				return nil, false, nil, fmt.Errorf("backend will never be ready; status=%s time=%q", event.State, event.Time)
			}
		}

		if !ready {
			streamCancel()
			return nil, false, nil, fmt.Errorf("status stream ended without ready")
		}

		set(parsed, parsedToken, sres.urlJoiner)
		// Do this AFTER we've loaded the cache.
		cleanup := makeCleanup()
		go func() {
			// Stay subscribed and cleanup once it's gone.
			defer cleanup(fmt.Errorf("backend error or gone"))
			defer streamCancel()
			for event := range ch {
				if event.Error != nil || event.State.IsGone() {
					break
				}
			}
		}()

		return sres.urlJoiner, true, cleanup, nil
	}
}
