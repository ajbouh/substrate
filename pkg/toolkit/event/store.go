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

type WriteNotifyFunc func(
	i int,
	id ID,
	fieldsSize int, fieldsSha256 []byte,
	dataSize int64, dataSha256 []byte,
)

type Writer interface {
	WriteEvents(ctx context.Context,
		since ID,
		fieldsList []json.RawMessage,
		dataList []io.ReadCloser,
		vectorList []*VectorInput[float32],
		conflictFieldKeysList [][]string, // TODO a list of fields to produce a conflict and return the original ID for
		wn WriteNotifyFunc) error
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
