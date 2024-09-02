package links

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

type Aggregate struct {
	Queriers []Querier
}

func (a *Aggregate) AsQuerier() Querier {
	return &DynamicQuerier{
		Queriers: func() []Querier { return a.Queriers },
	}
}

type AggregateQuerierCommand struct {
	Aggregate *Aggregate
}

var _ commands.Delegate = (*AggregateQuerierCommand)(nil)

type ListReturns struct {
	Links Links `json:"links"`
}

func (c *AggregateQuerierCommand) Commands(ctx context.Context) commands.Source {
	lister := c.Aggregate.AsQuerier()
	return commands.Command(
		"links:query",
		"List links",
		func(ctx context.Context, t *struct{}, void struct{}) (ListReturns, error) {
			list, err := lister.QueryLinks(ctx)
			return ListReturns{
				Links: list,
			}, err
		})
}
