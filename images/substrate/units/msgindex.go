package units

import (
	"context"
	"log"

	"cuelang.org/go/cue"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type MsgIndex struct {
	DefSetLoader notify.Loader[*defset.DefSet]

	Env commands.Env
}

func (m *MsgIndex) GetHTTPResourceReflectPath() string {
	return "/substrate/v1/msgindex"
}

func (m *MsgIndex) QueryLinks(ctx context.Context) (links.Links, error) {
	return links.Links{
		"msgindex": links.Link{
			HREF: m.GetHTTPResourceReflectPath(),
			Rel:  "msgindex",
		},
	}, nil
}

var _ commands.Reflector = (*MsgIndex)(nil)

func (m *MsgIndex) Reflect(ctx context.Context) (commands.DefIndex, error) {
	s := commands.Dynamic(nil, nil, func() []commands.Source {
		sources := []commands.Source{}

		if m != nil {
			e := m.DefSetLoader.Load()
			if e == nil {
				return sources
			}

			defsMap := map[string]commands.DefIndex{}
			err := e.DecodeLookupPath(cue.MakePath(cue.Str("commands")), &defsMap)
			if err != nil {
				log.Printf("err on update: %s", e.FmtErr(err))
				return sources
			}

			for k, v := range defsMap {
				sources = append(sources, commands.Prefixed(
					k+"/",
					&commands.CachedSource{
						Defs: v,
						Env:  m.Env,
					},
				))
			}
		}
		return sources
	})

	return s.Reflect(ctx)
}
