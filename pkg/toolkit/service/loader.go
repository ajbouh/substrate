package service

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

type Loader[T any] interface {
	Load() T
}

type LoaderSource[S commands.Source] struct {
	Loader Loader[S]
}

func (e *LoaderSource[S]) Reflect(ctx context.Context) (commands.DefIndex, error) {
	return e.Loader.Load().Reflect(ctx)
}

func (e *LoaderSource[S]) Run(ctx context.Context, name string, p commands.Fields) (commands.Fields, error) {
	return e.Loader.Load().Run(ctx, name, p)
}

var _ commands.Source = (*LoaderSource[commands.Source])(nil)

type LoaderDelegate[S commands.Delegate] struct {
	Loader Loader[S]
}

func (e *LoaderDelegate[S]) Commands(ctx context.Context) commands.Source {
	return commands.Dynamic(nil, nil, func() []commands.Source {
		return []commands.Source{e.Loader.Load().Commands(ctx)}
	})
}
