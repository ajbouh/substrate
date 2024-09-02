package links

import "context"

type Loader[T any] interface {
	Load() T
}

type LoaderQuerier[S Querier] struct {
	Loader Loader[S]
}

func (e *LoaderQuerier[S]) QueryLinks(ctx context.Context) (Links, error) {
	return e.Loader.Load().QueryLinks(ctx)
}

var _ Querier = (*LoaderQuerier[Querier])(nil)
