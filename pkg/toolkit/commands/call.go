package commands

import (
	"context"
	"encoding/json"
	"reflect"
)

func convertViaJSON[Out, In any](input In) (Out, error) {
	var out Out
	if !HasJSONFields(reflect.TypeFor[In](), false) || !HasJSONFields(reflect.TypeFor[Out](), false) {
		return out, nil
	}
	b, err := json.Marshal(input)
	if err != nil {
		return out, err
	}
	err = json.Unmarshal(b, &out)
	return out, err
}

func CallURL[Out, In any](ctx context.Context, hrr URLReflector, url string, command string, params In) (*Out, error) {
	runner, _, err := hrr.ReflectURL(ctx, url)
	if err != nil {
		return nil, err
	}

	return CallSource[Out, In](ctx, runner, command, params)
}

func CallSource[Out, In any](ctx context.Context, src Source, command string, params In) (*Out, error) {
	paramFields, err := convertViaJSON[Fields](params)
	if err != nil {
		return nil, err
	}
	resultFields, err := src.Run(ctx, command, paramFields)
	if err != nil {
		return nil, err
	}
	out, err := convertViaJSON[Out](resultFields)
	if err != nil {
		return nil, err
	}
	return &out, nil
}

func HasJSONFields(t reflect.Type, considerRequestFieldShadowing bool) bool {
	// slog.Info("treatAsVoid", "t", t, "t.Kind()", t.Kind())
	if t == nil || t.Kind() != reflect.Struct {
		return true
	}

	fields := reflect.VisibleFields(t)

	for _, field := range fields {
		// slog.Info("treatAsVoid", "field", field)

		if considerRequestFieldShadowing {
			if _, ok := field.Tag.Lookup("path"); ok {
				continue
			}

			if _, ok := field.Tag.Lookup("query"); ok {
				continue
			}
		}

		if tag, ok := field.Tag.Lookup("json"); !ok || tag == "-" {
			continue
		}

		return true
	}

	return false
}
