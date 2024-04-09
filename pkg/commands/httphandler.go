package commands

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

type HTTPHandler struct {
	Debug     bool
	Aggregate *Aggregate

	Route string
	// Temporary feature until everything is using REFLECT
	GetEnabled bool
}

func (c *HTTPHandler) serveError(w http.ResponseWriter, err error, code int, msg map[string]any) {
	if err != nil {
		if msg == nil {
			msg = map[string]any{"error": err.Error()}
		} else {
			msg["error"] = err.Error()
		}
	}

	if c.Debug {
		b, e := json.Marshal(msg)
		if e == nil {
			http.Error(w, string(b), code)
			return
		}
		log.Printf("failed to produce JSON version of error message: %s; will not include it in response", e)
	}

	log.Printf("request error: %s", err)
	http.Error(w, `{"error": "unspecified"}`, code)
}

// TODO support the OpenAPI spec as a return type.
func (c *HTTPHandler) ServeHTTPReflect(w http.ResponseWriter, r *http.Request) {
	// GET returns commands (with meta header including url, update timestamp, revision id)
	// POST runs a command (accepts meta header including url, update timestamp, revision id; errors on meta mismatch)
	h := w.Header()
	h.Set("Content-Type", "application/json")
	commands, err := c.Aggregate.AsDynamicSource(r.Context()).Reflect(r.Context())
	if err != nil {
		c.serveError(w, err, http.StatusInternalServerError, nil)
		return
	}
	b, err := json.Marshal(commands)
	if err != nil {
		c.serveError(w, err, http.StatusInternalServerError, nil)
		return
	}
	w.Write(b)
}

func (c *HTTPHandler) ContributeHTTP(mux *http.ServeMux) {
	if c.Route != "" {
		// mux.Handle("GET /json/version", c)
		mux.HandleFunc("POST "+c.Route, c.ServeHTTPRun)

		mux.HandleFunc("REFLECT "+c.Route, c.ServeHTTPReflect)
		if c.GetEnabled {
			mux.HandleFunc("GET "+c.Route, c.ServeHTTPRun)
		}
	}
}

func (c *HTTPHandler) ServeHTTPRun(w http.ResponseWriter, r *http.Request) {
	var commandRequest Request
	var errMsg map[string]any
	defer r.Body.Close()
	b, err := io.ReadAll(r.Body)
	if err != nil {
		c.serveError(w, err, http.StatusBadRequest, errMsg)
		return
	}

	err = json.Unmarshal(b, &commandRequest)
	if err != nil {
		c.serveError(w, err, http.StatusBadRequest, errMsg)
		return
	}

	source := c.Aggregate.AsDynamicSource(r.Context())
	res, err := source.Run(r.Context(), commandRequest.Command, commandRequest.Parameters)
	if err != nil {
		commands, commandsErr := source.Reflect(r.Context())
		if commandsErr == nil {
			errMsg = map[string]any{"commands": commands}
		}
		c.serveError(w, err, http.StatusInternalServerError, errMsg)
		return
	}

	b, err = json.Marshal(res)
	if err != nil {
		c.serveError(w, err, http.StatusInternalServerError, errMsg)
		return
	}
	w.Write(b)
}
