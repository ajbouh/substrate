package handle

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
)

func EnsureRunHTTPRequestURLHasAHost(baseURL string) commands.DefTransformFunc {
	return func(ctx context.Context, commandName string, commandDef commands.Def) (string, commands.Def) {
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

func EnsureRunHTTPField(method, route string) commands.DefTransformFunc {
	return func(ctx context.Context, commandName string, commandDef commands.Def) (string, commands.Def) {
		// for each command, populate any missing run fields. this provides enough information for
		// someone to "run" the associated command through this handler.
		if commandDef.Run == nil {
			commandDef.Run = &commands.RunDef{}
		}

		if commandDef.Run.HTTP == nil {
			commandDef.Run.HTTP = &commands.RunHTTPDef{
				Parameters: map[string]commands.RunFieldDef{},
				Returns:    map[string]commands.RunFieldDef{},
				Request: commands.RunHTTPRequestDef{
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
				commandDef.Run.HTTP.Parameters[field] = commands.RunFieldDef{Path: `request.body.parameters.` + field}
			}
			for field := range commandDef.Returns {
				commandDef.Run.HTTP.Returns[field] = commands.RunFieldDef{Path: `response.body.` + field}
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

type contextKey string

var pathvaluerKey = contextKey("pathvaluer")

func WithPathValuer(ctx context.Context, v PathValuer) context.Context {
	return context.WithValue(ctx, pathvaluerKey, v)
}

func ContextPathValuer(ctx context.Context) PathValuer {
	v, ok := ctx.Value(pathvaluerKey).(PathValuer)
	if ok {
		return v
	}
	return nil
}

type HTTPReflectResponse struct {
	Commands commands.DefIndex `json:"commands"`
}

// TODO support the OpenAPI spec as a return type.
type HTTPReflectAnnouncer struct {
	Debug     bool
	Reflector commands.Reflector
	Route     string

	Context     context.Context
	eventStream *httpevents.EventStream[HTTPReflectResponse]
}

func (c *HTTPReflectAnnouncer) Initialize() {
	c.eventStream = httpevents.NewJSONEventStream[HTTPReflectResponse](c.Route)
}

func (c *HTTPReflectAnnouncer) Refresh() error {
	commands, err := c.Reflector.Reflect(c.Context)
	if err != nil {
		return err
	}

	c.eventStream.Announce(HTTPReflectResponse{Commands: commands})
	return nil
}

func (h *HTTPReflectAnnouncer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.eventStream.ServeHTTP(w, r)
}

// TODO support the OpenAPI spec as a return type.
type HTTPReflectHandler struct {
	Debug     bool
	Reflector commands.Reflector
	Route     string
}

func (c *HTTPReflectHandler) reflect(ctx context.Context) (*HTTPReflectResponse, error) {
	commands, err := c.Reflector.Reflect(ctx)
	if err != nil {
		return nil, err
	}

	return &HTTPReflectResponse{
		Commands: commands,
	}, nil
}

func (c *HTTPReflectHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h := w.Header()
	h.Set("Content-Type", "application/json")
	ctx := r.Context()
	ctx = WithPathValuer(ctx, r)

	response, err := c.reflect(ctx)
	if err != nil {
		serveError(c.Debug, w, err, http.StatusInternalServerError, nil)
		return
	}

	b, err := json.Marshal(response)
	if err != nil {
		serveError(c.Debug, w, err, http.StatusInternalServerError, nil)
		return
	}
	w.Write(b)
}
