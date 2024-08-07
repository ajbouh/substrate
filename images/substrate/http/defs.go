package substratehttp

import (
	"fmt"
	"io"
	"net/http"

	"cuelang.org/go/cue"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/images/substrate/httputil"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type DefsHandler struct {
	Prefix        string
	DefsAnnouncer *httpevents.EventStream[*defset.DefSet]
	DefSetLoader  notify.Loader[*defset.DefSet]
}

func (h *DefsHandler) ContributeHTTP(mux *http.ServeMux) {
	mux.Handle(fmt.Sprintf("GET %s/v1/defs", h.Prefix), h.DefsAnnouncer)
	mux.Handle(fmt.Sprintf("POST %s/v1/eval", h.Prefix), http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		defset := h.DefSetLoader.Load()

		defer req.Body.Close()
		b, err := io.ReadAll(req.Body)
		if err != nil {
			http.Error(rw, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
			return
		}

		var status int
		var resp []byte
		func() {
			defset.CueMu.Lock()
			defer defset.CueMu.Unlock()

			// HACK just trying to make an empty struct
			scope := defset.CueContext.CompileString("{...}", cue.ImportPath("_"))
			scope = scope.FillPath(cue.MakePath(cue.Hid("_root", "_")), defset.RootValue)

			result := defset.CueContext.CompileBytes(b, cue.ImportPath("_"), cue.Scope(scope))

			status, resp = httputil.WriteCueValue(req, result)
		}()
		rw.WriteHeader(status)
		rw.Write(resp)
	}))
}
