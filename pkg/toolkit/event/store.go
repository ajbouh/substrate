package event

import (
	"context"
	"encoding/json"
	"io"
)

type DataQuerier interface {
	QueryEventData(ctx context.Context, id ID) (io.ReadSeekCloser, error)
}

type Querier interface {
	QueryEvents(ctx context.Context, q *Query) ([]Event, bool, error)
	QueryMaxID(ctx context.Context) (ID, error)
}

type Writer interface {
	WriteEvents(ctx context.Context, since ID, fields []json.RawMessage, readClosers []io.ReadCloser) ([]ID, error)
}

type Streamer interface {
	StreamEvents(ctx context.Context, q *Query) (Stream, error)
}

type Notification struct {
	Until  ID      `json:"until"`
	Events []Event `json:"events"`
}

type Stream interface {
	Events() <-chan Notification
}
