package exports

import (
	"encoding/json"
	"net/http"
)

type Handler struct {
	ExportSources []Source
}

func (c *Handler) ContributeHTTP(mux *http.ServeMux) {
	mux.Handle("/exports", c)
}

func (c *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	exports, err := Union(r.Context(), c.ExportSources)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(exports)
}
