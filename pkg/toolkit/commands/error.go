package commands

import (
	"errors"
	"fmt"
)

var (
	ErrReflectNotSupported = errors.New("reflect not supported")

	ErrNoSuchCommand    = errors.New("no such command")
	ErrNoImplementation = errors.New("no implementation for command")
)

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
