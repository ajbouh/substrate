package handle

import (
	"context"
	"log/slog"
	"net/http"
	"slices"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
)

type HTTPResourceReflectHandler struct {
	Debug     bool
	BaseURL   string
	Aggregate *commands.Aggregate
	Log       *slog.Logger

	HTTPRunHandler                 *HTTPRunHandler
	DefaultHTTPResourceReflectPath string

	ReflectorsPerRoute map[string][]commands.Reflector
}

func HTTPResourceReflectPath(reflector commands.Reflector) string {
	var key string
	if rp, ok := reflector.(HTTPResourceReflect); ok {
		key = rp.GetHTTPResourceReflectPath()
	}
	return key
}

type HTTPResourceReflect interface {
	GetHTTPResourceReflectPath() string
}

func (h *HTTPResourceReflectHandler) ReflectorForPathFuncExcluding(excluding ...commands.Reflector) func(string) commands.Reflector {
	xform := commands.DefTransforms(
		// should only pick up commands that don't have a route set and are therefore top-level.
		EnsureHTTPBasis(
			h.HTTPRunHandler.CatchallRunnerMethod(),
			h.HTTPRunHandler.CatchallRunnerPath(),
		),
		EnsureRunHTTPRequestURLIncludesPrefix(h.BaseURL),
	)

	return func(reflectPath string) commands.Reflector {
		if reflectPath == "" {
			reflectPath = h.DefaultHTTPResourceReflectPath
		}
		slog.Info("ReflectorForPathFuncExcluding", "reflectPath", reflectPath, "h.ReflectorsPerRoute[reflectPath]", h.ReflectorsPerRoute[reflectPath])
		return &commands.DynamicReflector{
			ReflectTransform: xform,
			Reflectors: func() []commands.Reflector {
				reflectors := slices.Clone(h.ReflectorsPerRoute[reflectPath])
				if len(excluding) > 0 {
					reflectors = slices.DeleteFunc(reflectors, func(r commands.Reflector) bool { return slices.Contains(excluding, r) })
				}
				return reflectors
			},
		}
	}
}

func FindMsgBasis(c *commands.Msg) *commands.Msg {
	if c == nil {
		return nil
	}

	for {
		if c.Msg == nil {
			return c
		}

		c = c.Msg
	}
}

func EnsureRunHTTPRequestURLIncludesPrefix(prefix string) commands.DefTransformFunc {
	return func(ctx context.Context, commandName string, commandDef *commands.Msg) (string, *commands.Msg) {
		if prefix == "" {
			return commandName, commandDef
		}

		r := FindMsgBasis(commandDef)
		if r == nil || r.Cap == nil || *r.Cap != "http" {
			return commandName, commandDef
		}

		// is this a full URL? if not make it so.
		url, err := commands.GetPath[string](r.Data, "request", "url")
		if err != nil {
			return commandName, commandDef
		}

		if !strings.HasPrefix(url, "/") {
			return commandName, commandDef
		}

		new := commandDef.MustClone()
		r = FindMsgBasis(new)
		err = commands.SetPath(r.Data, []string{"request", "url"}, prefix+url)
		if err != nil {
			return commandName, commandDef
		}

		return commandName, new
	}
}

func (h *HTTPResourceReflectHandler) transformDef(ctx context.Context, name string, def *commands.Msg) (string, *commands.Msg) {
	// should only pick up commands that don't have a route set and are therefore top-level.
	name, def = EnsureHTTPBasis(
		h.HTTPRunHandler.CatchallRunnerMethod(),
		h.HTTPRunHandler.CatchallRunnerPath(),
	)(ctx, name, def)

	name, def = EnsureRunHTTPRequestURLIncludesPrefix(
		h.BaseURL+httpframework.ContextPrefix(ctx),
	)(ctx, name, def)

	return name, def
}

func (h *HTTPResourceReflectHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	// group by path
	h.ReflectorsPerRoute = commands.Group(h.Aggregate.GatherReflectorsExcluding(context.Background(), nil), HTTPResourceReflectPath)

	// rename the empty route to the given default reflect path
	h.ReflectorsPerRoute[h.DefaultHTTPResourceReflectPath] = h.ReflectorsPerRoute[""]
	delete(h.ReflectorsPerRoute, "")

	slog.Info("HTTPResourceReflectHandler.ContributeHTTP", "ReflectorsPerRoute", h.ReflectorsPerRoute)

	// register unique REFLECT routes for each
	for reflectPath, reflectors := range h.ReflectorsPerRoute {
		reflectPath := reflectPath
		reflectors := slices.Clone(reflectors)

		if reflectPath == "" {
			reflectPath = h.DefaultHTTPResourceReflectPath
		}

		pattern := "REFLECT " + reflectPath
		if strings.HasSuffix(pattern, "/") {
			pattern = pattern + "{$}"
		}

		slog.Info("HTTPResourceReflectHandlerContributeHTTP", "pattern", pattern)
		mux.Handle(pattern, &HTTPReflectHandler{
			Debug: h.Debug,
			Reflector: &commands.DynamicReflector{
				ReflectTransform: h.transformDef,
				Reflectors:       func() []commands.Reflector { return reflectors },
			},
		})

		// // TODO enable below instead of above when we want to experiment with REFLECT being a stream
		// mux.Handle(pattern, &httpframework.PathSingletonMux[*HTTPReflectAnnouncer]{
		// 	RequestKey: func(r *http.Request) (string, context.Context, error) {
		// 		// one reflect announcer for each URL

		// 		ctx := context.Background()
		// 		prefix := httpframework.ContextPrefix(ctx)
		// 		// we need the PathValuer interface from request. in the future we might copy/reparse the pattern but for now
		// 		// reuse this.
		// 		ctx = WithPathValuer(ctx, r)
		// 		ctx = httpframework.WithPrefix(ctx, prefix)
		// 		return r.URL.String(), ctx, nil
		// 	},
		// 	KeyHandler: func(ctx context.Context, k string) (*HTTPReflectAnnouncer, error) {
		// 		return &HTTPReflectAnnouncer{
		// 			Debug:   h.Debug,
		// 			Context: ctx,
		// 			Reflector: &commands.DynamicReflector{
		// 				ReflectTransform: h.transformDef,
		// 				Reflectors:       func() []commands.Reflector { return reflectors },
		// 			},
		// 		}, nil
		// 	},
		// 	Log: h.Log,
		// })
	}
}
