package exports

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
)

func Union(ctx context.Context, sources []Source) (Exports, error) {
	// slog.Info("exports.Union()", "sources", sources)

	// If there's just one, export it as is
	if len(sources) == 1 {
		return sources[0].Exports(ctx)
	}

	// If we have more than one, merge them.
	exports := map[string]any{}
	var errs []error
	for _, s := range sources {
		exp, err := s.Exports(ctx)
		// slog.Info("exports.Union()", "source", s, "exports", exp, "error", err)
		if err != nil {
			errs = append(errs, err)
			continue
		}

		if exp == nil {
			continue
		}

		m, err := mapifyViaJSON(exp)

		ute := &json.UnmarshalTypeError{}
		if errors.As(err, &ute) {
			slog.Error("exports.Union()", "source", s, "exports", exp, "mapified", m, "error", err,
				"jsonerror.value", ute.Value,
				"jsonerror.type", ute.Type,
				"jsonerror.offset", ute.Offset,
				"jsonerror.struct", ute.Struct,
				"jsonerror.Field", ute.Field,
			)
		} else if err != nil {
			slog.Info("exports.Union()", "source", s, "exports", exp, "mapified", m, "error", err)
		}

		if err != nil {
			errs = append(errs, err)
			continue
		}

		deepMerge(exports, m, 0)
	}

	return exports, errors.Join(errs...)
}
