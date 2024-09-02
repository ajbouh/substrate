package commands

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

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

func EnsureRunHTTPField(method, route string) DefTransformFunc {
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
					Method: method,
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
				commandDef.Run.HTTP.Returns[field] = RunFieldDef{Path: `response.body.` + field}
			}
		}

		return commandName, commandDef
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

	ReflectRequestTransform func(r *http.Request, name string, def Def) (string, Def)
}

type contextKey string

var httprequestKey = contextKey("httprequest")

func HTTPRequest(ctx context.Context) *http.Request {
	v, ok := ctx.Value(httprequestKey).(*http.Request)
	if ok {
		return v
	}
	return nil
}

func (c *HTTPReflectHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h := w.Header()
	h.Set("Content-Type", "application/json")
	ctx := r.Context()
	ctx = context.WithValue(ctx, httprequestKey, r)
	commands, err := c.Reflector.Reflect(ctx)
	if err != nil {
		serveError(c.Debug, w, err, http.StatusInternalServerError, nil)
		return
	}

	if c.ReflectRequestTransform != nil {
		transformedCommands := DefIndex{}
		for name, def := range commands {
			name, def = c.ReflectRequestTransform(r, name, def)
			transformedCommands[name] = def
		}

		commands = transformedCommands
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
