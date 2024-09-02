package links

import "context"

type DynamicQuerier struct {
	Queriers func() []Querier
}

func (d *DynamicQuerier) QueryLinks(ctx context.Context) (Links, error) {
	return Merge(ctx, nil, d.Queriers()...)
}

var _ Querier = (*DynamicQuerier)(nil)
