package handle

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"reflect"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/xengine"

	"github.com/ajbouh/substrate/pkg/toolkit/engine"
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

var _ commands.Reflector = (*CommandFunc[any, any, any])(nil)
var _ commands.Runner = (*CommandFunc[any, any, any])(nil)
var _ commands.Source = (*CommandFunc[any, any, any])(nil)

type CommandFunc[Target any, Params any, Returns any] struct {
	Target *Target
	Name   string
	Desc   string
	Func   func(ctx context.Context, t *Target, p Params) (Returns, error)

	Examples map[string]commands.Fields

	HTTPMethod              string
	HTTPResourcePath        string
	HTTPResourceReflectPath string
}

var _ commands.Reflector = (*CommandFunc[any, any, any])(nil)
var _ commands.Source = (*CommandFunc[any, any, any])(nil)
var _ engine.Depender = (*CommandFunc[any, any, any])(nil)
var _ HTTPResource = (*CommandFunc[any, any, any])(nil)
var _ HTTPResourceReflect = (*CommandFunc[any, any, any])(nil)

func mustCloneExamples(m map[string]commands.Fields) map[string]commands.Fields {
	o, err := cloneExamples(m)
	if err != nil {
		panic(err)
	}
	return o
}

func cloneExamples(m map[string]commands.Fields) (map[string]commands.Fields, error) {
	var b []byte
	b, err := json.Marshal(m)
	if err != nil {
		return nil, err
	}

	var o map[string]commands.Fields
	err = json.Unmarshal(b, &o)
	if err != nil {
		return nil, err
	}

	return o, nil
}

func (r *CommandFunc[Target, Params, Returns]) Clone() *CommandFunc[Target, Params, Returns] {
	return &CommandFunc[Target, Params, Returns]{
		Target: r.Target,
		Name:   r.Name,
		Desc:   r.Desc,
		Func:   r.Func,

		Examples: mustCloneExamples(r.Examples),

		HTTPMethod:              r.HTTPMethod,
		HTTPResourcePath:        r.HTTPResourcePath,
		HTTPResourceReflectPath: r.HTTPResourceReflectPath,
	}
}

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

func (r *CommandFunc[Target, Params, Returns]) WithExample(name string, data commands.Fields) *CommandFunc[Target, Params, Returns] {
	if r.Examples == nil {
		r.Examples = map[string]commands.Fields{}
	}
	r.Examples[name] = data
	return r
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

			return commands.HasJSONFields(paramsType, true)
		}

		var params commands.Fields

		if shouldUnmarshalRequestBody() {
			err := json.NewDecoder(req.Body).Decode(&params)
			req.Body.Close()
			if err != nil {
				http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusBadRequest)
				return
			}
		}

		if params == nil {
			params = commands.Fields{}
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

		if commands.HasJSONFields(returnsType, false) {
			err := json.NewEncoder(w).Encode(v)
			if err != nil {
				http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
				return
			}
		}
	})
}

