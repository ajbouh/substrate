package main

import (
	"encoding/json"
	"fmt"
	"log"
	"mime"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"

	form "github.com/go-playground/form/v4"

	"github.com/ajbouh/substrate/pkg/activityspec"
	"github.com/ajbouh/substrate/pkg/auth"
	"github.com/ajbouh/substrate/services/substrate"
)

func hasContentType(req *http.Request, mimetype string) bool {
	for _, v := range strings.Split(req.Header.Get("Content-Type"), ",") {
		t, _, err := mime.ParseMediaType(v)
		if err == nil && t == mimetype {
			return true
		}
	}
	return false
}

type JSONResponseWriter func(v interface{}, status int, err error)

func newJSONResponseWriter(rw http.ResponseWriter) JSONResponseWriter {
	return func(v interface{}, status int, err error) {
		if err == nil {
			header := rw.Header()
			header.Set("Content-Type", "application/json")

			var out []byte
			out, err = json.Marshal(v)

			if err == nil {
				rw.WriteHeader(status)
				rw.Write(out)
			}
		}

		if err != nil {
			http.Error(rw, fmt.Sprintf(`{"message": %q}`, err.Error()), status)
		}
	}
}

func getValueAsStringPtr(query url.Values, key string) *string {
	if query.Has(key) {
		s := query.Get(key)
		return &s
	}
	return nil
}

func getValueAsBoolPtr(query url.Values, key string) *bool {
	if query.Has(key) {
		s := query.Get(key)
		b, err := strconv.ParseBool(s)
		if err != nil {
			return nil
		}
		return &b
	}
	return nil
}

func getValueAsIntPtr(query url.Values, key string) *int {
	if query.Has(key) {
		s := query.Get(key)
		i, err := strconv.Atoi(s)
		if err != nil {
			return nil
		}
		return &i
	}
	return nil
}

func readRequestBody(req *http.Request, v interface{}) (int, error) {
	var err error
	switch {
	case req.ContentLength == 0:
	case hasContentType(req, "application/json"):
		err = json.NewDecoder(req.Body).Decode(v)
	case hasContentType(req, "application/x-www-form-urlencoded"):
		err = req.ParseForm()
		if err == nil {
			err = form.NewDecoder().Decode(v, req.Form)
		}
	case hasContentType(req, "multipart/form-data"):
		err = req.ParseMultipartForm(1 << 20)
		if err == nil {
			err = form.NewDecoder().Decode(v, req.MultipartForm.Value)
		}
	default:
		return http.StatusUnsupportedMediaType, fmt.Errorf("content-type must be application/json or form; got %q, content-length=%v", req.Header.Get("Content-Type"), req.ContentLength)
	}

	if err != nil {
		return http.StatusBadRequest, err
	}

	return http.StatusOK, nil
}

func stringPtr(s string) *string {
	return &s
}

