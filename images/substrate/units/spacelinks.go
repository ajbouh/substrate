package units

import (
	"context"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/space"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

type RootSpacesLinkQuerier struct {
	SpaceURLs     space.SpaceURLs
	SpaceQueriers []activityspec.SpaceQuerier
}

var _ links.Querier = (*RootSpacesLinkQuerier)(nil)

func (s *RootSpacesLinkQuerier) QueryLinks(ctx context.Context) (links.Links, error) {
	e := links.Links{}

	for _, lister := range s.SpaceQueriers {
		spaces, err := lister.QuerySpaces(ctx)
		if err != nil {
			return nil, err
		}

		for _, space := range spaces {
			e["space/"+space.SpaceID] = links.Link{
				Rel:  "space",
				HREF: s.SpaceURLs.SpaceURLFunc(space.SpaceID),
				Attributes: map[string]any{
					"space:created_at": space.CreatedAt,
				},
			}
		}
	}

	return e, nil
}
