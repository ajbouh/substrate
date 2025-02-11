package commands

import (
	"context"
	"errors"
	"log/slog"
)

type Runner interface {
	Run(ctx context.Context, name string, p Fields) (Fields, error)
}

type TransformingDefRunner struct {
	Client       HTTPClient
	Env          Env
	DefTransform DefTransformFunc
}

var _ URLReflector = (*TransformingDefRunner)(nil)

func (p *TransformingDefRunner) ReflectURL(ctx context.Context, url string) (Source, DefIndex, error) {
	di, err := ReflectURL(ctx, p.Client, url)
	if err != nil {
		return nil, nil, err
	}

	if p.DefTransform != nil {
		di = TranformDefIndex(ctx, di, p.DefTransform)
	}

	slog.Info("ReflectURL", "url", url, "di", di)

	return &CachedSource{
		Defs: di,
		Env:  p.Env,
	}, di, nil
}

type URLEndpointReflector struct {
	HTTPClient HTTPClient
	URL        string
}

var _ Reflector = (*URLEndpointReflector)(nil)

func (u *URLEndpointReflector) Reflect(ctx context.Context) (DefIndex, error) {
	return ReflectURL(ctx, u.HTTPClient, u.URL)
}

type RunTransformFunc func(context.Context, string, Fields) (string, Fields, bool)

func Run[R Runner](ctx context.Context, xform RunTransformFunc, name string, p Fields, runners ...R) (Fields, error) {
	if xform != nil {
		var ok bool
		name, p, ok = xform(ctx, name, p)
		if !ok {
			return nil, ErrNoSuchCommand
		}
	}

	slog.Info("command run()", "command", name, "parameters", p, "runners", runners)
	for _, src := range runners {
		slog.Info("command run()", "runner", src, "command", name, "parameters", p)
		var err error
		result, err := src.Run(ctx, name, p)
		slog.Info("command run() done", "command", name, "parameters", p, "returns", result, "err", err)
		if err == nil || !errors.Is(err, ErrNoSuchCommand) {
			return result, err
		}
	}

	return nil, ErrNoSuchCommand
}
