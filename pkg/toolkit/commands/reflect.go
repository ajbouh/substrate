package commands

import (
	"context"
	"errors"
	"fmt"
	"reflect"
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

func typesOf[T any](o ...T) []reflect.Type {
	types := make([]reflect.Type, 0, len(o))
	for _, e := range o {
		types = append(types, reflect.TypeOf(e))
	}
	return types
}

func stringsOf[T any](o ...T) []string {
	s := make([]string, 0, len(o))
	for _, e := range o {
		s = append(s, fmt.Sprint(e))
	}
	return s
}

type CollisionError struct {
	Name    string
	Defs    []Def
	Sources []Reflector
}

var _ error = (*CollisionError)(nil)

func (n *CollisionError) Error() string {
	return fmt.Sprintf("collision for name %q from source reflectors=%v", n.Name, stringsOf(n.Sources))
}

type ReflectError struct {
	Err       error
	Reflector Reflector
}

var _ error = (*ReflectError)(nil)

func (h *ReflectError) Error() string {
	return fmt.Sprintf("Error reflecting %#v: %s", h.Reflector, h.Err.Error())
}

func (h *ReflectError) Unwrap() error {
	return h.Err
}

func appendCollisionError(errs []error, name string, def Def, srcs ...Reflector) []error {
	for _, err := range errs {
		switch e := err.(type) {
		case *CollisionError:
			if e.Name == name {
				e.Defs = append(e.Defs, def)
				e.Sources = append(e.Sources, srcs...)
				return errs
			}
		}
	}

	return append(errs, &CollisionError{
		Name:    name,
		Defs:    []Def{def},
		Sources: append([]Reflector(nil), srcs...),
	})
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
				k, v = xform(k, v)
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
