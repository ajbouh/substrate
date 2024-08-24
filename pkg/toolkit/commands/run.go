package commands

import (
	"context"
	"errors"
	"log/slog"
)

var (
	ErrNoSuchCommand    = errors.New("no such command")
	ErrNoImplementation = errors.New("no implementation for command")
)

type Runner interface {
	Run(ctx context.Context, name string, p Fields) (Fields, error)
}

func Run[R Runner](ctx context.Context, name string, p Fields, runners ...R) (Fields, error) {
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
