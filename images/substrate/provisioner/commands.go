package provisioner

import (
	"context"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

type NewReturns struct {
	Location string `json:"location"`
}

var NewCommand = commands.Command(
	"new:instance",
	"Spawn a new instance of the given service and parameters. Return the location of the new service.",
	func(ctx context.Context,
		t *struct {
			HTTPClient commands.HTTPClient
		},
		args struct {
			Service    string            `json:"service"`
			Parameters map[string]string `json:"parameters"`
		},
	) (NewReturns, error) {
		nr := NewReturns{}
		sreq := activityspec.NewSpawnRequest(args.Service, args.Parameters)
		nr.Location = sreq.URLPrefix + "/"

		src := commands.HTTPSource{
			Endpoint: nr.Location,
			Client:   t.HTTPClient,
		}
		_, err := src.Reflect(ctx)
		if err != nil {
			return nr, err
		}

		return nr, nil
	},
)
