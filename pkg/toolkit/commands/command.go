package commands

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"reflect"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/xengine"

	"tractor.dev/toolkit-go/engine"
)

func Command[Target any, Params any, Returns any](name, desc string, f func(ctx context.Context, t *Target, p Params) (Returns, error)) *CommandFunc[Target, Params, Returns] {
	return &CommandFunc[Target, Params, Returns]{
		Name: name,
		Desc: desc,
		Func: f,
	}
}

func HTTPCommand[Target any, Params any, Returns any](
	name, desc string,
	pattern, reflectPath string,
	f func(ctx context.Context, t *Target, p Params) (Returns, error),
) *CommandFunc[Target, Params, Returns] {
	var method string
	method, resourcePath, ok := strings.Cut(pattern, " ")
	if !ok {
		resourcePath = method
		method = ""
	}

	if reflectPath == "" {
		reflectPath = resourcePath
	}

	return &CommandFunc[Target, Params, Returns]{
		Name: name,
		Desc: desc,
		Func: f,

		HTTPMethod:              method,
		HTTPResourcePath:        resourcePath,
		HTTPResourceReflectPath: reflectPath,
	}
}

var _ Reflector = (*CommandFunc[any, any, any])(nil)
var _ Runner = (*CommandFunc[any, any, any])(nil)
var _ Source = (*CommandFunc[any, any, any])(nil)

type CommandFunc[Target any, Params any, Returns any] struct {
	Target *Target
	Name   string
	Desc   string
	Func   func(ctx context.Context, t *Target, p Params) (Returns, error)

	HTTPMethod              string
	HTTPResourcePath        string
	HTTPResourceReflectPath string
}

var _ Reflector = (*CommandFunc[any, any, any])(nil)
var _ Source = (*CommandFunc[any, any, any])(nil)
var _ engine.Depender = (*CommandFunc[any, any, any])(nil)
var _ HTTPResource = (*CommandFunc[any, any, any])(nil)
var _ HTTPResourceReflect = (*CommandFunc[any, any, any])(nil)

func (r *CommandFunc[Target, Params, Returns]) String() string {
	return "*CommandFunc[" + r.Name + "]"
}

func (r *CommandFunc[Target, Params, Returns]) Assembly() []engine.Unit {
	target, units, ok := xengine.AssemblyForPossiblyAnonymousTarget[Target]()
	slog.Info("CommandFunc[Target, Params, Returns].Assembly", "r", reflect.TypeOf(r).String(), "target", target, "units", units, "ok", ok)

	if ok {
		r.Target = target
	}
	return units
}

func (r *CommandFunc[Target, Params, Returns]) Initialize() {
	slog.Info("CommandFunc[Target, Params, Returns].Initialize", "r", reflect.TypeOf(r).String(), "target", r.Target)
}

func (r *CommandFunc[Target, Params, Returns]) GetHTTPResourceReflectPath() string {
	return r.HTTPResourceReflectPath
}

func (r *CommandFunc[Target, Params, Returns]) GetHTTPPattern() string {
	if r.HTTPResourcePath == "" {
		return ""
	}

	return r.HTTPMethod + " " + r.HTTPResourcePath
}

func (r *CommandFunc[Target, Params, Returns]) GetHTTPHandler() http.Handler {
	if r.HTTPResourcePath == "" {
		return nil
	}

	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		slog.Info("CommandFunc[Target, Params, Returns].HandlerFunc", "r", reflect.TypeOf(r).String(), "target", r.Target)

		paramsType := reflect.TypeFor[Params]()
		returnsType := reflect.TypeFor[Returns]()

		shouldUnmarshalRequestBody := func() bool {
			switch req.Method {
			case http.MethodGet, http.MethodHead, http.MethodTrace, http.MethodConnect, http.MethodDelete:
				return false
			}

			if req.ContentLength == 0 || req.Body == nil {
				return false
			}

			return !treatAsVoid(paramsType)
		}

		params := Fields{}

		if shouldUnmarshalRequestBody() {
			err := json.NewDecoder(req.Body).Decode(&params)
			req.Body.Close()
			if err != nil {
				http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusBadRequest)
				return
			}
		}

		err := populateRequestBasedFields(w, req, paramsType, params)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
			return
		}

		v, err := r.Run(req.Context(), "", params)
		if err != nil {
			status := http.StatusInternalServerError
			var statusErr *HTTPStatusError
			if errors.As(err, &statusErr) {
				status = statusErr.Status
			}
			http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), status)
			return
		}

		if !treatAsVoid(returnsType) {
			err := json.NewEncoder(w).Encode(v)
			if err != nil {
				http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
				return
			}
		}
	})
}

