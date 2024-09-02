package links

import "context"

func Prefixed[T Querier](prefix string, source T) *PrefixedQuerier[T] {
	return &PrefixedQuerier[T]{
		Prefix:  prefix,
		Querier: source,
	}
}

type PrefixedQuerier[T Querier] struct {
	Prefix  string
	Querier T
}

var _ Querier = (*PrefixedQuerier[Querier])(nil)

func (s *PrefixedQuerier[T]) QueryLinks(ctx context.Context) (Links, error) {
	return Merge(ctx, func(k string, v Link) (string, Link) { return s.Prefix + k, v }, s.Querier)
}
