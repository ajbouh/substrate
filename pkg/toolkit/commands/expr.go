package commands

import (
	"context"
	"fmt"
	"log/slog"
	"reflect"

	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/xengine"
)

type Env interface {
	Context() context.Context
	Apply(Env, Fields) (Fields, error)
	New(ctx context.Context, caps map[string]Cap) Env
}

type env struct {
	parent   *env
	capindex map[string]Cap
	ctx      context.Context
}

func (e *env) Apply(env Env, d Fields) (Fields, error) {
	if env == nil {
		env = e
	}

	var err error

	cap, err := GetPath[string](d, "cap")
	if err != nil {
		return nil, err
	}

	if e.capindex != nil {
		capability := e.capindex[cap]
		if capability != nil {
			post, err := capability.Apply(env, d)
			if err != nil {
				return nil, fmt.Errorf("error applying capability! %s: %w", cap, err)
			}

			return post, nil
		}
	}

	if e.parent != nil {
		return e.parent.Apply(env, d)
	}

	return nil, fmt.Errorf("cannot apply: unknown capability; capability=%s; def=%#v", cap, d)
}

func (e *env) Context() context.Context {
	if e == nil {
		return nil
	}
	return e.ctx
}

func (e *env) New(ctx context.Context, caps map[string]Cap) Env {
	if ctx == nil && e != nil {
		ctx = e.ctx
	}

	e2 := &env{
		parent:   e,
		capindex: caps,
		ctx:      ctx,
	}

	return e2
}

var _ Env = (*env)(nil)

type Cap interface {
	Apply(Env, Fields) (Fields, error)
}

type RootEnv[C any] struct {
	Capabilities *C
	DefTransform DefTransformFunc

	env Env
}

func (i *RootEnv[C]) Initialize() {
	slog.Info("RootEnv.Initialize", "caps", i.Capabilities)
	caps := map[string]Cap{}
	xengine.FieldsImplementing(i.Capabilities, func(name string, tag reflect.StructTag, cap Cap) {
		if capName, ok := tag.Lookup("cap"); ok {
			name = capName
		}
		caps[name] = cap
		slog.Info("registering cap", "name", name, "cap", cap)
	})
	i.env = (*env)(nil).New(context.Background(), caps)
}

func MergeAndApply(env Env, d Fields, fields Fields) (Fields, error) {
	// process incoming parameters according to their associated paths.
	if len(fields) > 0 {
		var err error
		d, err := d.Clone()
		if err != nil {
			return nil, err
		}

		err = d.Merge(fields)
		if err != nil {
			return nil, fmt.Errorf("error merging data: %w", err)
		}
	}

	return env.Apply(env, d)
}

func (s *RootEnv[C]) Assembly() []engine.Unit {
	target, units, ok := xengine.AssemblyForPossiblyAnonymousTarget[C]()
	if ok {
		s.Capabilities = target
	}
	return units
}

func (a *RootEnv[C]) Apply(env Env, d Fields) (Fields, error) {
	d, err := d.Clone()
	if err != nil {
		return nil, err
	}

	if a.DefTransform != nil {
		_, d = a.DefTransform(env.Context(), "", d)
	}

	return a.env.Apply(env, d)
}

var _ Env = (*RootEnv[any])(nil)

func (i *RootEnv[C]) Context() context.Context {
	return i.env.Context()
}

func (i *RootEnv[C]) New(ctx context.Context, caps map[string]Cap) Env {
	return i.env.New(ctx, caps)
}
