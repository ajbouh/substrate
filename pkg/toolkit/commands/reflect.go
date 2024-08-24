package commands

import (
	"context"
	"errors"
)

var (
	ErrReflectNotSupported = errors.New("reflect not supported")
)

type DefTransformFunc func(string, Def) (string, Def)

func DefTransforms(fs ...DefTransformFunc) DefTransformFunc {
	return func(name string, def Def) (string, Def) {
		for _, f := range fs {
			name, def = f(name, def)
		}
		return name, def
	}
}

func TranformDefIndex(di DefIndex, xform DefTransformFunc) DefIndex {
	m := DefIndex{}
	for k, v := range di {
		k, v = xform(k, v)
		m[k] = v
	}
	return m
}

type Reflector interface {
	Reflect(ctx context.Context) (DefIndex, error)
}

func Reflect[R Reflector](ctx context.Context, xform DefTransformFunc, reflectors ...R) (DefIndex, error) {
	ci := DefIndex{}
	for _, src := range reflectors {
		dci, err := src.Reflect(ctx)
		if errors.Is(err, ErrReflectNotSupported) {
			continue
		}
		if err != nil {
			return nil, err
		}
		for k, v := range dci {
			if xform != nil {
				k, v = xform(k, v)
			}
			ci[k] = v
		}
	}

	return ci, nil
}
