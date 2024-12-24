package links

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
)

type Aggregate struct {
	Queriers []Querier
}

func (a *Aggregate) AsQuerier() Querier {
	return &DynamicQuerier{
		Queriers: func() []Querier { return a.Queriers },
	}
}

type LinkMatchFunc func(string, Link) bool

func LinkMatchRel(rel string) LinkMatchFunc {
	return func(s string, l Link) bool {
		return l.Rel == rel
	}
}

func LinkMatchName(name string) LinkMatchFunc {
	return func(s string, l Link) bool {
		return s == name
	}
}

type ListReturns struct {
	Links Links `json:"links"`
}

var AggregateQuerierCommand = handle.Command(
	"links:query", "List links",
	func(ctx context.Context, t *struct {
		Aggregate *Aggregate
	}, args struct {
		Rel  string `json:"rel,omitempty"`
		Name string `json:"name,omitempty"`
	}) (ListReturns, error) {
		lister := t.Aggregate.AsQuerier()
		list, err := lister.QueryLinks(ctx)

		var and []LinkMatchFunc
		if args.Rel != "" {
			and = append(and, LinkMatchRel(args.Rel))
		}
		if args.Name != "" {
			and = append(and, LinkMatchName(args.Name))
		}

		if len(and) > 0 {
			keep := func(s string, l Link) bool {
				for _, e := range and {
					if !e(s, l) {
						return false
					}
				}
				return true
			}

			m := Links{}
			for k, v := range list {
				if keep(k, v) {
					m[k] = v
				}
			}
			list = m
		}
		return ListReturns{
			Links: list,
		}, err
	})
