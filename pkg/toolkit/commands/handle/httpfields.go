package handle

import (
	"encoding"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"reflect"
	"slices"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

func fieldNameIfAny(p reflect.StructField) (string, bool) {
	if jsonTag, ok := p.Tag.Lookup("json"); ok {
		if jsonTag == "-" {
			return "", false
		}
		field, _, _ := strings.Cut(jsonTag, ",")
		return field, true
	}

	return p.Name, true
}

func isRequired(tag reflect.StructTag) bool {
	if jsonTag, ok := tag.Lookup("json"); ok {
		_, rest, _ := strings.Cut(jsonTag, ",")
		if strings.Contains(rest, "omitempty") {
			return false
		}
	}

	return true
}

func PopulateMeta(
	meta commands.Meta,
	prefix commands.DataPointer,
	t reflect.Type,
	md commands.Metadata,
	visited []reflect.Type,
) {
	if t.Kind() == reflect.Pointer {
		t = t.Elem()
	}

	meta[prefix] = md

	// HACK we should instead address the infinite cycle issue by having a separate data structure for types
	if slices.Contains(visited, t) {
		return
	}

	visited = slices.Clone(visited)
	visited = append(visited, t)

	switch t.Kind() {
	case reflect.Struct:
		VisitFieldDefsFromStructFields(meta, prefix, reflect.VisibleFields(t), nil, visited)
	case reflect.Map:
		p := prefix.Append("*")
		PopulateMeta(meta, p, t.Elem(), commands.Metadata{Type: t.Key().String()}, visited)
	case reflect.Slice, reflect.Array:
		p := prefix.Append("[]")
		PopulateMeta(meta, p, t.Elem(), commands.Metadata{}, visited)
	}
}

func VisitFieldDefsFromStructFields(
	meta commands.Meta,
	prefix commands.DataPointer,
	fields []reflect.StructField,
	bindingFn func(prefix commands.DataPointer, name string, field reflect.StructField),
	visited []reflect.Type,
) {
	for _, p := range fields {
		field, ok := fieldNameIfAny(p)
		if !ok {
			continue
		}

		fieldMeta := commands.Metadata{
			Type:     p.Type.String(),
			Required: isRequired(p.Tag),
		}
		if descTag, ok := p.Tag.Lookup("doc"); ok {
			fieldMeta.Description = descTag
		}
		if bindingFn != nil {
			bindingFn(prefix, field, p)
		}

		// recurse for nested metadata
		PopulateMeta(meta, prefix.Append(field), p.Type, fieldMeta, visited)
	}
}

type PathValuer interface {
	PathValue(key string) string
}

func getPathValueForField(field reflect.StructField, r PathValuer) (any, bool, error) {
	key, ok := field.Tag.Lookup("path")
	if !ok {
		return nil, false, nil
	}

	t := field.Type
	kind := t.Kind()
	if kind == reflect.Pointer {
		t = t.Elem()
	}

	ok = false
	switch t.Kind() {
	case reflect.String:
		ok = true
	default:
		ok = reflect.PointerTo(t).Implements(reflect.TypeFor[encoding.TextUnmarshaler]())
	}

	if !ok {
		return nil, false, fmt.Errorf(`bad type for field with path struct tag %#v; must be string, *string, or implement encoding.TextUnmarshaler, got %s; t=%s; kind=%s`, field, field.Type.String(), t.String(), t.Kind().String())
	}

	pathValue := r.PathValue(key)
	return pathValue, pathValue != "", nil
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

	if field.Type.AssignableTo(reflect.TypeFor[json.RawMessage]()) {
		return json.RawMessage(queryValue[0]), true, nil
	}

	return nil, false, fmt.Errorf(`bad type for field with query struct tag %#v; must be string or *string or []string`, field)
}

func getHeaderValueForField(field reflect.StructField, h http.Header) (any, bool, error) {
	key, ok := field.Tag.Lookup("header")
	if !ok {
		return nil, false, nil
	}

	headerValue, ok := h[key]
	if !ok {
		return nil, false, nil
	}

	switch field.Type.Kind() {
	case reflect.String:
		return headerValue[0], true, nil
	case reflect.Slice:
		if field.Type.Elem().Kind() == reflect.String {
			return headerValue, true, nil
		}
	case reflect.Pointer:
		switch field.Type.Elem().Kind() {
		case reflect.String:
			return headerValue[0], true, nil
		}
	}

	return nil, false, fmt.Errorf(`bad type for field with header struct tag %#v; must be string or *string or []string`, field)
}

func getRequestBasedField(field reflect.StructField, w http.ResponseWriter, r *http.Request, q url.Values) (string, any, bool, error) {
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
		val, ok, err = getHeaderValueForField(field, r.Header)
		if err != nil {
			return "", val, false, err
		}
	}

	if !ok {
		// maybe one of the fields can accept the request Body itself (e.g. if it is io.Reader)!
		bodyValue := reflect.ValueOf(r.Body)
		if bodyValue.Type().AssignableTo(field.Type) {
			return field.Name, r.Body, true, nil
		}
	}

	if !ok {
		// maybe one of the fields can accept the response writer itself (e.g. if it is http.ResponseWriter)!
		responseWriterValue := reflect.ValueOf(w)
		if responseWriterValue.Type().AssignableTo(field.Type) {
			return field.Name, w, true, nil
		}
	}
	if !ok {
		return "", val, false, nil
	}

	jsonTag, jsonTagOK := field.Tag.Lookup("json")
	if !jsonTagOK {
		return field.Name, val, true, nil
	}

	fieldName, _, _ := strings.Cut(jsonTag, ",")
	return fieldName, val, ok, err
}

func populateRequestBasedFields(w http.ResponseWriter, r *http.Request, paramsType reflect.Type, params commands.Fields) error {
	// defer slog.Info("populateRequestBasedFields", "params", params, "paramsType", paramsType, "paramsTypeKind", paramsType.Kind())

	if paramsType.Kind() == reflect.Struct {
		query := r.URL.Query()
		for _, field := range reflect.VisibleFields(paramsType) {
			fieldName, val, ok, err := getRequestBasedField(field, w, r, query)
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
