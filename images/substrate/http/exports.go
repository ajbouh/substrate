package substratehttp

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
)

type ExportsHandler struct {
	Prefix           string
	ProvisionerCache *provisioner.Cache
}

func (h *ExportsHandler) modifyExports(ctx context.Context, viewspec, digest string, cb func(f provisioner.Fields) provisioner.Fields) (interface{}, int, error) {
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

func (h *ExportsHandler) ContributeHTTP(mux *http.ServeMux) {
	handle(mux, fmt.Sprintf("PATCH %s/v1/activities/{viewspec}/{digest}/exports", h.Prefix), func(req *http.Request) (interface{}, int, error) {
		var fields provisioner.Fields
		defer req.Body.Close()
		err := json.NewDecoder(req.Body).Decode(&fields)
		if err != nil {
			return nil, http.StatusBadRequest, err
		}

		return h.modifyExports(
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

	handle(mux, fmt.Sprintf("PUT %s/v1/activities/{viewspec}/{digest}/exports", h.Prefix), func(req *http.Request) (interface{}, int, error) {
		var fields provisioner.Fields
		defer req.Body.Close()
		err := json.NewDecoder(req.Body).Decode(&fields)
		if err != nil {
			return nil, http.StatusBadRequest, err
		}

		return h.modifyExports(
			req.Context(),
			req.PathValue("viewspec"),
			req.PathValue("digest"),
			func(f provisioner.Fields) provisioner.Fields { return fields },
		)
	})
}
