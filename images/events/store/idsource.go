package store

import (
	"fmt"
	"sync/atomic"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type EventStoreIDSource interface {
	NextEventID() event.ID
}

type DefaultIDSource struct {
}

var _ EventStoreIDSource = (*DefaultIDSource)(nil)

func (*DefaultIDSource) NextEventID() event.ID {
	return event.MakeID()
}

// for testing only!
type IncrementingIDSource struct {
	Counter atomic.Int64
}

var _ EventStoreIDSource = (*IncrementingIDSource)(nil)

func (iid *IncrementingIDSource) NextEventID() event.ID {
	next := iid.Counter.Add(1)
	id, err := event.ParseID(fmt.Sprintf("%026d", next))
	if err != nil {
		panic(err)
	}
	return id
}
