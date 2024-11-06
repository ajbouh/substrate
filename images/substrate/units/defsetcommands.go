package units

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
)

type DefSetCommands struct {
	DefsMap map[string]commands.DefIndex

	HTTPClient httpframework.HTTPClient
}

var _ commands.Delegate = (*DefSetCommands)(nil)

func (m *DefSetCommands) Commands(ctx context.Context) commands.Source {
	return commands.Dynamic(nil, nil, func() []commands.Source {
		sources := []commands.Source{}
		if m != nil {
			for k, v := range m.DefsMap {
				sources = append(sources, commands.Prefixed(
					k+":",
					&commands.DefIndexRunner{
						Defs:   v,
						Client: m.HTTPClient,
					},
				))
			}
		}
		return sources
	})
}
