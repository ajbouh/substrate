package event

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"io"
	"strings"
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

type PendingEvent struct {
	Fields json.RawMessage `json:"fields"`

	// since this is JSON, expect either raw string or base64-encoded string
	Data string `json:"data"`

	// if this is "base64", decode data that way
	DataEncoding string `json:"encoding"`

	Vector *VectorInput[float32] `json:"vector"`

	ConflictKeys []string `json:"conflict_keys"`
}

type PendingEventSet struct {
	FieldsList            []json.RawMessage
	DataList              []io.ReadCloser
	VectorList            []*VectorInput[float32]
	ConflictFieldKeysList [][]string
}

func PendingFromEntries(entries []PendingEvent) (*PendingEventSet, error) {
	fieldses := make([]json.RawMessage, 0, len(entries))
	readers := make([]io.ReadCloser, 0, len(entries))
	vectors := make([]*VectorInput[float32], 0, len(entries))
	conflict := make([][]string, 0, len(entries))

	for _, entry := range entries {
		fieldses = append(fieldses, entry.Fields)
		var reader io.ReadCloser
		if entry.Data != "" {
			if entry.DataEncoding == "base64" {
				b, err := base64.RawStdEncoding.DecodeString(entry.Data)
				if err != nil {
					return nil, err
				}
				reader = io.NopCloser(bytes.NewReader(b))
			} else {
				reader = io.NopCloser(strings.NewReader(entry.Data))
			}
		}
		// this is a bit of a waste. not all writes will include data. we should lazily allocate this array.
		readers = append(readers, reader)

		// this is a bit of a waste. not all writes will include vectors. we should lazily allocate this array.
		vectors = append(vectors, entry.Vector)

		// this is a bit of a waste. not all writes will include conflict. we should lazily allocate this array.
		conflict = append(conflict, entry.ConflictKeys)
	}

	return &PendingEventSet{
		FieldsList:            fieldses,
		DataList:              readers,
		VectorList:            vectors,
		ConflictFieldKeysList: conflict,
	}, nil
}

type Writer interface {
	WriteEvents(ctx context.Context,
		since ID,
		set *PendingEventSet,
		wn WriteNotifyFunc) error
}

type Streamer interface {
	StreamEvents(ctx context.Context, q *Query) (Stream, error)
}

type Notification struct {
	Until  ID      `json:"until"`
	Events []Event `json:"events"`
	Error  error   `json:"-"`
}

type Stream interface {
	Events() <-chan Notification
}