func newApiHandler(s *substrate.Substrate) http.Handler {
	router := httprouter.New()

	handleRaw := func(method, route string, f func(rw http.ResponseWriter, req *http.Request, p httprouter.Params)) {
		// register below / and /gw/substrate/
		router.Handle(method, route, f)
		router.Handle(method, "/gw/substrate"+route, f)
	}

	handle := func(method, route string, f func(req *http.Request, p httprouter.Params) (interface{}, int, error)) {
		handleRaw(method, route, func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
			jsonrw := newJSONResponseWriter(rw)
			jsonrw(f(req, p))
		})
	}

	type ActivityResult struct {
		URL string `json:"url"`
		// Status          *jamsocket.StatusEvent `json:"status"`
		StatusStreamURL string `json:"status_stream_url"`

		ActivitySpec string `json:"activityspec"`
	}

	type ActivityRequest struct {
		ActivitySpec  string `json:"activityspec"`
		ForceSpawn    bool   `json:"force_spawn"`
		ForceReadOnly bool   `json:"force_read_only"`
	}

	handle("POST", "/api/v1/activities", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		user, ok := auth.UserFromContext(req.Context())
		if !ok {
			return nil, http.StatusBadRequest, fmt.Errorf("user not available in context")
		}

		r := &ActivityRequest{}
		status, err := readRequestBody(req, &r)
		if err != nil {
			return nil, status, err
		}

		statusStreamURLPrefix := strings.Replace(req.URL.Path, "/activities", "/backend/jamsocket", 1)
		if !strings.HasSuffix(statusStreamURLPrefix, "/") {
			statusStreamURLPrefix = statusStreamURLPrefix + "/"
		}

		views, err := activityspec.ParseActivitySpecRequest(r.ActivitySpec, r.ForceReadOnly)
		if err != nil {
			return nil, http.StatusBadRequest, err
		}

		if !r.ForceSpawn {
			as, concrete := views.ActivitySpec()
			if !concrete {
				return nil, http.StatusBadRequest, fmt.Errorf("as must be concrete to be used with resume")
			}

			events, err := s.ListEvents(req.Context(), &substrate.EventListRequest{
				EventWhere: substrate.EventWhere{
					ActivitySpec: &as,
					Type:         stringPtr("spawn"),
				},
				OrderBy: &substrate.OrderBy{Descending: true},
				Limit:   &substrate.Limit{Limit: 1},
			})
			if err != nil {
				return nil, http.StatusInternalServerError, err
			}

			fmt.Printf("events: %#v\n", events)

			if len(events) > 0 {
				event := events[0]
				backendStatus, err := s.Status(req.Context(), event.Response.Name)
				if err != nil {
					return nil, http.StatusInternalServerError, err
				}

				if backendStatus.IsReady() || backendStatus.IsPending() {
					sres, err := event.SpawnResult()
					if err != nil {
						// Is this right? Or should we respawn?
						return nil, http.StatusInternalServerError, err
					}

					u, _ := sres.URL(activityspec.ProvisionerCookieAuthenticationMode)

					return &ActivityResult{
						URL: u.String(),
						// Status:          backendStatus,
						StatusStreamURL: statusStreamURLPrefix + event.Response.Name + "/status/stream",
						ActivitySpec:    event.ActivitySpec,
					}, http.StatusOK, nil
				}
			}
		}

		views.User = user.GithubUsername
		sres, err := s.Spawn(req.Context(), views)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		u, _ := sres.URL(activityspec.ProvisionerCookieAuthenticationMode)
		return &ActivityResult{
			URL: u.String(),
			// Status:          nil,
			StatusStreamURL: statusStreamURLPrefix + sres.Name + "/status/stream",
			ActivitySpec:    sres.ActivitySpec,
		}, http.StatusOK, nil
	})

	handle("POST", "/api/v1/spaces", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		user, ok := auth.UserFromContext(req.Context())
		if !ok {
			return nil, http.StatusBadRequest, fmt.Errorf("user not available in context")
		}

		// TODO should we allow setting an alias here?
		r := &activityspec.SpaceViewRequest{}
		status, err := readRequestBody(req, &r)
		if err != nil {
			return nil, status, err
		}

		alias := ""
		view, err := s.ResolveSpaceView(r, user.GithubUsername, alias)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		var forkedFromRef *string
		var forkedFromID *string
		var createdAt time.Time
		if view.Creation != nil {
			createdAt = view.Creation.Time
			if view.Creation.Base != nil {
				if view.Creation.Base.CheckpointRef != nil {
					ref := view.Creation.Base.CheckpointRef.String()
					forkedFromRef = &ref
					id := view.Creation.Base.CheckpointRef.SpaceID.String()
					forkedFromID = &id
				}
				if view.Creation.Base.TipRef != nil {
					ref := view.Creation.Base.TipRef.String()
					forkedFromRef = &ref
					id := view.Creation.Base.TipRef.SpaceID.String()
					forkedFromID = &id
				}
			}
		}

		alias, err = view.Alias()
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		err = s.WriteSpace(req.Context(), &substrate.Space{
			Owner:         user.GithubUsername,
			Alias:         alias, // initial alias is just the ID itself
			ID:            view.Tip.SpaceID.String(),
			ForkedFromRef: forkedFromRef,
			ForkedFromID:  forkedFromID,
			CreatedAt:     createdAt,
			// InitialService:   &req.ActivitySpec.ServiceName,
			// InitialMount: &SpaceMount{
			// 	Name:  viewName,
			// 	Multi: multi,
			// },
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		return struct {
			SpaceID string `json:"space"`
		}{
			SpaceID: view.Tip.String(),
		}, http.StatusOK, nil
	})

	handle("DELETE", "/api/v1/spaces/:space", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		user, ok := auth.UserFromContext(req.Context())
		if !ok {
			return nil, http.StatusBadRequest, fmt.Errorf("user not available in context")
		}

		w := p.ByName("space")
		result, err := s.ListSpaces(req.Context(), &substrate.SpaceListQuery{
			SpaceWhere: substrate.SpaceWhere{
				ID: &w,
			},
			Limit: &substrate.Limit{
				Limit: 1,
			},
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		if len(result) == 0 {
			return nil, http.StatusNotFound, nil
		}
		ws := result[0]

		if ws.Owner != user.GithubUsername {
			return nil, http.StatusUnauthorized, fmt.Errorf("only the owner of the space can delete it")
		}

		err = s.DeleteSpace(req.Context(), &substrate.SpaceWhere{
			ID: &ws.ID,
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		return nil, http.StatusOK, nil
	})

	handle("PATCH", "/api/v1/spaces/:space", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		r := &substrate.SpaceListingPatch{}
		status, err := readRequestBody(req, &r)
		if err != nil {
			return nil, status, err
		}
		r.ID = p.ByName("space")
		err = s.PatchSpace(req.Context(), r)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		return nil, http.StatusOK, nil
	})

	handleRaw("GET", "/api/v1/backend/:backend/status/stream", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		ch, err := s.StatusStream(req.Context(), p.ByName("backend"))
		if err != nil {
			http.Error(rw, fmt.Sprintf("upstream error: %s", err), http.StatusInternalServerError)
			return
		}

		flusher, ok := rw.(http.Flusher)
		if !ok {
			http.Error(rw, "can't stream events without response writer supporting http.Flusher", http.StatusInternalServerError)
			return
		}

		header := rw.Header()
		header.Set("Content-Type", "text/event-stream")
		header.Set("Cache-Control", "no-cache")
		header.Set("Connection", "keep-alive")

		for event := range ch {
			b, err := json.Marshal(event)
			if err != nil {
				log.Printf("error marshaling event: %s event=%#v", err, event)
				return
			}
			fmt.Fprintf(rw, "data: %s\n\n", string(b))

			flusher.Flush()
		}
	})

	handle("GET", "/api/v1/lenses/:lens", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		lens, err := s.ResolveService(req.Context(), p.ByName("lens"))
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		if lens == nil {
			return nil, http.StatusNotFound, err
		}
		return lens, http.StatusOK, nil
	})

	handle("GET", "/api/v1/activities", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		query := req.URL.Query()
		activities, err := s.ListActivities(req.Context(), &substrate.ActivityListRequest{
			ActivityWhere: substrate.ActivityWhere{
				Service: getValueAsStringPtr(query, "lens"),
			},
			Limit: substrate.LimitFromPtr(getValueAsIntPtr(query, "limit")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		type as struct {
			ActivitySpec string    `json:"activityspec"`
			CreatedAt    time.Time `json:"created_at"`
		}

		list := make([]as, 0, len(activities))
		for _, activity := range activities {
			list = append(list, as{
				ActivitySpec: activity.ActivitySpec,
				CreatedAt:    activity.CreatedAt,
			})
		}

		return list, http.StatusOK, nil
	})

	handle("GET", "/api/v1/activities/*activityspec", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		as := strings.TrimPrefix(p.ByName("activityspec"), "/")
		activity, err := activityspec.ParseActivitySpecRequest(as, false)
		if err != nil {
			return nil, http.StatusBadRequest, err
		}

		spaces, _, err := s.ResolveConcreteServiceSpawnParameterRequests(req.Context(), activity.ServiceName, activity.Parameters, false)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		return map[string]any{
			"spaces":   spaces,
			"activity": activity,
		}, http.StatusOK, nil
	})

	handle("GET", "/api/v1/spaces/:space", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		user, ok := auth.UserFromContext(req.Context())
		if !ok {
			return nil, http.StatusBadRequest, fmt.Errorf("user not available in context")
		}

		w := p.ByName("space")
		result, err := s.ListSpaces(req.Context(), &substrate.SpaceListQuery{
			SpaceWhere: substrate.SpaceWhere{
				ID: &w,
			},
			SelectNestedCollections: &substrate.CollectionMembershipWhere{
				Owner: stringPtr(user.GithubUsername),
			},
			Limit: &substrate.Limit{
				Limit: 1,
			},
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		if len(result) == 0 {
			return nil, http.StatusNotFound, nil
		}
		return result[0], http.StatusOK, nil
	})

	handle("GET", "/api/v1/lenses", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		lenses, err := s.AllServices(req.Context())
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		return lenses, http.StatusOK, nil
	})

	handle("GET", "/api/v1/spaces", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		query := req.URL.Query()
		result, err := s.ListSpaces(req.Context(), &substrate.SpaceListQuery{
			SpaceWhere: substrate.SpaceWhere{
				Owner:        getValueAsStringPtr(query, "owner"),
				ForkedFromID: getValueAsStringPtr(query, "forked_from"),
			},
			SelectNestedCollections: &substrate.CollectionMembershipWhere{
				Owner:       getValueAsStringPtr(query, "collection_owner"),
				Name:        getValueAsStringPtr(query, "collection_name"),
				NamePrefix:  getValueAsStringPtr(query, "collection_prefix"),
				ServiceSpec: getValueAsStringPtr(query, "collection_lensspec"),
				IsPublic:    getValueAsBoolPtr(query, "collection_public"),
			},
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return result, http.StatusOK, nil
	})

	// List all collections for an owner
	handle("GET", "/api/v1/collections/:owner", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		query := req.URL.Query()
		result, err := s.ListCollections(req.Context(), &substrate.CollectionListQuery{
			CollectionMembershipWhere: substrate.CollectionMembershipWhere{
				Owner: stringPtr(p.ByName("owner")),
			},
			Limit: substrate.LimitFromPtr(getValueAsIntPtr(query, "limit")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return result, http.StatusOK, nil
	})

	// Get specific collection (or list of collections with given prefix) for an owner
	handle("GET", "/api/v1/collections/:owner/:name", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		query := req.URL.Query()
		name := p.ByName("name")
		var nameP *string
		var prefixP *string
		if strings.HasSuffix(name, "*") {
			prefixP = stringPtr(strings.TrimSuffix(name, "*"))
		} else {
			nameP = &name
		}
		result, err := s.ListCollections(req.Context(), &substrate.CollectionListQuery{
			CollectionMembershipWhere: substrate.CollectionMembershipWhere{
				Owner:      stringPtr(p.ByName("owner")),
				Name:       nameP,
				NamePrefix: prefixP,
			},
			Limit: substrate.LimitFromPtr(getValueAsIntPtr(query, "limit")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		if len(result) == 0 {
			return nil, http.StatusNotFound, nil
		}
		return result[0], http.StatusOK, nil
	})

	// Attach a lens to a collection
	handle("POST", "/api/v1/collections/:owner/:name/lenses", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		r := struct {
			ServiceSpec string         `json:"lensspec"`
			IsPublic    bool           `json:"public,omitempty"`
			Attributes  map[string]any `json:"attributes,omitempty"`
		}{}
		status, err := readRequestBody(req, &r)
		if err != nil {
			return nil, status, err
		}

		// TODO take a space spawned by git-export, use it as config for export
		// TODO does the lensspec accept any inputs other than the collection?
		// TODO If so, need to create it as needed and return a proper lensspec.
		// TODO

		err = s.WriteCollectionMembership(req.Context(), &substrate.CollectionMembership{
			Owner:       p.ByName("owner"),
			Name:        p.ByName("name"),
			ServiceSpec: r.ServiceSpec,
			IsPublic:    r.IsPublic,
			Attributes:  r.Attributes,
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return nil, http.StatusOK, nil
	})

	// Add a space to a collection
	handle("POST", "/api/v1/collections/:owner/:name/spaces", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		r := struct {
			SpaceID    string         `json:"space"`
			IsPublic   bool           `json:"public,omitempty"`
			Attributes map[string]any `json:"attributes,omitempty"`
		}{}
		status, err := readRequestBody(req, &r)
		if err != nil {
			return nil, status, err
		}
		err = s.WriteCollectionMembership(req.Context(), &substrate.CollectionMembership{
			Owner:      p.ByName("owner"),
			Name:       p.ByName("name"),
			SpaceID:    r.SpaceID,
			IsPublic:   r.IsPublic,
			Attributes: r.Attributes,
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return nil, http.StatusOK, nil
	})

	// Remove a space from a collection
	handle("DELETE", "/api/v1/collections/:owner/:name/spaces/:space", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		err := s.DeleteCollectionMembership(req.Context(), &substrate.CollectionMembershipWhere{
			Owner:   stringPtr(p.ByName("owner")),
			Name:    stringPtr(p.ByName("name")),
			SpaceID: stringPtr(p.ByName("space")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return nil, http.StatusOK, nil
	})

	// Remove a lens from a collection
	handle("DELETE", "/api/v1/collections/:owner/:name/lenses/:lensspec", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		err := s.DeleteCollectionMembership(req.Context(), &substrate.CollectionMembershipWhere{
			Owner:       stringPtr(p.ByName("owner")),
			Name:        stringPtr(p.ByName("name")),
			ServiceSpec: stringPtr(p.ByName("lensspec")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return nil, http.StatusOK, nil
	})

	handle("GET", "/api/v1/collections/:owner/:name/spaces", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		query := req.URL.Query()

		name := p.ByName("name")
		var nameP *string
		var prefixP *string
		if strings.HasSuffix(name, "*") {
			prefixP = stringPtr(strings.TrimSuffix(name, "*"))
		} else {
			nameP = &name
		}
		result, err := s.ListCollections(req.Context(), &substrate.CollectionListQuery{
			CollectionMembershipWhere: substrate.CollectionMembershipWhere{
				Owner:      stringPtr(p.ByName("owner")),
				NamePrefix: prefixP,
				Name:       nameP,
				HasSpaceID: true,
			},
			Limit: substrate.LimitFromPtr(getValueAsIntPtr(query, "limit")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		if len(result) == 0 {
			return []*substrate.CollectionMember{}, http.StatusOK, nil
		}
		return result[0].Members, http.StatusOK, nil
	})

	handle("GET", "/api/v1/collections/:owner/:name/lensspecs", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		query := req.URL.Query()

		name := p.ByName("name")
		var nameP *string
		var prefixP *string
		if strings.HasSuffix(name, "*") {
			prefixP = stringPtr(strings.TrimSuffix(name, "*"))
		} else {
			nameP = &name
		}
		result, err := s.ListCollections(req.Context(), &substrate.CollectionListQuery{
			CollectionMembershipWhere: substrate.CollectionMembershipWhere{
				Owner:          stringPtr(p.ByName("owner")),
				NamePrefix:     prefixP,
				Name:           nameP,
				HasServiceSpec: true,
			},
			Limit: substrate.LimitFromPtr(getValueAsIntPtr(query, "limit")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		if len(result) == 0 {
			return []*substrate.CollectionMember{}, http.StatusOK, nil
		}
		return result[0].Members, http.StatusOK, nil
	})

	handle("GET", "/api/v1/events", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		query := req.URL.Query()
		result, err := s.ListEvents(req.Context(), &substrate.EventListRequest{
			EventWhere: substrate.EventWhere{
				User:         getValueAsStringPtr(query, "user"),
				ActivitySpec: getValueAsStringPtr(query, "activityspec"),
			},
			Limit: substrate.LimitFromPtr(getValueAsIntPtr(query, "limit")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return result, http.StatusOK, nil
	})

	return router
}
