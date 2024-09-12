package substratehttp

import (
	"context"
	"fmt"
	"net/http"

	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type DefsHandler struct {
	Prefix        string
	DefsAnnouncer *httpevents.EventStream[*defset.DefSet]
	DefSetLoader  notify.Loader[*defset.DefSet]
}

func (h *DefsHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.Handle(fmt.Sprintf("GET %s/v1/defs", h.Prefix), h.DefsAnnouncer)
}
