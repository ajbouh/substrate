package commands

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
)

type CommandTailCall struct {
	Def *Def
}

func (c *CommandTailCall) Error() string {
	return fmt.Sprintf("command tail call: %#v", c.Def)
}

var _ error = (*CommandTailCall)(nil)

type Runner interface {
	Run(ctx context.Context, name string, p Fields) (Fields, error)
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
