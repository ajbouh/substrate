package store

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/puzpuzpuz/xsync/v3"
)

type Streamer struct {
	Querier event.Querier
	streams *xsync.MapOf[*Stream, func(event.ID)]
}

var _ event.Streamer = (*Streamer)(nil)
var _ notify.Notifier[LatestMaxID] = (*Streamer)(nil)

func (es *Streamer) Initialize() {
	es.streams = xsync.NewMapOf[*Stream, func(event.ID)]()
}

func (es *Streamer) Notify(ctx context.Context, ev LatestMaxID) {
	es.notifyStreamsOfNewMaxID(ev.ID())
}

func (es *Streamer) notifyStreamsOfNewMaxID(eventID event.ID) {
	es.streams.Range(func(key *Stream, value func(event.ID)) bool {
		value(eventID)
		return true
	})
}

func (es *Streamer) StreamEvents(ctx context.Context, qs event.QuerySet) (event.Stream, error) {
	until, err := es.Querier.QueryMaxID(ctx)
	if err != nil {
		return nil, err
	}

	stream := newStream(ctx)
	es.streams.Store(stream, stream.tap)

	go stream.process(es.Querier, qs)

	go func() {
		defer es.streams.Delete(stream)
		<-stream.Done()
	}()

	stream.tap(until)

	return stream, nil
}
