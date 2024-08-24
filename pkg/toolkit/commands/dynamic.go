package commands

import (
	"context"
)

func Dynamic(xform DefTransformFunc, sources func() []Source) *DynamicSource {
	return &DynamicSource{
		ReflectTransform: xform,
		Sources:          sources,
	}
}

func List(sources ...Source) *DynamicSource {
	return &DynamicSource{
		Sources: func() []Source { return sources },
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
	Runners func() []Runner
}

var _ Runner = (*DynamicRunner)(nil)

func (c *DynamicRunner) Run(ctx context.Context, name string, p Fields) (Fields, error) {
	return Run(ctx, name, p, c.Runners()...)
}

type DynamicSource struct {
	Sources          func() []Source
	ReflectTransform DefTransformFunc
}

var _ Source = (*DynamicSource)(nil)

func (c *DynamicSource) Reflect(ctx context.Context) (DefIndex, error) {
	return Reflect(ctx, c.ReflectTransform, c.Sources()...)
}

func (c *DynamicSource) Run(ctx context.Context, name string, p Fields) (Fields, error) {
	return Run(ctx, name, p, c.Sources()...)
}
