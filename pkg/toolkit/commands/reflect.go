package commands

import (
	"context"
	"errors"
)

type DefTransformFunc func(context.Context, string, *Msg) (string, *Msg)

func DefTransforms(fs ...DefTransformFunc) DefTransformFunc {
	return func(ctx context.Context, name string, def *Msg) (string, *Msg) {
		for _, f := range fs {
			name, def = f(ctx, name, def)
		}
		return name, def
	}
}

func TranformDefIndex(ctx context.Context, di DefIndex, xform DefTransformFunc) DefIndex {
	m := DefIndex{}
	for k, v := range di {
		k, v = xform(ctx, k, v)
		m[k] = v
	}
	return m
}

type Reflector interface {
	Reflect(ctx context.Context) (DefIndex, error)
}

func Reflect[R Reflector](ctx context.Context, xform DefTransformFunc, reflectors ...R) (DefIndex, error) {
	// slog.Info("Reflector", "reflectors", stringsOf(reflectors...))

	var errs []error
	sources := map[string][]Reflector{}
	conflicts := map[string]struct{}{}

	ci := DefIndex{}
	for _, src := range reflectors {
		// slog.Info("Reflector", "reflector", src)

		dci, err := src.Reflect(ctx)
		if errors.Is(err, ErrReflectNotSupported) {
			continue
		}
		if err != nil {
			errs = append(errs, &ReflectError{
				Err:       err,
				Reflector: src,
			})
			continue
		}
		for k, v := range dci {
			if xform != nil {
				k, v = xform(ctx, k, v)
			}

			// slog.Info("Reflector", "name", k, "command", fmt.Sprint(v))

			if _, ok := ci[k]; ok {
				errs = appendCollisionError(errs, k, v, src)
				conflicts[k] = struct{}{}
			} else {
				ci[k] = v
				sources[k] = append(sources[k], src)
			}
		}
	}

	// remove conflicts before returning
	for k := range conflicts {
		errs = appendCollisionError(errs, k, ci[k], sources[k]...)
		delete(ci, k)
	}

	return ci, errors.Join(errs...)
}
