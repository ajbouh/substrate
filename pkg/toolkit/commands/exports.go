package commands

import (
	"context"
)

type ExportCommands struct {
	Aggregate *Aggregate
}

func (c *ExportCommands) Exports(ctx context.Context) (any, error) {
	groups := Group(c.Aggregate.GatherReflectorsExcluding(ctx, nil), HTTPResourceReflectPath)

	index, err := (&DynamicReflector{Reflectors: func() []Reflector { return groups[""] }}).Reflect(ctx)
	return map[string]any{
		"commands": index,
	}, err
}
