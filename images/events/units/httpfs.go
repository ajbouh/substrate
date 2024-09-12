package units

import (
	"context"
	"net/http"

	eventfs "github.com/ajbouh/substrate/images/events/fs"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

// This is just a placeholder to test things from a browser during development.

type FSHandler struct {
	Querier event.Querier
}

func (h *FSHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.Handle("/fs/", h)
}

func (h *FSHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fsys := &eventfs.EventReadFS{
		Querier: h.Querier,
		Prefix:  "",
	}
	http.StripPrefix("/fs", http.FileServerFS(fsys)).ServeHTTP(w, r)
}
