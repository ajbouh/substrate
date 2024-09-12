package pipeline

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type HTTPPatchHandler struct {
	Slots *PipelineSlotMap
}

func (h *HTTPPatchHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.Handle("PATCH /", h)
}

func (h *HTTPPatchHandler) Patch(patch *PipelinesPatch) (any, error) {
	log.Printf("PATCH %#v", patch)
	defer log.Printf("PATCH done")

	err := h.Slots.Patch(patch)
	if err != nil {
		return nil, err
	}

	res := &PipelinesJSON{
		Pipelines: make(map[string]*PipelineJSON),
	}
	for k, v := range h.Slots.Slots {
		res.Pipelines[k] = &PipelineJSON{}
		res.Pipelines[k].Definition, _ = v.Definition()
		res.Pipelines[k].State, _ = v.GetState()
	}

	return res, nil
}

func (h *HTTPPatchHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var patch PipelinesPatch

	defer r.Body.Close()
	err := json.NewDecoder(r.Body).Decode(&patch)
	if err != nil {
		http.Error(w, fmt.Sprintf("error parsing patch: %s", err.Error()), 400)
		return
	}

	res, err := h.Patch(&patch)
	if err != nil {
		http.Error(w, fmt.Sprintf("error applying patch: %s", err.Error()), 500)
		return
	}

	json.NewEncoder(w).Encode(res)
}
