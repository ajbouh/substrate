package exports

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type Source interface {
	Exports(ctx context.Context) (any, error)
}

type Changed struct{}

type Exports any

// assumes that src is a tree (no cycles)
func deepMerge(dst, src map[string]any) map[string]any {
	for key, srcVal := range src {
		if dstVal, ok := dst[key]; ok {
			srcMap, srcMapOk := srcVal.(map[string]any)
			dstMap, dstMapOk := dstVal.(map[string]any)
			if srcMapOk && dstMapOk {
				srcVal = deepMerge(dstMap, srcMap)
			}
		}
		dst[key] = srcVal
	}

	return dst
}

// represents value as a recursive tree of map[string]any
func mapifyViaJSON(v any) (map[string]any, error) {
	b, err := json.Marshal(v)
	if err != nil {
		return nil, err
	}
	var m map[string]any
	err = json.Unmarshal(b, &m)
	if err != nil {
		return nil, err
	}

	return m, nil
}

func Union(ctx context.Context, sources []Source) (Exports, error) {
	// If there's just one, export it as is
	if len(sources) == 1 {
		return sources[0].Exports(ctx)
	}

	// If we have more than one, merge them.
	exports := map[string]any{}
	var errs []error
	for _, s := range sources {
		exp, err := s.Exports(ctx)
		if err != nil {
			errs = append(errs, err)
			continue
		}

		m, err := mapifyViaJSON(exp)
		if err != nil {
			errs = append(errs, err)
			continue
		}

		deepMerge(exports, m)
	}

	return exports, errors.Join(errs...)
}

type Loader[T any] interface {
	Load() T
}

type LoaderSource[S Source] struct {
	Loader         Loader[S]
	ExportsChanged []notify.Notifier[Changed]
}

func (e *LoaderSource[S]) Notify(ctx context.Context, s S) {
	notify.Notify(ctx, e.ExportsChanged, Changed{})
}

func (e *LoaderSource[S]) Exports(ctx context.Context) (any, error) {
	return e.Loader.Load().Exports(ctx)
}

