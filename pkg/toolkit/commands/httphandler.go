package commands

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
)

type HTTPSourceHandler struct {
	Debug     bool
	Aggregate *Aggregate

	BaseURL string
	Route   string

	// Temporary feature until everything is using REFLECT
	GetEnabled bool
}

func EnsureRunHTTPRequestURLHasAHost(baseURL string) DefTransformFunc {
	return func(commandName string, commandDef Def) (string, Def) {
		if commandDef.Run == nil || commandDef.Run.HTTP == nil {
			return commandName, commandDef
		}

		// is this a full URL? if not make it so.
		if strings.HasPrefix(commandDef.Run.HTTP.Request.URL, "/") {
			commandDef.Run.HTTP.Request.URL = baseURL + commandDef.Run.HTTP.Request.URL
		}

		return commandName, commandDef
	}
}

func EnsureRunHTTPField(route string) DefTransformFunc {
	return func(commandName string, commandDef Def) (string, Def) {
		// for each command, populate any missing run fields. this provides enough information for
		// someone to "run" the associated command through this handler.
		if commandDef.Run == nil {
			commandDef.Run = &RunDef{}
		}

		if commandDef.Run.HTTP == nil {
			commandDef.Run.HTTP = &RunHTTPDef{
				Parameters: map[string]RunFieldDef{},
				Returns:    map[string]RunFieldDef{},
				Request: RunHTTPRequestDef{
					URL:    route,
					Method: "POST",
					Headers: map[string][]string{
						"Content-Type": {"application/json"},
					},
					Body: map[string]any{
						"command":    commandName,
						"parameters": map[string]any{},
					},
				},
			}

			for field := range commandDef.Parameters {
				commandDef.Run.HTTP.Parameters[field] = RunFieldDef{Path: `request.body.parameters.` + field}
			}
			for field := range commandDef.Returns {
				commandDef.Run.HTTP.Returns[field] = RunFieldDef{Path: `request.body.returns.` + field}
			}
		}

		return commandName, commandDef
	}
}

func (c *HTTPSourceHandler) ContributeHTTP(mux *http.ServeMux) {
	if c.Route != "" {
		runner := c.Aggregate.AsRunner(context.Background())
		reflector := c.Aggregate.AsReflector(context.Background(),
			DefTransforms(EnsureRunHTTPField(c.Route), EnsureRunHTTPRequestURLHasAHost(c.BaseURL)),
		)

		route := c.Route
		if strings.HasSuffix(route, "/") {
			route = route + "{$}"
		}

		runHandler := &HTTPRunHandler{
			Debug:     c.Debug,
			Runner:    runner,
			Reflector: reflector,
		}
		mux.Handle("POST "+route, runHandler)

		reflectHandler := &HTTPReflectHandler{
			Debug:     c.Debug,
			Route:     route,
			Reflector: reflector,
		}
		mux.Handle("REFLECT "+route, reflectHandler)
		if c.GetEnabled {
			mux.Handle("GET "+route, reflectHandler)
		}
	}
}

func serveError(debug bool, w http.ResponseWriter, err error, code int, msg map[string]any) {
	if err != nil {
		if msg == nil {
			msg = map[string]any{"error": err.Error()}
		} else {
			msg["error"] = err.Error()
		}
	}

	if debug {
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
type HTTPReflectHandler struct {
	Debug     bool
	Reflector Reflector
	Route     string
}

func (c *HTTPReflectHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h := w.Header()
	h.Set("Content-Type", "application/json")
	commands, err := c.Reflector.Reflect(r.Context())
	if err != nil {
		serveError(c.Debug, w, err, http.StatusInternalServerError, nil)
		return
	}

	b, err := json.Marshal(map[string]any{
		"commands": commands,
	})
	if err != nil {
		serveError(c.Debug, w, err, http.StatusInternalServerError, nil)
		return
	}
	w.Write(b)
}

type HTTPRunHandler struct {
	Debug     bool
	Runner    Runner
	Reflector Reflector
}

func (c *HTTPRunHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var commandRequest Request
	var errMsg map[string]any
	defer r.Body.Close()
	b, err := io.ReadAll(r.Body)
	if err != nil {
		serveError(c.Debug, w, err, http.StatusBadRequest, errMsg)
		return
	}

	err = json.Unmarshal(b, &commandRequest)
	if err != nil {
		serveError(c.Debug, w, err, http.StatusBadRequest, errMsg)
		return
	}

	source := c.Runner
	res, err := source.Run(r.Context(), commandRequest.Command, commandRequest.Parameters)
	if err != nil {
		if c.Reflector != nil {
			commands, commandsErr := c.Reflector.Reflect(r.Context())
			if commandsErr == nil {
				errMsg = map[string]any{"commands": commands}
			}
		}
		serveError(c.Debug, w, err, http.StatusInternalServerError, errMsg)
		return
	}

	b, err = json.Marshal(res)
	if err != nil {
		serveError(c.Debug, w, err, http.StatusInternalServerError, errMsg)
		return
	}
	w.Write(b)
}
