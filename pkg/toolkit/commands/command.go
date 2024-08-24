package commands

import (
	"context"
	"encoding/json"
	"fmt"
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

func (r *CommandFunc[Target, Params, Returns]) ParamsAreVoid() bool {
	return treatAsVoid(reflect.TypeFor[Params]())
}

func (r *CommandFunc[Target, Params, Returns]) ReturnsAreVoid() bool {
	return treatAsVoid(reflect.TypeFor[Returns]())
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
	case reflect.Struct:
		params = FieldDefsFromStructFields(reflect.VisibleFields(paramsType))
	case reflect.Map:
		params = FieldDefs{}
	default:
		err = fmt.Errorf("params type %s is not a struct or a map for command named %q with func %T", paramsType.String(), r.Name, r.Func)
	}
	if err != nil {
		return nil, err
	}

	var returns FieldDefs
	returnsType := reflect.TypeFor[Returns]()
	switch paramsType.Kind() {
	case reflect.Struct:
		returns = FieldDefsFromStructFields(reflect.VisibleFields(paramsType))
	case reflect.Map:
		returns = FieldDefs{}
	default:
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

	paramsIsVoid := treatAsVoid(reflect.TypeFor[Params]())
	returnsIsVoid := treatAsVoid(reflect.TypeFor[Returns]())

	params := new(Params)

	if !paramsIsVoid {
		b, err := json.Marshal(pfields)
		if err != nil {
			return nil, err
		}

		err = json.Unmarshal(b, &params)
		if err != nil {
			return nil, err
		}
	}

	v, err := r.Func(ctx, r.Target, *params)
	if err != nil {
		return nil, err
	}

	rfields := Fields{}
	if !returnsIsVoid {
		b, err := json.Marshal(v)
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

func populatePathValueForField(value reflect.Value, field reflect.StructField, r *http.Request) (bool, error) {
	key, ok := field.Tag.Lookup("path")
	if !ok {
		return false, nil
	}

	if field.Type.Kind() != reflect.String {
		return false, fmt.Errorf(`bad type for field with path struct tag %#v (%s); must be string`, field, value.Type().String())
	}

	pathValue := r.PathValue(key)
	value.FieldByIndex(field.Index).SetString(pathValue)
	return true, nil
}

func populateQueryValueForField(value reflect.Value, field reflect.StructField, q url.Values) (bool, error) {
	key, ok := field.Tag.Lookup("query")
	if !ok {
		return false, nil
	}

	queryValue, ok := q[key]
	if !ok {
		return false, nil
	}

	switch field.Type.Kind() {
	case reflect.String:
		value.FieldByIndex(field.Index).SetString(queryValue[0])
		return true, nil
	case reflect.Slice:
		if field.Type.Elem().Kind() == reflect.String {
			value.FieldByIndex(field.Index).Set(reflect.ValueOf(queryValue))
			return true, nil
		}
	case reflect.Pointer:
		switch field.Type.Elem().Kind() {
		case reflect.String:
			value.FieldByIndex(field.Index).SetString(queryValue[0])
			return true, nil
		}
	}

	return false, fmt.Errorf(`bad type for field with query struct tag %#v (%s); must be string or *string or []string`, field, value.Type().String())
}

func populateRequestBasedFields[Params any](r *http.Request, params Params) error {
	paramsValue := reflect.ValueOf(params)
	paramsType := paramsValue.Type().Elem()

	if paramsType.Kind() == reflect.Struct {
		for _, field := range reflect.VisibleFields(paramsType) {
			ok, err := populatePathValueForField(paramsValue, field, r)
			if err != nil {
				return err
			}
			if ok {
				continue
			}

			_, err = populateQueryValueForField(paramsValue, field, r.URL.Query())
			if err != nil {
				return err
			}
		}
	}

	return nil
}
