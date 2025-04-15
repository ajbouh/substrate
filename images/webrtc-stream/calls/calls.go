package calls

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

type CommandCall[In, Out any] struct {
	Env     commands.Env
	URL     string
	Command string
}

func (cr *CommandCall[In, Out]) Call(ctx context.Context, params In) (*Out, error) {
	return commands.CallURL[Out](ctx, cr.Env, cr.URL, cr.Command, params)
}
