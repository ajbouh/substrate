package commands

import (
	"context"
	"strings"
)

func Prefixed[T Source](prefix string, source T) Source {
	return Dynamic(
		func(ctx context.Context, s string, d Fields) (string, Fields) {
			return prefix + s, d
		},
		func(ctx context.Context, s string, f Fields) (string, Fields, bool) {
			name, ok := strings.CutPrefix(s, prefix)
			if !ok {
				return "", nil, false
			}
			return name, f, true
		},
		func() []T { return []T{source} },
	)
}
