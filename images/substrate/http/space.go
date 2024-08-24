package substratehttp

import (
	"fmt"
	"net/http"
	"time"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	substratedb "github.com/ajbouh/substrate/images/substrate/db"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/images/substrate/httputil"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type SpaceHandler struct {
	Prefix       string
	DB           *substratedb.DB
	User         string
	DefSetLoader notify.Loader[*defset.DefSet]
}

func (h *SpaceHandler) ContributeHTTP(mux *http.ServeMux) {
	handle(mux, fmt.Sprintf("POST %s/v1/spaces", h.Prefix), func(req *http.Request) (interface{}, int, error) {
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

	handle(mux, fmt.Sprintf("DELETE %s/v1/spaces/{space}", h.Prefix), func(req *http.Request) (interface{}, int, error) {
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

	handle(mux, "PATCH /substrate/v1/spaces/{space}", func(req *http.Request) (interface{}, int, error) {
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

	handle(mux, "GET /substrate/v1/spaces/{space}", func(req *http.Request) (*substratedb.Space, int, error) {
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

	handle(mux, "GET /substrate/v1/spaces", func(req *http.Request) ([]*substratedb.Space, int, error) {
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
}
