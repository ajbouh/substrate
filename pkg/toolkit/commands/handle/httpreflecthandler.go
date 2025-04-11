package handle

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
)

func EnsureHTTPBasis(method, route string) commands.DefTransformFunc {
	return func(ctx context.Context, commandName string, commandDef commands.Fields) (string, commands.Fields) {
		// for each command, populate any missing run fields. this provides enough information for
		// someone to "run" the associated command through this handler.
		cap, path := FindMsgBasisPath(commandDef)
		if cap != "" {
			return commandName, commandDef
		}

		new := commandDef.MustClone()
		var err error

		pathWithSuffix := func(suffix ...string) []string {
			return append(append([]string(nil), path...), suffix...)
		}
		new, err = commands.SetPath(new, pathWithSuffix("cap"), "msg")
		if err != nil {
			return commandName, commandDef
		}
		new, err = commands.SetPath(new, pathWithSuffix("msg"), commands.Fields{
			"cap": "http",
			"http": commands.Fields{
				"request": commands.Fields{
					"headers": map[string][]string{
						"Content-Type": {"application/json"},
					},
					"url":    route,
					"method": method,
					"body": map[string]any{
						"command":    commandName,
						"parameters": map[string]any{},
					},
				},
			},
		})
		if err != nil {
			return commandName, commandDef
		}

		parametersPrefix := commands.NewDataPointer("data", "parameters")
		returnsPrefix := commands.NewDataPointer("data", "returns")

		meta, err := commands.GetPath[commands.Meta](new, pathWithSuffix("meta")...)
		if err != nil {
			return commandName, commandDef
		}
		for pointer := range meta {
			if trimmed, ok := pointer.TrimPathPrefix(parametersPrefix); ok {
				trimmedPath := trimmed.Path()
				if len(trimmedPath) != 1 {
					continue
				}
				new, err = commands.SetPath(new,
					[]string{
						"msg_in",
						commands.NewDataPointer(append(pathWithSuffix("msg", "http", "request", "body", "parameters"), trimmedPath...)...).String(),
					},
					pointer,
				)
				if err != nil {
					return commandName, commandDef
				}

			}
			if trimmed, ok := pointer.TrimPathPrefix(returnsPrefix); ok {
				trimmedPath := trimmed.Path()
				if len(trimmedPath) != 1 {
					continue
				}
				new, err = commands.SetPath(new, []string{"msg_out", pointer.String()},
					commands.NewDataPointer(append(pathWithSuffix("msg", "http", "response", "body"), trimmedPath...)...),
				)
				if err != nil {
					return commandName, commandDef
				}
			}
		}

		return commandName, new
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
