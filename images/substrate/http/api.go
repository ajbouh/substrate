package substratehttp

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/auth"
	"github.com/ajbouh/substrate/images/substrate/httputil"
	"github.com/ajbouh/substrate/images/substrate/substrate"
)

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
			jsonrw := httputil.NewJSONResponseWriter(rw)
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
		status, err := httputil.ReadRequestBody(req, &r)
		if err != nil {
			return nil, status, err
		}

		statusStreamURLPrefix := strings.Replace(req.URL.Path, "/activities", "/backend/jamsocket", 1)
		if !strings.HasSuffix(statusStreamURLPrefix, "/") {
			statusStreamURLPrefix = statusStreamURLPrefix + "/"
		}

		views, err := activityspec.ParseActivitySpecRequest(r.ActivitySpec, r.ForceReadOnly, "/gw/" + r.ActivitySpec + "/")
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
				backendStatus, err := s.Driver.Status(req.Context(), event.Response.ServiceSpawnResponse.Name)
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
						StatusStreamURL: statusStreamURLPrefix + event.Response.ServiceSpawnResponse.Name + "/status/stream",
						ActivitySpec:    event.ActivitySpec,
					}, http.StatusOK, nil
				}
			}
		}

		views.User = user.GithubUsername
		sres, err := s.DefSet().SpawnActivity(req.Context(), s.Driver, views)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		u, _ := sres.URL(activityspec.ProvisionerCookieAuthenticationMode)
		return &ActivityResult{
			URL: u.String(),
			// Status:          nil,
			StatusStreamURL: statusStreamURLPrefix + sres.ServiceSpawnResponse.Name + "/status/stream",
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
		status, err := httputil.ReadRequestBody(req, &r)
		if err != nil {
			return nil, status, err
		}

		alias := ""
		view, err := s.DefSet().ResolveSpaceView(r, user.GithubUsername, alias)
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
		status, err := httputil.ReadRequestBody(req, &r)
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
		ch, err := s.Driver.StatusStream(req.Context(), p.ByName("backend"))
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
		lens, err := s.DefSet().ResolveService(req.Context(), p.ByName("lens"))
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
				Service: httputil.GetValueAsStringPtr(query, "lens"),
			},
			Limit: substrate.LimitFromPtr(httputil.GetValueAsIntPtr(query, "limit")),
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
		lenses, err := s.DefSet().AllServices(req.Context())
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		return lenses, http.StatusOK, nil
	})

	handle("GET", "/api/v1/spaces", func(req *http.Request, p httprouter.Params) (interface{}, int, error) {
		query := req.URL.Query()
		result, err := s.ListSpaces(req.Context(), &substrate.SpaceListQuery{
			SpaceWhere: substrate.SpaceWhere{
				Owner:        httputil.GetValueAsStringPtr(query, "owner"),
				ForkedFromID: httputil.GetValueAsStringPtr(query, "forked_from"),
			},
			SelectNestedCollections: &substrate.CollectionMembershipWhere{
				Owner:       httputil.GetValueAsStringPtr(query, "collection_owner"),
				Name:        httputil.GetValueAsStringPtr(query, "collection_name"),
				NamePrefix:  httputil.GetValueAsStringPtr(query, "collection_prefix"),
				ServiceSpec: httputil.GetValueAsStringPtr(query, "collection_lensspec"),
				IsPublic:    httputil.GetValueAsBoolPtr(query, "collection_public"),
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
			Limit: substrate.LimitFromPtr(httputil.GetValueAsIntPtr(query, "limit")),
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
			Limit: substrate.LimitFromPtr(httputil.GetValueAsIntPtr(query, "limit")),
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
		status, err := httputil.ReadRequestBody(req, &r)
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
		status, err := httputil.ReadRequestBody(req, &r)
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
			Limit: substrate.LimitFromPtr(httputil.GetValueAsIntPtr(query, "limit")),
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
			Limit: substrate.LimitFromPtr(httputil.GetValueAsIntPtr(query, "limit")),
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
				User:         httputil.GetValueAsStringPtr(query, "user"),
				ActivitySpec: httputil.GetValueAsStringPtr(query, "activityspec"),
			},
			Limit: substrate.LimitFromPtr(httputil.GetValueAsIntPtr(query, "limit")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return result, http.StatusOK, nil
	})

	return router
}
