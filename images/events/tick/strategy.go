package tick

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type Strategy[Input any, Gathered any, Output any] interface {
	Prepare(ctx context.Context, input Input) (map[string][]*event.Query, error)
	Do(ctx context.Context, input Input, gathered Gathered, until event.ID) (Output, bool, error)
}
