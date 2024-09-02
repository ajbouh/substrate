package links

import (
	"context"
)

type Querier interface {
	QueryLinks(ctx context.Context) (Links, error)
}

type TransformFunc func(string, Link) (string, Link)

func Merge[R Querier](ctx context.Context, xform TransformFunc, links ...R) (Links, error) {
	idx := Links{}
	for _, src := range links {
		dci, err := src.QueryLinks(ctx)
		if err != nil {
			return nil, err
		}
		for k, v := range dci {
			if xform != nil {
				k, v = xform(k, v)
			}
			idx[k] = v
		}
	}

	return idx, nil
}
