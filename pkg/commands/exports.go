package commands

import (
	"context"
)

type ExportCommands struct {
	Aggregate *Aggregate
}

func (c *ExportCommands) Exports(ctx context.Context) (map[string]any, error) {
	index, err := c.Aggregate.AsDynamicSource(ctx).Reflect(ctx)

	return map[string]any{
		"commands": index,
	}, err
}