func treatAsVoid(t reflect.Type) bool {
	if t == nil || t.Kind() == reflect.Struct {
		return true
	}

	fields := reflect.VisibleFields(t)
	if len(fields) == 0 {
		return true
	}

	for _, field := range fields {
		if _, ok := field.Tag.Lookup("path"); !ok {
			continue
		}

		if _, ok := field.Tag.Lookup("query"); !ok {
			continue
		}

		if tag, ok := field.Tag.Lookup("json"); !ok || tag == "-" {
			continue
		}

		return false
	}

	return true
}

func (r *CommandFunc[Target, Params, Returns]) Reflect(ctx context.Context) (DefIndex, error) {
	var err error

	var params FieldDefs
	paramsType := reflect.TypeFor[Params]()
	switch paramsType.Kind() {
	case reflect.Pointer:
		params = FieldDefsFromStructFields(reflect.VisibleFields(paramsType.Elem()))
	case reflect.Struct:
		params = FieldDefsFromStructFields(reflect.VisibleFields(paramsType))
	case reflect.Map:
		params = FieldDefs{}
	}
	if params == nil {
		err = fmt.Errorf("params type %s is not a struct or a map for command named %q with func %T", paramsType.String(), r.Name, r.Func)
	}
	if err != nil {
		return nil, err
	}

	var returns FieldDefs
	returnsType := reflect.TypeFor[Returns]()
	switch returnsType.Kind() {
	case reflect.Pointer:
		returns = FieldDefsFromStructFields(reflect.VisibleFields(returnsType.Elem()))
	case reflect.Struct:
		returns = FieldDefsFromStructFields(reflect.VisibleFields(returnsType))
	case reflect.Map:
		returns = FieldDefs{}
	}
	if params == nil {
		err = fmt.Errorf("returns type %s is not a struct or a map for command named %q with func %T", returnsType.String(), r.Name, r.Func)
	}
	if err != nil {
		return nil, err
	}

	def := Def{
		Description: r.Desc,
		Parameters:  params,
		Returns:     returns,
	}

	if r.HTTPResourcePath != "" {
		def.Run = &RunDef{
			HTTP: &RunHTTPDef{
				Returns:    map[string]RunFieldDef{},
				Parameters: map[string]RunFieldDef{},
				Request: RunHTTPRequestDef{
					Headers: map[string][]string{
						"Content-Type": {"application/json"},
					},
					URL:    r.HTTPResourcePath,
					Method: r.HTTPMethod,
				},
			},
		}

		for field := range returns {
			def.Run.HTTP.Returns[field] = RunFieldDef{Path: `response.body.` + field}
		}

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
				def.Run.HTTP.Parameters[fieldName] = RunFieldDef{Path: fieldPath}
			}
		}
	}

	return DefIndex{
		r.Name: def,
	}, nil
}

func (r *CommandFunc[Target, Params, Returns]) Run(ctx context.Context, name string, pfields Fields) (Fields, error) {
	if name != "" && name != r.Name {
		return nil, ErrNoSuchCommand
	}

	// Reserializing is kind of wasteful, but it's simple so fix it later once it matters.

	params := new(Params)

	if !treatAsVoid(reflect.TypeFor[Params]()) {
		b, err := json.Marshal(pfields)
		if err != nil {
			return nil, err
		}

		err = json.Unmarshal(b, &params)
		if err != nil {
			return nil, err
		}
	}

	if len(pfields) > 0 {
		paramsValue := reflect.ValueOf(params).Elem()
		// copy any fields that can't be serialized as json, like io.ReadCloser and http.ResponseWriter
		for _, field := range reflect.VisibleFields(reflect.TypeFor[Params]()) {
			if tag, ok := field.Tag.Lookup("json"); ok && tag == "-" {
				pvalue := pfields[field.Name]
				if pvalue == nil {
					continue
				}
				paramsValue.FieldByIndex(field.Index).Set(reflect.ValueOf(pvalue))
			}
		}
	}

	returns, err := r.Func(ctx, r.Target, *params)
	if err != nil {
		return nil, err
	}

	rfields := Fields{}
	if !treatAsVoid(reflect.TypeFor[Returns]()) {
		b, err := json.Marshal(returns)
		if err != nil {
			return nil, err
		}

		err = json.Unmarshal(b, &rfields)
		if err != nil {
			return nil, err
		}
	}

	return rfields, nil
}

func ConvertViaJSON[Out, In any](input In) (Out, error) {
	var out Out
	if treatAsVoid(reflect.TypeFor[In]()) || treatAsVoid(reflect.TypeFor[Out]()) {
		return out, nil
	}
	b, err := json.Marshal(input)
	if err != nil {
		return out, err
	}
	err = json.Unmarshal(b, &out)
	return out, err
}

func Call[Out, In any](ctx context.Context, src Source, command string, params In) (*Out, error) {
	paramFields, err := ConvertViaJSON[Fields](params)
	if err != nil {
		return nil, err
	}
	resultFields, err := src.Run(ctx, command, paramFields)
	if err != nil {
		return nil, err
	}
	out, err := ConvertViaJSON[Out](resultFields)
	if err != nil {
		return nil, err
	}
	return &out, nil
}
