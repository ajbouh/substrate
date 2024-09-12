package commands

import (
	"context"
	"log/slog"
	"net/http"
	"slices"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
)

type HTTPResourceReflectHandler struct {
	Debug     bool
	BaseURL   string
	Aggregate *Aggregate
	Log       *slog.Logger

	HTTPRunHandler                 *HTTPRunHandler
	DefaultHTTPResourceReflectPath string

	ReflectorsPerRoute map[string][]Reflector
}

func HTTPResourceReflectPath(reflector Reflector) string {
	var key string
	if rp, ok := reflector.(HTTPResourceReflect); ok {
		key = rp.GetHTTPResourceReflectPath()
	}
	return key
}

type HTTPResourceReflect interface {
	GetHTTPResourceReflectPath() string
}

func (h *HTTPResourceReflectHandler) ReflectorForPathFuncExcluding(excluding ...Reflector) func(string) Reflector {
	xform := DefTransforms(
		// should only pick up commands that don't have a route set and are therefore top-level.
		EnsureRunHTTPField(h.HTTPRunHandler.CatchallRunnerMethod(), h.HTTPRunHandler.CatchallRunnerPath()),
		EnsureRunHTTPRequestURLHasAHost(h.BaseURL),
	)

	return func(reflectPath string) Reflector {
		if reflectPath == "" {
			reflectPath = h.DefaultHTTPResourceReflectPath
		}
		slog.Info("ReflectorForPathFuncExcluding", "reflectPath", reflectPath, "h.ReflectorsPerRoute[reflectPath]", h.ReflectorsPerRoute[reflectPath])
		return &DynamicReflector{
			ReflectTransform: xform,
			Reflectors: func() []Reflector {
				reflectors := slices.Clone(h.ReflectorsPerRoute[reflectPath])
				if len(excluding) > 0 {
					reflectors = slices.DeleteFunc(reflectors, func(r Reflector) bool { return slices.Contains(excluding, r) })
				}
				return reflectors
			},
		}
	}
}

func EnsureRunHTTPRequestURLIncludesPrefix(prefix string) DefTransformFunc {
	return func(ctx context.Context, commandName string, commandDef Def) (string, Def) {
		if prefix == "" || commandDef.Run == nil || commandDef.Run.HTTP == nil {
			return commandName, commandDef
		}

		// is this a full URL? if not make it so.
		if strings.HasPrefix(commandDef.Run.HTTP.Request.URL, "/") {
			commandDef.Run.HTTP.Request.URL = prefix + commandDef.Run.HTTP.Request.URL
		}

		return commandName, commandDef
	}
}

func (h *HTTPResourceReflectHandler) transformDef(ctx context.Context, name string, def Def) (string, Def) {
	xform := DefTransforms(
		// should only pick up commands that don't have a route set and are therefore top-level.
		EnsureRunHTTPField(
			h.HTTPRunHandler.CatchallRunnerMethod(),
			h.HTTPRunHandler.CatchallRunnerPath(),
		),
	)

	name, def = xform(ctx, name, def)

	prefix := httpframework.ContextPrefix(ctx)
	name, def = EnsureRunHTTPRequestURLIncludesPrefix(prefix)(ctx, name, def)
	name, def = EnsureRunHTTPRequestURLHasAHost(h.BaseURL)(ctx, name, def)

	var drop []string
	for k, v := range def.Run.HTTP.Parameters {
		if strings.HasPrefix(v.Path, "request.url.path.") {
			urlPathValueName := strings.TrimPrefix(v.Path, "request.url.path.")
			var pathValue string
			var pathValueOK bool
			if def.Run.Bind != nil && def.Run.Bind.Parameters != nil {
				pathValue, pathValueOK = def.Run.Bind.Parameters[k].(string)
				if pathValueOK {
					delete(def.Run.Bind.Parameters, k)
				}
			}
			if !pathValueOK {
				pathValuer := ContextPathValuer(ctx)
				pathValue = pathValuer.PathValue(urlPathValueName)
			}

			url := def.Run.HTTP.Request.URL
			url = strings.ReplaceAll(url, "{"+urlPathValueName+"}", pathValue)
			url = strings.ReplaceAll(url, "{"+urlPathValueName+"...}", pathValue)
			def.Run.HTTP.Request.URL = url
			delete(def.Parameters, k)
			drop = append(drop, k)
		}
	}

	for _, k := range drop {
		delete(def.Run.HTTP.Parameters, k)
	}

	return name, def
}

func (h *HTTPResourceReflectHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	// group by path
	h.ReflectorsPerRoute = Group(h.Aggregate.GatherReflectorsExcluding(context.Background(), nil), HTTPResourceReflectPath)

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
			Reflector: &DynamicReflector{
				ReflectTransform: h.transformDef,
				Reflectors:       func() []Reflector { return reflectors },
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
		// 			Reflector: &DynamicReflector{
		// 				ReflectTransform: h.transformDef,
		// 				Reflectors:       func() []Reflector { return reflectors },
		// 			},
		// 		}, nil
		// 	},
		// 	Log: h.Log,
		// })
	}
}
