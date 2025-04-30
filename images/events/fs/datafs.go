package eventfs

import (
	"context"
	"io/fs"
	"os"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type EventDataReadFS struct {
	Querier     event.Querier
	DataQuerier event.DataQuerier
}

var _ fs.FS = (*EventDataReadFS)(nil)

func (e *EventDataReadFS) Open(name string) (fs.File, error) {
	ctx := context.Background()

	id, err := event.ParseID(name)
	if err != nil {
		return nil, err
	}

	query := event.QueryByID(id)

	event, _, err := event.QueryEvent(ctx, e.Querier, query)
	if err != nil {
		return nil, err
	}

	if event == nil {
		return nil, os.ErrNotExist
	}

	rsc, err := e.DataQuerier.QueryEventData(ctx, event.ID)
	if err != nil {
		return nil, err
	}

	return &roDataFile{
		event: event,
		rsc:   rsc,
		name:  id.String(),
	}, nil
}
