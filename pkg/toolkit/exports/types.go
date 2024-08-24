package exports

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type Source interface {
	Exports(ctx context.Context) (any, error)
}

type Changed struct{}

type Exports any

const maxMergeDepth = 64

// assumes that src is a tree (no cycles)
func deepMerge(dst, src map[string]any, depth int) map[string]any {
	if depth > maxMergeDepth {
		panic(fmt.Sprintf("way too deep! %#v and %#v", dst, src))
	}
	for key, srcVal := range src {
		if dstVal, ok := dst[key]; ok {
			srcMap, srcMapOk := srcVal.(map[string]any)
			dstMap, dstMapOk := dstVal.(map[string]any)
			if srcMapOk && dstMapOk {
				srcVal = deepMerge(dstMap, srcMap, depth+1)
			}
		}
		dst[key] = srcVal
	}

	return dst
}

// represents value as a recursive tree of map[string]any
func mapifyViaJSON(v any) (map[string]any, error) {
	var b []byte
	var err error
	b, err = json.Marshal(v)
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
