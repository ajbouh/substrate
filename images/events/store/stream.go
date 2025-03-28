package store

import (
	"context"
	"log/slog"
	"sync"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type Stream struct {
	eventCh           chan event.Notification
	useAdvancingAfter bool
	mu                *sync.Mutex
	pending           *event.ID
	tapCh             chan struct{}
}

func newStream(useAdvancingAfter bool) *Stream {
	return &Stream{
		eventCh:           make(chan event.Notification),
		mu:                &sync.Mutex{},
		useAdvancingAfter: useAdvancingAfter,
		tapCh:             make(chan struct{}, 1),
	}
}

var _ event.Stream = (*Stream)(nil)

func (s *Stream) Events() <-chan event.Notification {
	return s.eventCh
}

func (s *Stream) tap(until event.ID) {
	tap := func() bool {
		s.mu.Lock()
		defer s.mu.Unlock()

		if s.pending != nil {
			if until.Compare(*s.pending) > 1 {
				s.pending = &until
			}
			return false
		}
		s.pending = &until
		return true
	}()

	if tap {
		s.tapCh <- struct{}{}
	}
}

func (s *Stream) process(ctx context.Context, querier event.Querier, q *event.Query) {
	var after, until event.ID
	initial := true

	for {
		select {
		case <-ctx.Done():
			s.eventCh <- event.Notification{Until: until, Error: ctx.Err()}
			return
		case <-s.tapCh:
		}

		s.mu.Lock()
		pendingUntil := s.pending
		s.pending = nil
		s.mu.Unlock()

		// update cursor if this event is larger
		if pendingUntil.Compare(until) <= 0 {
			slog.Info("Stream.process() skip", "q", q, "pendingUntil", pendingUntil, "until", until)
			continue
		}
		until = *pendingUntil

		cloned := q.Clone().AndWhereEvent("id",
			&event.WhereCompare{Compare: "<=", Value: until},
		)
		if s.useAdvancingAfter {
			cloned.AndWhereEvent("id",
				&event.WhereCompare{Compare: ">", Value: after},
			)
		}

		// ignore more since we shouldn't be using limit here...
		// todo consider modifying queryevents to visit
		events, _, err := querier.QueryEvents(ctx, cloned)
		if err != nil {
			slog.Info("Stream.process() error ", "q", q, "err", err)
			s.eventCh <- event.Notification{Until: until, Error: err}
			return
		}

		fresh := false
		for _, evt := range events {
			if evt.ID.Compare(after) > 0 {
				fresh = true
				break
			}
		}

		slog.Info("Stream.process() queried", "q", q, "fresh", fresh, "len(events)", len(events))
		// don't send notification unless at least one event is newer than after
		if fresh || initial {
			s.eventCh <- event.Notification{Until: until, Events: events, Incremental: (!initial) && s.useAdvancingAfter}
			initial = false
		}
		after = until
	}
}