func (r *CommandFunc[Target, Params, Returns]) Reflect(ctx context.Context) (commands.DefIndex, error) {
	slog.Info("CommandFunc[Target, Params, Returns].Reflect()", "Target", reflect.TypeFor[Target](), "Params", reflect.TypeFor[Params](), "Returns", reflect.TypeFor[Returns]())

	var errs []error
	meta := commands.Meta{}
	var params commands.Fields
	inBindings := commands.Bindings{}
	pathValuer := ContextPathValuer(ctx)
	paramsType := reflect.TypeFor[Params]()
	paramBinding := func(prefix commands.DataPointer, name string, field reflect.StructField) {
		if pathVar, ok := field.Tag.Lookup("path"); ok {
			var pathVal any
			var ok bool
			var err error
			if pathValuer != nil {
				pathVal, ok, err = getPathValueForField(field, pathValuer)
				if err != nil {
					errs = append(errs, err)
				} else if ok {
					if params == nil {
						params = commands.Fields{}
					}
					params.Set(name, pathVal)
				}
			}
			slog.Info("paramBinding", "pathValuer", pathValuer, "name", name, "prefix", prefix, "pathVar", pathVar, "pathVal", pathVal, "ok", ok, "err", err)

			inBindings.Add(
				commands.NewDataPointer("msg", "http", "request", "path", pathVar),
				prefix.Append(name),
			)
			return
		} else if queryVar, ok := field.Tag.Lookup("query"); ok {
			inBindings.Add(
				commands.NewDataPointer("msg", "http", "request", "query", queryVar, "0"),
				prefix.Append(name),
			)
			return
		} else if headerVar, ok := field.Tag.Lookup("header"); ok {
			inBindings.Add(
				commands.NewDataPointer("msg", "http", "request", "headers", headerVar, "0"),
				prefix.Append(name),
			)
			return
		}

		inBindings.Add(
			commands.NewDataPointer("msg", "http", "request", "body", name),
			prefix.Append(name),
		)
	}

	switch paramsType.Kind() {
	case reflect.Pointer:
		VisitFieldDefsFromStructFields(meta, commands.NewDataPointer("data", "parameters"), reflect.VisibleFields(paramsType.Elem()), paramBinding, nil)
	case reflect.Struct:
		VisitFieldDefsFromStructFields(meta, commands.NewDataPointer("data", "parameters"), reflect.VisibleFields(paramsType), paramBinding, nil)
	default:
		return nil, fmt.Errorf("params type %s is not a struct for command named %q with func %T", paramsType.String(), r.Name, r.Func)
	}

	if len(errs) > 0 {
		return nil, errors.Join(errs...)
	}

	outBindings := commands.Bindings{}
	returnsType := reflect.TypeFor[Returns]()
	returnsBinding := func(prefix commands.DataPointer, name string, field reflect.StructField) {
		outBindings.Add(
			prefix.Append(name),
			commands.NewDataPointer("msg", "http", "response", "body", name),
		)
	}
	switch returnsType.Kind() {
	case reflect.Pointer:
		VisitFieldDefsFromStructFields(meta, commands.NewDataPointer("data", "returns"), reflect.VisibleFields(returnsType.Elem()), returnsBinding, nil)
	case reflect.Struct:
		VisitFieldDefsFromStructFields(meta, commands.NewDataPointer("data", "returns"), reflect.VisibleFields(returnsType), returnsBinding, nil)
	default:
		return nil, fmt.Errorf("returns type %s is not a struct for command named %q with func %T", returnsType.String(), r.Name, r.Func)
	}

	def := commands.Fields{
		"description": r.Desc,
		"meta":        meta,
		"data":        commands.Fields{"returns": commands.Fields{}},
	}

	if params != nil {
		var err error
		def, err = commands.SetPath(def, []string{"data", "parameters"}, params)
		if err != nil {
			return nil, err
		}
	}

	if len(r.Examples) > 0 {
		var err error
		def["examples"], err = cloneExamples(r.Examples)
		if err != nil {
			return nil, err
		}
	}

	if r.HTTPResourcePath != "" {
		def["cap"] = "msg"
		def["msg_in"] = inBindings
		def["msg_out"] = outBindings
		def["msg"] = commands.Fields{
			"cap": "http",
			"http": commands.Fields{
				"request": commands.Fields{
					"headers": map[string][]string{
						"Content-Type": {"application/json"},
					},
					"url":    r.HTTPResourcePath,
					"method": r.HTTPMethod,
				},
			},
		}
	}

	return commands.DefIndex{
		r.Name: def,
	}, nil
}

func (r *CommandFunc[Target, Params, Returns]) Run(ctx context.Context, name string, pfields commands.Fields) (commands.Fields, error) {
	if name != "" && name != r.Name {
		return nil, commands.ErrNoSuchCommand
	}

	// Reserializing is kind of wasteful, but it's simple so fix it later once it matters.

	params := new(Params)
	paramsValue := reflect.ValueOf(params).Elem()
	paramsType := paramsValue.Type()

	if commands.HasJSONFields(paramsType, false) {
		b, err := json.Marshal(pfields)
		if err != nil {
			return nil, err
		}

		err = json.Unmarshal(b, params)
		if err != nil {
			return nil, err
		}
	}

	if len(pfields) > 0 {
		// copy any fields that can't be serialized as json, like io.ReadCloser and http.ResponseWriter
		for _, field := range reflect.VisibleFields(paramsType) {
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

	rfields := commands.Fields{}
	if commands.HasJSONFields(reflect.TypeFor[Returns](), false) {
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
