package commands

import (
	"context"
	"log/slog"
	"net/http"
	"slices"
	"strings"
)

type HTTPResourceReflectHandler struct {
	Debug     bool
	BaseURL   string
	Aggregate *Aggregate

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
		return &DynamicReflector{
			ReflectTransform: xform,
			Reflectors: func() []Reflector {
				reflectors := h.ReflectorsPerRoute[reflectPath]
				if len(excluding) > 0 {
					reflectors = slices.DeleteFunc(reflectors, func(r Reflector) bool { return slices.Contains(excluding, r) })
				}
				return reflectors
			},
		}
	}
}

func (h *HTTPResourceReflectHandler) ContributeHTTP(mux *http.ServeMux) {
	// group by path
	h.ReflectorsPerRoute = Group(h.Aggregate.GatherReflectorsExcluding(context.Background(), nil), HTTPResourceReflectPath)
	slog.Info("HTTPResourceReflectHandler.ContributeHTTP", "ReflectorsPerRoute", h.ReflectorsPerRoute)

	// register unique REFLECT routes for each
	for reflectPath, reflectors := range h.ReflectorsPerRoute {
		reflectPath := reflectPath
		reflectors := reflectors

		if reflectPath == "" {
			reflectPath = h.DefaultHTTPResourceReflectPath
		}

		pattern := "REFLECT " + reflectPath
		if strings.HasSuffix(pattern, "/") {
			pattern = pattern + "{$}"
		}

		xform := DefTransforms(
			// should only pick up commands that don't have a route set and are therefore top-level.
			EnsureRunHTTPField(
				h.HTTPRunHandler.CatchallRunnerMethod(),
				h.HTTPRunHandler.CatchallRunnerPath(),
			),
			EnsureRunHTTPRequestURLHasAHost(h.BaseURL),
		)

		slog.Info("HTTPResourceReflectHandlerContributeHTTP", "pattern", pattern)
		mux.Handle(pattern, &HTTPReflectHandler{
			Debug: h.Debug,
			ReflectRequestTransform: func(r *http.Request, name string, def Def) (string, Def) {
				// should probably raise this
				name, def = xform(name, def)

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
							pathValue = r.PathValue(urlPathValueName)
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
			},
			Reflector: &DynamicReflector{
				Reflectors: func() []Reflector { return reflectors },
			},
		})
	}
}