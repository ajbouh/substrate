package substratehttp

import (
	"fmt"
	"net/http"

	substratedb "github.com/ajbouh/substrate/images/substrate/db"
	"github.com/ajbouh/substrate/images/substrate/httputil"
)

type EventsHandler struct {
	Prefix string
	DB     *substratedb.DB
}

func (h *EventsHandler) ContributeHTTP(mux *http.ServeMux) {
	handle(mux, fmt.Sprintf("GET %s/v1/events", h.Prefix), func(req *http.Request) ([]*substratedb.Event, int, error) {
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
}
