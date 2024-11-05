package service

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
)

type ExportCommands struct {
	Aggregate *commands.Aggregate
}

func (c *ExportCommands) Exports(ctx context.Context) (any, error) {
	groups := commands.Group(c.Aggregate.GatherReflectorsExcluding(ctx, nil), handle.HTTPResourceReflectPath)

	index, err := (&commands.DynamicReflector{Reflectors: func() []commands.Reflector { return groups[""] }}).Reflect(ctx)
	return map[string]any{
		"commands": index,
	}, err
}
