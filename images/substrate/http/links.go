package substratehttp

import (
	"context"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

var ViewspecLinksCommand = handle.HTTPCommand(
	"links:query", "",
	"GET /substrate/v1/activities/{viewspec}/{digest}/links", "/substrate/v1/activities/{viewspec}/{digest}/links",
	func(ctx context.Context,
		t *struct {
			ProvisionerCache *provisioner.Cache
		},
		args struct {
			Viewspec string `path:"viewspec"`
		},
	) (links.Links, error) {
		views, err := activityspec.ParseServiceSpawnRequest(args.Viewspec, false, "/"+urlPathEscape(args.Viewspec))
		if err != nil {
			return nil, err
		}

		if err != nil {
			return nil, err
		}

		return t.ProvisionerCache.QueryLinks(ctx, views)
	})
