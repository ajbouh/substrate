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
	QueryEvents(ctx context.Context, q *Query) ([]Event, ID, bool, error)
	QueryMaxID(ctx context.Context) (ID, error)
}

type WriteNotifyFunc func(
	i int,
	id ID,
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

func (p *PendingEvent) DataOpener() func() (io.ReadCloser, error) {
	if p.Data == "" {
		return nil
	}
	return func() (rc io.ReadCloser, err error) {
		if p.DataEncoding == "base64" {
			b, err := base64.StdEncoding.DecodeString(p.Data)
			if err != nil {
				return nil, err
			}
			return io.NopCloser(bytes.NewReader(b)), nil
		}
		return io.NopCloser(strings.NewReader(p.Data)), nil
	}
}

type PendingEventSet struct {
	FieldsList            []json.RawMessage
	DataList              []func() (io.ReadCloser, error)
	VectorList            []*VectorInput[float32]
	ConflictFieldKeysList [][]string
}

type PendingEventSetBuilder struct {
	pending *PendingEventSet
}

func NewPendingEventSetBuilder(len int) *PendingEventSetBuilder {
	return &PendingEventSetBuilder{
		pending: &PendingEventSet{
			FieldsList:            make([]json.RawMessage, 0, len),
			DataList:              make([]func() (io.ReadCloser, error), 0, len),
			VectorList:            make([]*VectorInput[float32], 0, len),
			ConflictFieldKeysList: make([][]string, 0, len),
		},
	}
}

func (b *PendingEventSetBuilder) Append(
	f json.RawMessage,
	d func() (io.ReadCloser, error),
	v *VectorInput[float32],
	c []string,
) {
	b.pending.FieldsList = append(b.pending.FieldsList, f)
	// this is a bit of a waste. not all writes will include data. we should lazily allocate this array.
	b.pending.DataList = append(b.pending.DataList, d)
	// this is a bit of a waste. not all writes will include vectors. we should lazily allocate this array.
	b.pending.VectorList = append(b.pending.VectorList, v)
	// this is a bit of a waste. not all writes will include conflict. we should lazily allocate this array.
	b.pending.ConflictFieldKeysList = append(b.pending.ConflictFieldKeysList, c)
}

func (b *PendingEventSetBuilder) Finish() *PendingEventSet {
	set := b.pending
	b.pending = &PendingEventSet{}
	return set
}

func PendingFromEntries(entries []PendingEvent) (*PendingEventSet, error) {
	b := NewPendingEventSetBuilder(len(entries))
	for _, entry := range entries {
		b.Append(entry.Fields, entry.DataOpener(), entry.Vector, entry.ConflictKeys)
	}
	return b.Finish(), nil
}

func (set *PendingEventSet) Len() int {
	return len(set.FieldsList)
}

func (set *PendingEventSet) FieldsAt(i int) json.RawMessage {
	return set.FieldsList[i]
}
func (set *PendingEventSet) SetFieldsAt(i int, fields json.RawMessage) {
	set.FieldsList[i] = fields
}

func (set *PendingEventSet) DataAt(i int) (io.ReadCloser, error) {
	l := len(set.DataList)
	if l == 0 || i >= l {
		return nil, nil
	}

	data := set.DataList[i]
	if data == nil {
		return nil, nil
	}

	return data()
}

func (set *PendingEventSet) VectorAt(i int) *VectorInput[float32] {
	l := len(set.VectorList)
	if l == 0 || i >= l {
		return nil
	}

	return set.VectorList[i]
}

func (set *PendingEventSet) ConflictFieldKeysAt(i int) []string {
	l := len(set.ConflictFieldKeysList)
	if l == 0 || i >= l {
		return nil
	}

	return set.ConflictFieldKeysList[i]
}

type Writer interface {
	WriteEvents(ctx context.Context,
		since ID,
		set *PendingEventSet,
		wn WriteNotifyFunc) error
}

type Streamer interface {
	StreamEvents(ctx context.Context, q QuerySet) (Stream, error)
}

type Update struct {
	Events      []Event `json:"events"`
	Incremental bool    `json:"incremental"`
}

type Notification struct {
	Until ID `json:"until"`
	MaxID ID `json:"max"`

	Updates map[string]Update `json:"updates"`

	Error error `json:"-"`
}

type Stream interface {
	Events() <-chan Notification
}
