package commands

import "context"

type Loader[T any] interface {
	Load() T
}

type LoaderSource[S Source] struct {
	Loader Loader[S]
}

func (e *LoaderSource[S]) Reflect(ctx context.Context) (DefIndex, error) {
	return e.Loader.Load().Reflect(ctx)
}

func (e *LoaderSource[S]) Run(ctx context.Context, name string, p Fields) (Fields, error) {
	return e.Loader.Load().Run(ctx, name, p)
}

var _ Source = (*LoaderSource[Source])(nil)

type LoaderDelegate[S Delegate] struct {
	Loader Loader[S]
}

func (e *LoaderDelegate[S]) Commands(ctx context.Context) Source {
	return Dynamic(nil, func() []Source {
		return []Source{e.Loader.Load().Commands(ctx)}
	})
}
