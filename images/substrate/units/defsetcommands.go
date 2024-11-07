package units

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

type DefSetCommands struct {
	DefsMap map[string]commands.DefIndex

	DefRunner commands.DefRunner
}

var _ commands.Delegate = (*DefSetCommands)(nil)

func (m *DefSetCommands) Commands(ctx context.Context) commands.Source {
	return commands.Dynamic(nil, nil, func() []commands.Source {
		sources := []commands.Source{}
		if m != nil {
			for k, v := range m.DefsMap {
				sources = append(sources, commands.Prefixed(
					k+":",
					&commands.CachedSource{
						Defs:      v,
						DefRunner: m.DefRunner,
					},
				))
			}
		}
		return sources
	})
}
