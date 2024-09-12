package pipeline

import (
	"context"
	"encoding/json"
	"net/http"
)

type HTTPGetHandler struct {
	Slots *PipelineSlotMap
}

func (h *HTTPGetHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.Handle("GET /", h)
}

type PipelineJSON struct {
	Definition string `json:"definition"`
	State      string `json:"state"`
}

type PipelinesJSON struct {
	Pipelines map[string]*PipelineJSON `json:"pipelines"`
}

func (h *HTTPGetHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	res := &PipelinesJSON{
		Pipelines: make(map[string]*PipelineJSON),
	}
	for k, v := range h.Slots.Slots {
		res.Pipelines[k] = &PipelineJSON{}
		res.Pipelines[k].Definition, _ = v.Definition()
		res.Pipelines[k].State, _ = v.GetState()
	}

	json.NewEncoder(w).Encode(res)
}
