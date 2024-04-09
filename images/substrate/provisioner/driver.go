package provisioner

import (
	"context"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
)

type Event interface {
	Error() error
	IsPending() bool
	IsReady() bool
	IsGone() bool
	String() string
}

type Driver interface {
	Spawn(ctx context.Context, req *activityspec.ServiceSpawnResolution) (*activityspec.ServiceSpawnResponse, error)
	Status(ctx context.Context, name string) (Event, error)
	StatusStream(ctx context.Context, name string) (<-chan Event, error)
	Cleanup(ctx context.Context) error
	Kill(ctx context.Context, name string) error
}
