package exports

import (
	"context"
	"errors"
)

type Source interface {
	Exports(ctx context.Context) (map[string]any, error)
}

type Changed interface {
	ExportsChanged()
}

func NotifyChanged(changed []Changed) {
	for _, o := range changed {
		o.ExportsChanged()
	}
}

func Union(ctx context.Context, sources []Source) (map[string]any, error) {
	exports := map[string]any{}
	var errs []error
	for _, s := range sources {
		exp, err := s.Exports(ctx)
		if err != nil {
			errs = append(errs, err)
			continue
		}
		for k, v := range exp {
			exports[k] = v
		}
	}

	var err error
	if len(errs) > 0 {
		err = errors.Join(errs...)
	}

	return exports, err
}
