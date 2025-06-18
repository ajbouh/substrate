package reactiontest

import (
	"context"
	"io"

	"github.com/ajbouh/substrate/images/events/store/reaction"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type Querier struct {
	MaxID              ID
	QueryEventsFunc    func(ctx context.Context, q *event.Query) ([]event.Event, ID, bool, error)
	QueryEventDataFunc func(ctx context.Context, id ID) (io.ReadSeekCloser, error)
}

func (q *Querier) QueryEventData(ctx context.Context, id ID) (io.ReadSeekCloser, error) {
	if q.QueryEventDataFunc == nil {
		return nil, nil
	}

	return q.QueryEventDataFunc(ctx, id)
}

func (q *Querier) QueryMaxID(ctx context.Context) (ID, error) {
	return q.MaxID, nil
}

func (q *Querier) QueryEvents(ctx context.Context, qr *event.Query) ([]event.Event, ID, bool, error) {
	if q.QueryEventsFunc == nil {
		return nil, q.MaxID, false, nil
	}
	return q.QueryEventsFunc(ctx, qr)
}

var _ reaction.Querier = (*Querier)(nil)
