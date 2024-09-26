package commands

import (
	"fmt"
	"net/http"
	"net/url"
	"reflect"
	"strings"
)

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

func populateRequestBasedFields(w http.ResponseWriter, r *http.Request, paramsType reflect.Type, params Fields) error {
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
