package commands

import (
	"context"
)

func Dynamic[T Source](defXform DefTransformFunc, runXForm RunTransformFunc, sources func() []T) *DynamicSource[T] {
	return &DynamicSource[T]{
		ReflectTransform: defXform,
		RunTransform:     runXForm,
		Sources:          sources,
	}
}

func List[T Source](sources ...T) *DynamicSource[T] {
	return &DynamicSource[T]{
		Sources: func() []T { return sources },
	}
}

type DynamicReflector struct {
	Reflectors       func() []Reflector
	ReflectTransform DefTransformFunc
}

var _ Reflector = (*DynamicReflector)(nil)

func (c *DynamicReflector) Reflect(ctx context.Context) (DefIndex, error) {
	return Reflect(ctx, c.ReflectTransform, c.Reflectors()...)
}

type DynamicRunner struct {
	Runners      func(ctx context.Context) []Runner
	RunTransform RunTransformFunc
}

var _ Runner = (*DynamicRunner)(nil)

func (c *DynamicRunner) Run(ctx context.Context, name string, p Fields) (Fields, error) {
	return Run(ctx, c.RunTransform, name, p, c.Runners(ctx)...)
}

type DynamicSource[T Source] struct {
	Sources          func() []T
	ReflectTransform DefTransformFunc
	RunTransform     RunTransformFunc
}

var _ Source = (*DynamicSource[Source])(nil)

func (c *DynamicSource[T]) Reflect(ctx context.Context) (DefIndex, error) {
	return Reflect(ctx, c.ReflectTransform, c.Sources()...)
}

func (c *DynamicSource[T]) Run(ctx context.Context, name string, p Fields) (Fields, error) {
	return Run(ctx, c.RunTransform, name, p, c.Sources()...)
}
