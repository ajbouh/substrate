package commands

import (
	"errors"
	"fmt"
)

func (b Bindings) Add(dst DataPointer, src DataPointer) error {
	cur, ok := b[dst]
	if ok {
		return fmt.Errorf("already have a binding for %q (to %q), can't bind it to %q", dst, cur, src)
	}
	b[dst] = src
	return nil
}

func (b Bindings) Pluck(src Fields) (Fields, error) {
	return b.PluckInto(Fields{}, src)
}

func (b Bindings) PluckInto(dst, src Fields) (Fields, error) {
	var errs []error
	for dstPath, srcPath := range b {
		v, ok, err := MaybeGet[any](src, srcPath)

		if err != nil {
			errs = append(errs, fmt.Errorf("getting %s (for %s) from %#v: %w", srcPath, dstPath, src, err))
			continue
		}

		if !ok || v == nil {
			continue
		}

		dst, err = Set(dst, dstPath, v)
		if err != nil {
			errs = append(errs, fmt.Errorf("setting %s (from %s) to %#v: %w", dstPath, srcPath, dst, err))
			continue
		}
	}

	err := errors.Join(errs...)
	if err != nil {
		err = fmt.Errorf("error in PluckInto with bindings %v: %w", b, err)
	}
	return dst, err
}
