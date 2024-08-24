package substratehttp

import (
	"fmt"
	"net/http"
	"strings"

	substratedb "github.com/ajbouh/substrate/images/substrate/db"
	"github.com/ajbouh/substrate/images/substrate/httputil"
)

type CollectionsHandler struct {
	Prefix string
	DB     *substratedb.DB
}

func (h *CollectionsHandler) ContributeHTTP(mux *http.ServeMux) {
	// List all collections for an owner
	handle(mux, fmt.Sprintf("GET %s/v1/collections/{owner}", h.Prefix), func(req *http.Request) ([]*substratedb.Collection, int, error) {
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
	handle(mux, fmt.Sprintf("GET %s/v1/collections/{owner}/{name}", h.Prefix), func(req *http.Request) (*substratedb.Collection, int, error) {
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
	handle(mux, fmt.Sprintf("POST %s/v1/collections/{owner}/{name}/services", h.Prefix), func(req *http.Request) (interface{}, int, error) {
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
	handle(mux, fmt.Sprintf("POST %s/v1/collections/{owner}/{name}/spaces", h.Prefix), func(req *http.Request) (interface{}, int, error) {
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
	handle(mux, fmt.Sprintf("DELETE %s/v1/collections/{owner}/{name}/spaces/{space}", h.Prefix), func(req *http.Request) (interface{}, int, error) {
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
	handle(mux, fmt.Sprintf("DELETE %s/v1/collections/{owner}/{name}/services/{servicespec}", h.Prefix), func(req *http.Request) (interface{}, int, error) {
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

	handle(mux, fmt.Sprintf("GET %s/v1/collections/{owner}/{name}/spaces", h.Prefix), func(req *http.Request) ([]*substratedb.CollectionMember, int, error) {
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

	handle(mux, fmt.Sprintf("GET %s/v1/collections/{owner}/{name}/servicespecs", h.Prefix), func(req *http.Request) ([]*substratedb.CollectionMember, int, error) {
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
}
