package commands

import (
	"context"
)

type ExportCommands struct {
	Aggregate *Aggregate
}

func (c *ExportCommands) Exports(ctx context.Context) (any, error) {
	index, err := c.Aggregate.AsSource(ctx, nil).Reflect(ctx)

	return map[string]any{
		"commands": index,
	}, err
}
