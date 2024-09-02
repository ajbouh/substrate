package commands

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"reflect"
	"strings"

	"tractor.dev/toolkit-go/engine"
)

type HTTPResourceCommand struct {
	ReflectPath string
	Pattern     string
	Handler     interface {
		// HACK
		ParamsType() reflect.Type
		ReturnsType() reflect.Type

		Reflector
		Runner
	}
}

var _ HTTPResourceReflector = (*HTTPResourceCommand)(nil)

func (res *HTTPResourceCommand) Assembly() []engine.Unit {
	units := []engine.Unit{res.Handler}
	if depender, ok := res.Handler.(engine.Depender); ok {
		units = append(units, depender.Assembly()...)
	}
	return units
}

func (res *HTTPResourceCommand) ensureRunHTTPField(commandName string, commandDef Def) (string, Def) {
	// for each command, populate any missing run fields. this provides enough information for
	// someone to "run" the associated command through this handler.
	if commandDef.Run == nil {
		commandDef.Run = &RunDef{}
	}

	modifyCommandDefRunHTTP := false
	if commandDef.Run.HTTP == nil {
		modifyCommandDefRunHTTP = true
		commandDef.Run.HTTP = &RunHTTPDef{
			Parameters: map[string]RunFieldDef{},
			Returns:    map[string]RunFieldDef{},
			Request: RunHTTPRequestDef{
				Headers: map[string][]string{
					"Content-Type": {"application/json"},
				},
				Body: map[string]any{},
			},
		}
	}

	commandDef.Run.HTTP.Request.URL = res.HTTPResourcePath()
	commandDef.Run.HTTP.Request.Method = res.HTTPMethod()

	if modifyCommandDefRunHTTP {
		for field := range commandDef.Returns {
			commandDef.Run.HTTP.Returns[field] = RunFieldDef{Path: `response.body.` + field}
		}

		paramsType := res.Handler.ParamsType()
		if paramsType.Kind() == reflect.Struct {
			for _, field := range reflect.VisibleFields(paramsType) {
				jsonTag, ok := field.Tag.Lookup("json")
				if !ok {
					continue
				}
				fieldName, _, _ := strings.Cut(jsonTag, ",")
				if fieldName == "-" {
					continue
				}

				fieldPath := `request.body.` + fieldName
				if pathVar, ok := field.Tag.Lookup("path"); ok {
					fieldPath = `request.url.path.` + pathVar
				} else if queryVar, ok := field.Tag.Lookup("query"); ok {
					fieldPath = `request.query.` + queryVar
				}
				commandDef.Run.HTTP.Parameters[fieldName] = RunFieldDef{Path: fieldPath}
			}
		}
	}

	return commandName, commandDef
}

func (res *HTTPResourceCommand) Reflect(ctx context.Context) (DefIndex, error) {
	di, err := res.Handler.Reflect(ctx)

	if di != nil {
		// We only expect one command, but loop anyway.
		di = TranformDefIndex(di, res.ensureRunHTTPField)
	}
	return di, err
}

func (res *HTTPResourceCommand) ContributeHTTP(mux *http.ServeMux) {
	mux.Handle(res.Pattern, res)
}

func (r *HTTPResourceCommand) shouldUnmarshalRequestBody(req *http.Request) bool {
	switch req.Method {
	case http.MethodGet, http.MethodHead, http.MethodTrace, http.MethodConnect, http.MethodDelete:
		return false
	}

	if treatAsVoid(r.Handler.ParamsType()) {
		return false
	}

	if req.ContentLength == 0 {
		return false
	}

	if req.Body == nil {
		return false
	}

	return true
}

func (r *HTTPResourceCommand) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	params := Fields{}

	if r.shouldUnmarshalRequestBody(req) {
		defer req.Body.Close()
		err := json.NewDecoder(req.Body).Decode(&params)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusBadRequest)
			return
		}
	}

	err := populateRequestBasedFields(req, r.Handler.ParamsType(), params)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
		return
	}

	v, err := r.Handler.Run(req.Context(), "", params)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
		return
	}

	if !treatAsVoid(r.Handler.ReturnsType()) {
		err := json.NewEncoder(w).Encode(v)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
			return
		}
	}
}

func (r *HTTPResourceCommand) HTTPMethod() string {
	methodOrPath, _, ok := strings.Cut(r.Pattern, " ")
	if ok {
		return methodOrPath
	}
	return ""
}

func (r *HTTPResourceCommand) HTTPResourceReflectPath() string {
	if r.ReflectPath != "" {
		return r.ReflectPath
	}

	return r.HTTPResourcePath()
}

func (r *HTTPResourceCommand) HTTPResourcePath() string {
	methodOrPath, path, ok := strings.Cut(r.Pattern, " ")
	if ok {
		return path
	}
	return methodOrPath
}

// For REFLECT to pick up all the methods, we need to gather them and reflect on them.
type HTTPResourceReflector interface {
	HTTPResourceReflectPath() string
	Reflector
}

type HTTPResourceReflectHandler struct {
	BaseURL          string
	HTTPHandlerPaths []HTTPResourceReflector
}

func (h *HTTPResourceReflectHandler) ContributeHTTP(mux *http.ServeMux) {
	// group by path
	m := map[string][]Reflector{}
	for _, p := range h.HTTPHandlerPaths {
		key := p.HTTPResourceReflectPath()
		m[key] = append(m[key], p)
		slog.Info("HTTPResourceReflectHandler.ContributeHTTP()", "resourcepath", key, "type", reflect.TypeOf(p).String())
	}

	// register unique REFLECT routes for each
	for path, reflectors := range m {
		if strings.HasSuffix(path, "/") {
			path = path + "{$}"
		}
		mux.Handle("REFLECT "+path, &HTTPReflectHandler{
			ReflectRequestTransform: func(r *http.Request, name string, def Def) (string, Def) {
				// should probably raise this
				name, def = EnsureRunHTTPRequestURLHasAHost(h.BaseURL)(name, def)

				var drop []string
				for k, v := range def.Run.HTTP.Parameters {
					if strings.HasPrefix(v.Path, "request.url.path.") {
						urlPathValueName := strings.TrimPrefix(v.Path, "request.url.path.")
						pathValue := r.PathValue(urlPathValueName)
						if pathValue != "" {
							def.Run.HTTP.Request.URL = strings.ReplaceAll(def.Run.HTTP.Request.URL, "{"+urlPathValueName+"}", pathValue)
							delete(def.Parameters, k)
							drop = append(drop, k)
						}
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
