package substratehttp

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"cuelang.org/go/cue"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	substratedb "github.com/ajbouh/substrate/images/substrate/db"
	"github.com/ajbouh/substrate/images/substrate/httputil"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
)

func stringPtr(s string) *string {
	return &s
}

func (h *Handler) newApiHandler() http.Handler {
	router := http.NewServeMux()

	router.Handle("GET /substrate/v1/exports", h.ExportsAnnouncer)

	handle := func(route string, f func(req *http.Request) (interface{}, int, error)) {
		router.Handle(route, http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(f(req))
		}))
	}

	handle("GET /substrate/v1/stats", func(req *http.Request) (interface{}, int, error) {
		m, v, err := sampleServicesWithStats(req.Context(), h, h.ProvisionerCache, []string{"nvml", "sigar"})
		status := 200
		if err != nil {
			status = 500
		}
		return map[string]any{
			"services": m,
			"metrics":  v,
		}, status, err
	})

	router.Handle("GET /substrate/v1/defs", h.DefsAnnouncer)

	router.Handle("POST /substrate/v1/eval", http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		defset := h.DefSetLoader.Load()
		defset.CueMu.Lock()
		defer defset.CueMu.Unlock()

		defer req.Body.Close()
		b, err := io.ReadAll(req.Body)
		if err != nil {
			http.Error(rw, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
			return
		}

		// HACK just trying to make an empty struct
		scope := defset.CueContext.CompileString("{...}", cue.ImportPath("_"))
		scope = scope.FillPath(cue.MakePath(cue.Hid("_root", "_")), defset.RootValue)

		result := defset.CueContext.CompileBytes(b, cue.ImportPath("_"), cue.Scope(scope))
		httputil.WriteCueValue(rw, req, result)
	}))

	handle("POST /substrate/v1/spaces", func(req *http.Request) (interface{}, int, error) {
		// TODO should we allow setting an alias here?
		r := &activityspec.SpaceViewRequest{}
		status, err := httputil.ReadRequestBody(req, &r)
		if err != nil {
			return nil, status, err
		}

		view, err := h.DefSetLoader.Load().ResolveSpaceView(r, h.User)
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

		err = h.DB.WriteSpace(req.Context(), &substratedb.Space{
			Owner:         h.User,
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

	handle("DELETE /substrate/v1/spaces/{space}", func(req *http.Request) (interface{}, int, error) {
		w := req.PathValue("space")
		result, err := h.DB.ListSpaces(req.Context(), &substratedb.SpaceListQuery{
			SpaceWhere: substratedb.SpaceWhere{
				ID: &w,
			},
			Limit: &substratedb.Limit{
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

		if ws.Owner != h.User {
			return nil, http.StatusUnauthorized, fmt.Errorf("only the owner of the space can delete it")
		}

		err = h.DB.DeleteSpace(req.Context(), &substratedb.SpaceWhere{
			ID: &ws.ID,
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		return nil, http.StatusOK, nil
	})

	handle("PATCH /substrate/v1/spaces/{space}", func(req *http.Request) (interface{}, int, error) {
		r := &substratedb.SpaceListingPatch{}
		status, err := httputil.ReadRequestBody(req, &r)
		if err != nil {
			return nil, status, err
		}
		r.ID = req.PathValue("space")
		err = h.DB.PatchSpace(req.Context(), r)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		return nil, http.StatusOK, nil
	})

	router.Handle("GET /substrate/v1/backend/{backend}/status/stream", http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		ch, err := h.Driver.StatusStream(req.Context(), req.PathValue("backend"))
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
	}))

	modifyExports := func(ctx context.Context, viewspec, digest string, cb func(f provisioner.Fields) provisioner.Fields) (interface{}, int, error) {
		views, _, err := activityspec.ParseServiceSpawnRequest(viewspec, false, "/"+viewspec)
		if err != nil {
			return nil, http.StatusBadRequest, err
		}

		err = h.ProvisionerCache.UpdateOutgoing(
			ctx,
			views,
			digest,
			cb,
		)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		return nil, http.StatusOK, nil
	}

	handle("PATCH /substrate/v1/activities/{viewspec}/{digest}/exports", func(req *http.Request) (interface{}, int, error) {
		var fields provisioner.Fields
		defer req.Body.Close()
		err := json.NewDecoder(req.Body).Decode(&fields)
		if err != nil {
			return nil, http.StatusBadRequest, err
		}

		return modifyExports(
			req.Context(),
			req.PathValue("viewspec"),
			req.PathValue("digest"),
			func(f provisioner.Fields) provisioner.Fields {
				for k, v := range fields {
					f[k] = v
				}
				return f
			},
		)
	})

	handle("PUT /substrate/v1/activities/{viewspec}/{digest}/exports", func(req *http.Request) (interface{}, int, error) {
		var fields provisioner.Fields
		defer req.Body.Close()
		err := json.NewDecoder(req.Body).Decode(&fields)
		if err != nil {
			return nil, http.StatusBadRequest, err
		}

		return modifyExports(
			req.Context(),
			req.PathValue("viewspec"),
			req.PathValue("digest"),
			func(f provisioner.Fields) provisioner.Fields { return fields },
		)
	})

	handle("GET /substrate/v1/services/{service}", func(req *http.Request) (interface{}, int, error) {
		service, err := h.DefSetLoader.Load().ResolveServiceByName(req.Context(), req.PathValue("service"))
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		if service == nil {
			return nil, http.StatusNotFound, err
		}
		return service, http.StatusOK, nil
	})

	handle("GET /substrate/v1/activities", func(req *http.Request) (interface{}, int, error) {
		query := req.URL.Query()
		activities, err := h.DB.ListActivities(req.Context(), &substratedb.ActivityListRequest{
			ActivityWhere: substratedb.ActivityWhere{
				Service: httputil.GetValueAsStringPtr(query, "service"),
			},
			Limit: substratedb.LimitFromPtr(httputil.GetValueAsIntPtr(query, "limit")),
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

	handle("GET /substrate/v1/spaces/{space}", func(req *http.Request) (interface{}, int, error) {
		w := req.PathValue("space")
		result, err := h.DB.ListSpaces(req.Context(), &substratedb.SpaceListQuery{
			SpaceWhere: substratedb.SpaceWhere{
				ID: &w,
			},
			SelectNestedCollections: &substratedb.CollectionMembershipWhere{
				Owner: stringPtr(h.User),
			},
			Limit: &substratedb.Limit{
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

	handle("GET /substrate/v1/spaces", func(req *http.Request) (interface{}, int, error) {
		query := req.URL.Query()
		result, err := h.DB.ListSpaces(req.Context(), &substratedb.SpaceListQuery{
			SpaceWhere: substratedb.SpaceWhere{
				Owner:        httputil.GetValueAsStringPtr(query, "owner"),
				ForkedFromID: httputil.GetValueAsStringPtr(query, "forked_from"),
			},
			SelectNestedCollections: &substratedb.CollectionMembershipWhere{
				Owner:       httputil.GetValueAsStringPtr(query, "collection_owner"),
				Name:        httputil.GetValueAsStringPtr(query, "collection_name"),
				NamePrefix:  httputil.GetValueAsStringPtr(query, "collection_prefix"),
				ServiceSpec: httputil.GetValueAsStringPtr(query, "collection_servicespec"),
				IsPublic:    httputil.GetValueAsBoolPtr(query, "collection_public"),
			},
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return result, http.StatusOK, nil
	})

	// List all collections for an owner
	handle("GET /substrate/v1/collections/{owner}", func(req *http.Request) (interface{}, int, error) {
		query := req.URL.Query()
		result, err := h.DB.ListCollections(req.Context(), &substratedb.CollectionListQuery{
			CollectionMembershipWhere: substratedb.CollectionMembershipWhere{
				Owner: stringPtr(req.PathValue("owner")),
			},
			Limit: substratedb.LimitFromPtr(httputil.GetValueAsIntPtr(query, "limit")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return result, http.StatusOK, nil
	})

	// Get specific collection (or list of collections with given prefix) for an owner
	handle("GET /substrate/v1/collections/{owner}/{name}", func(req *http.Request) (interface{}, int, error) {
		query := req.URL.Query()
		name := req.PathValue("name")
		var nameP *string
		var prefixP *string
		if strings.HasSuffix(name, "*") {
			prefixP = stringPtr(strings.TrimSuffix(name, "*"))
		} else {
			nameP = &name
		}
		result, err := h.DB.ListCollections(req.Context(), &substratedb.CollectionListQuery{
			CollectionMembershipWhere: substratedb.CollectionMembershipWhere{
				Owner:      stringPtr(req.PathValue("owner")),
				Name:       nameP,
				NamePrefix: prefixP,
			},
			Limit: substratedb.LimitFromPtr(httputil.GetValueAsIntPtr(query, "limit")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		if len(result) == 0 {
			return nil, http.StatusNotFound, nil
		}
		return result[0], http.StatusOK, nil
	})

	// Attach a service to a collection
	handle("POST /substrate/v1/collections/{owner}/{name}/services", func(req *http.Request) (interface{}, int, error) {
		r := struct {
			ServiceSpec string         `json:"servicespec"`
			IsPublic    bool           `json:"public,omitempty"`
			Attributes  map[string]any `json:"attributes,omitempty"`
		}{}
		status, err := httputil.ReadRequestBody(req, &r)
		if err != nil {
			return nil, status, err
		}

		// TODO take a space spawned by git-export, use it as config for export
		// TODO does the servicespec accept any inputs other than the collection?
		// TODO If so, need to create it as needed and return a proper servicespec.
		// TODO

		err = h.DB.WriteCollectionMembership(req.Context(), &substratedb.CollectionMembership{
			Owner:       req.PathValue("owner"),
			Name:        req.PathValue("name"),
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
	handle("POST /substrate/v1/collections/{owner}/{name}/spaces", func(req *http.Request) (interface{}, int, error) {
		r := struct {
			SpaceID    string         `json:"space"`
			IsPublic   bool           `json:"public,omitempty"`
			Attributes map[string]any `json:"attributes,omitempty"`
		}{}
		status, err := httputil.ReadRequestBody(req, &r)
		if err != nil {
			return nil, status, err
		}
		err = h.DB.WriteCollectionMembership(req.Context(), &substratedb.CollectionMembership{
			Owner:      req.PathValue("owner"),
			Name:       req.PathValue("name"),
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
	handle("DELETE /substrate/v1/collections/{owner}/{name}/spaces/{space}", func(req *http.Request) (interface{}, int, error) {
		err := h.DB.DeleteCollectionMembership(req.Context(), &substratedb.CollectionMembershipWhere{
			Owner:   stringPtr(req.PathValue("owner")),
			Name:    stringPtr(req.PathValue("name")),
			SpaceID: stringPtr(req.PathValue("space")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return nil, http.StatusOK, nil
	})

	// Remove a service from a collection
	handle("DELETE /substrate/v1/collections/{owner}/{name}/services/{servicespec}", func(req *http.Request) (interface{}, int, error) {
		err := h.DB.DeleteCollectionMembership(req.Context(), &substratedb.CollectionMembershipWhere{
			Owner:       stringPtr(req.PathValue("owner")),
			Name:        stringPtr(req.PathValue("name")),
			ServiceSpec: stringPtr(req.PathValue("servicespec")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return nil, http.StatusOK, nil
	})

	handle("GET /substrate/v1/collections/{owner}/{name}/spaces", func(req *http.Request) (interface{}, int, error) {
		query := req.URL.Query()

		name := req.PathValue("name")
		var nameP *string
		var prefixP *string
		if strings.HasSuffix(name, "*") {
			prefixP = stringPtr(strings.TrimSuffix(name, "*"))
		} else {
			nameP = &name
		}
		result, err := h.DB.ListCollections(req.Context(), &substratedb.CollectionListQuery{
			CollectionMembershipWhere: substratedb.CollectionMembershipWhere{
				Owner:      stringPtr(req.PathValue("owner")),
				NamePrefix: prefixP,
				Name:       nameP,
				HasSpaceID: true,
			},
			Limit: substratedb.LimitFromPtr(httputil.GetValueAsIntPtr(query, "limit")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		if len(result) == 0 {
			return []*substratedb.CollectionMember{}, http.StatusOK, nil
		}
		return result[0].Members, http.StatusOK, nil
	})

	handle("GET /substrate/v1/collections/{owner}/{name}/servicespecs", func(req *http.Request) (interface{}, int, error) {
		query := req.URL.Query()

		name := req.PathValue("name")
		var nameP *string
		var prefixP *string
		if strings.HasSuffix(name, "*") {
			prefixP = stringPtr(strings.TrimSuffix(name, "*"))
		} else {
			nameP = &name
		}
		result, err := h.DB.ListCollections(req.Context(), &substratedb.CollectionListQuery{
			CollectionMembershipWhere: substratedb.CollectionMembershipWhere{
				Owner:          stringPtr(req.PathValue("owner")),
				NamePrefix:     prefixP,
				Name:           nameP,
				HasServiceSpec: true,
			},
			Limit: substratedb.LimitFromPtr(httputil.GetValueAsIntPtr(query, "limit")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		if len(result) == 0 {
			return []*substratedb.CollectionMember{}, http.StatusOK, nil
		}
		return result[0].Members, http.StatusOK, nil
	})

	handle("GET /substrate/v1/events", func(req *http.Request) (interface{}, int, error) {
		query := req.URL.Query()
		result, err := h.DB.ListEvents(req.Context(), &substratedb.EventListRequest{
			EventWhere: substratedb.EventWhere{
				User:         httputil.GetValueAsStringPtr(query, "user"),
				ActivitySpec: httputil.GetValueAsStringPtr(query, "activityspec"),
			},
			Limit: substratedb.LimitFromPtr(httputil.GetValueAsIntPtr(query, "limit")),
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		return result, http.StatusOK, nil
	})

	return router
}
