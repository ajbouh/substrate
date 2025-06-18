package httpframework

import (
	"context"
	"net/http"
	"net/http/pprof"
)

type PProfHandler struct{}

func (c *PProfHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.HandleFunc("/debug/pprof/", pprof.Index)
	mux.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
	mux.HandleFunc("/debug/pprof/profile", pprof.Profile)
	mux.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
	mux.HandleFunc("/debug/pprof/trace", pprof.Trace)

	mux.Handle("/debug/pprof/heap", pprof.Handler("heap"))
}
