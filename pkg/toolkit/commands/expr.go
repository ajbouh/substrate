package commands

import (
	"context"
	"errors"
	"fmt"
)

type Interpreter struct {
	Capabilities []Capability
	DefTransform DefTransformFunc

	capabilities map[string]Capability
}

type Capability interface {
	Apply(context.Context, Fields) (*Msg, Fields, error)
	CapabilityName() string
}

func (i *Interpreter) Initialize() {
	i.capabilities = map[string]Capability{}
	for _, applier := range i.Capabilities {
		i.capabilities[applier.CapabilityName()] = applier
	}
}

func (a *Interpreter) RunDef(ctx context.Context, d *Msg, data Fields) (Fields, error) {
	if a.DefTransform != nil {
		_, d = a.DefTransform(ctx, "", d)
	}

	// process incoming parameters according to their associated paths.
	if data == nil {
		data = d.Data
	} else if len(d.Data) > 0 {
		var err error
		data, err = Merge(data, d.Data)
		if err != nil {
			return nil, fmt.Errorf("error merging data: %w", err)
		}
	}

	var postData Fields
	var err error

	if d.Cap != nil {
		capability := a.capabilities[*d.Cap]
		if capability == nil {
			return nil, fmt.Errorf("cannot apply: unknown capability; capability=%s; def=%#v", *d.Cap, *d)
		}

		var via *Msg
		via, postData, err = capability.Apply(ctx, data)
		if err != nil {
			return nil, fmt.Errorf("error applying capability! %s: %w", *d.Cap, err)
		}

		// Do we have something to recurse on? Do it!
		if via != nil {
			postData, err = a.RunDef(ctx, via, postData)
			if err != nil {
				return nil, fmt.Errorf("error running msg returned by cap %s: %w", *d.Cap, err)
			}
		}

		return postData, nil
	} else if d.Msg != nil {
		var preData Fields
		preData, err = d.MsgIn.Pluck(Fields{"data": data})
		if err != nil {
			return nil, fmt.Errorf("error plucking input data: %w", err)
		}
		preData, err = GetPath[Fields](preData, "msg", "data")
		if err != nil {
			return nil, fmt.Errorf("error getting msg data: %w", err)
		}

		postData, err = a.RunDef(ctx, d.Msg, preData)
		if err != nil {
			return nil, fmt.Errorf("error running nested msg: %w", err)
		}

		var out Fields
		out, err = d.MsgOut.Pluck(Fields{"msg": Fields{"data": postData}})
		if err != nil {
			return nil, fmt.Errorf("error plucking output data: %w", err)
		}

		out, err = GetPath[Fields](out, "data")
		if err != nil {
			return nil, fmt.Errorf("error getting output data: %w", err)
		}

		return out, nil
	}

	return nil, nil
}

func (b Bindings) Add(dst DataPointer, src DataPointer) error {
	cur, ok := b[dst]
	if ok {
		return fmt.Errorf("already have a binding for %q (to %q), can't bind it to %q", dst, cur, src)
	}
	b[dst] = src
	return nil
}

func (b Bindings) Pluck(src Fields) (Fields, error) {
	dst := Fields{}

	var errs []error
	for dstPath, srcPath := range b {
		v, err := Get[any](src, srcPath)
		if err != nil {
			errs = append(errs, fmt.Errorf("getting %s (for %s) from %#v: %w", srcPath, dstPath, src, err))
			continue
		}
		if v == nil {
			continue
		}

		err = Set(dst, dstPath, v)
		if err != nil {
			errs = append(errs, fmt.Errorf("setting %s (from %s) to %#v: %w", dstPath, srcPath, dst, err))
			continue
		}
	}

	return dst, errors.Join(errs...)
}
