package commands

import (
	"context"
	"log/slog"
	"reflect"
)

func CallURL[Out, In any](ctx context.Context, env Env, url, command string, params In) (*Out, error) {
	slog.InfoContext(ctx, "CallURL", "url", url, "command", command, "params", params)
	result, err := env.Apply(nil, Fields{
		"cap":  "reflectedmsg",
		"url":  url,
		"name": command,
		"data": Fields{"parameters": params},
	})
	slog.InfoContext(ctx, "CallURL result", "result", result, "err", err)
	if err != nil {
		return nil, err
	}
	out, _, err := MaybeGetPath[*Out](result, "data", "returns")
	return out, err
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
