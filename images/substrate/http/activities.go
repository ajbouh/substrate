package substratehttp

import (
	"fmt"
	"net/http"
	"time"

	substratedb "github.com/ajbouh/substrate/images/substrate/db"
	"github.com/ajbouh/substrate/images/substrate/httputil"
)

type ActivitesHandler struct {
	Prefix string
	DB     *substratedb.DB
}

func (h *ActivitesHandler) ContributeHTTP(mux *http.ServeMux) {
	handle(mux, fmt.Sprintf("GET %s/v1/activities", h.Prefix), func(req *http.Request) (interface{}, int, error) {
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
}
