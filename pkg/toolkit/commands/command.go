package commands

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
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

var _ Reflector = (*CommandFunc[any, any, any])(nil)
var _ Runner = (*CommandFunc[any, any, any])(nil)

type HTTPStatusError struct {
	Err     error
	Status  int
	Message string
}

var _ error = (*HTTPStatusError)(nil)

func (h *HTTPStatusError) Error() string {
	var message string
	if h.Message != "" {
		message = ": " + h.Message
	}
	if h.Err == nil {
		return fmt.Sprintf("HTTP Status %d%s", h.Status, message)
	}
	return fmt.Sprintf("HTTP Status %d%s: %s", h.Status, message, h.Err.Error())
}

func (h *HTTPStatusError) Unwrap() error {
	return h.Err
}

type CommandFunc[Target any, Params any, Returns any] struct {
	Target *Target
	Name   string
	Desc   string
	Func   func(ctx context.Context, t *Target, p Params) (Returns, error)
}

func (r *CommandFunc[Target, Params, Returns]) ParamsType() reflect.Type {
	return reflect.TypeFor[Params]()
}

func (r *CommandFunc[Target, Params, Returns]) ReturnsType() reflect.Type {
	return reflect.TypeFor[Returns]()
}

func treatAsVoid(t reflect.Type) bool {
	return t.Kind() == reflect.Struct && len(reflect.VisibleFields(t)) == 0
}

func (r *CommandFunc[Target, Params, Returns]) Assembly() []engine.Unit {
	target, units, ok := xengine.AssemblyForPossiblyAnonymousTarget[Target]()
	if ok {
		r.Target = target
	}
	return units

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

	return DefIndex{
		r.Name: Def{
			Description: r.Desc,
			Parameters:  params,
			Returns:     returns,
		},
	}, nil
}

func (r *CommandFunc[Target, Params, Returns]) Run(ctx context.Context, name string, pfields Fields) (Fields, error) {
	if name != "" && name != r.Name {
		return nil, ErrNoSuchCommand
	}

	// Reserializing is kind of wasteful, but it's simple so fix it later once it matters.

	params := new(Params)

	if !treatAsVoid(r.ParamsType()) {
		b, err := json.Marshal(pfields)
		if err != nil {
			return nil, err
		}

		err = json.Unmarshal(b, &params)
		if err != nil {
			return nil, err
		}
	}

	returns, err := r.Func(ctx, r.Target, *params)
	if err != nil {
		return nil, err
	}

	rfields := Fields{}
	if !treatAsVoid(r.ReturnsType()) {
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

func FieldDefsFromStructFields(fields []reflect.StructField) FieldDefs {
	fieldDefs := FieldDefs{}
	for _, p := range fields {
		var field string
		if jsonTag, ok := p.Tag.Lookup("json"); ok {
			if jsonTag == "-" {
				continue
			}
			field, _, _ = strings.Cut(jsonTag, ",")
		} else {
			field = p.Name
		}

		fieldDef := FieldDef{
			Type: p.Type.String(),
		}
		if descTag, ok := p.Tag.Lookup("desc"); ok {
			fieldDef.Description = descTag
		}

		fieldDefs[field] = fieldDef
	}

	return fieldDefs
}

type PathValuer interface {
	PathValue(key string) string
}

func getPathValueForField(field reflect.StructField, r *http.Request) (any, bool, error) {
	key, ok := field.Tag.Lookup("path")
	if !ok {
		return nil, false, nil
	}

	if field.Type.Kind() != reflect.String {
		return nil, false, fmt.Errorf(`bad type for field with path struct tag %#v; must be string`, field)
	}

	pathValue := r.PathValue(key)
	return pathValue, true, nil
}

func getQueryValueForField(field reflect.StructField, q url.Values) (any, bool, error) {
	key, ok := field.Tag.Lookup("query")
	if !ok {
		return nil, false, nil
	}

	queryValue, ok := q[key]
	if !ok {
		return nil, false, nil
	}

	switch field.Type.Kind() {
	case reflect.String:
		return queryValue[0], true, nil
	case reflect.Slice:
		if field.Type.Elem().Kind() == reflect.String {
			return queryValue, true, nil
		}
	case reflect.Pointer:
		switch field.Type.Elem().Kind() {
		case reflect.String:
			return queryValue[0], true, nil
		}
	}

	return nil, false, fmt.Errorf(`bad type for field with query struct tag %#v; must be string or *string or []string`, field)
}

func getRequestBasedField(field reflect.StructField, r *http.Request, q url.Values) (string, any, bool, error) {
	var val any
	val, ok, err := getPathValueForField(field, r)
	if err != nil {
		return "", val, false, err
	}

	if !ok {
		val, ok, err = getQueryValueForField(field, q)
		if err != nil {
			return "", val, false, err
		}
	}

	if !ok {
		return "", val, false, nil
	}

	jsonTag, jsonTagOK := field.Tag.Lookup("json")
	if jsonTagOK {
		return field.Name, val, true, nil
	}

	fieldName, _, _ := strings.Cut(jsonTag, ",")
	return fieldName, val, ok, err
}

func populateRequestBasedFields(r *http.Request, paramsType reflect.Type, params Fields) error {
	slog.Info("populateRequestBasedFields", "params", params, "paramsType", paramsType, "paramsTypeKind", paramsType.Kind())

	if paramsType.Kind() == reflect.Struct {
		query := r.URL.Query()
		for _, field := range reflect.VisibleFields(paramsType) {
			fieldName, val, ok, err := getRequestBasedField(field, r, query)
			if err != nil {
				return err
			}
			if !ok || fieldName == "-" {
				continue
			}

			params[fieldName] = val
		}
	}

	return nil
}
