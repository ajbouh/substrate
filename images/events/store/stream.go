package store

import (
	"context"
	"log/slog"
	"sync"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type Stream struct {
	eventCh chan event.Notification
	mu      *sync.Mutex
	pending *event.ID
	tapCh   chan struct{}
}

func newStream() *Stream {
	return &Stream{
		eventCh: make(chan event.Notification),
		mu:      &sync.Mutex{},
		tapCh:   make(chan struct{}, 1),
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

func (s *Stream) process(ctx context.Context, querier event.Querier, qs event.QuerySet) {
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
		if !initial && pendingUntil.Compare(until) <= 0 {
			slog.Info("Stream.process() skip", "qs", qs, "pendingUntil", pendingUntil, "until", until)
			continue
		}
		until = *pendingUntil

		var maxID event.ID
		var err error

		notification := event.Notification{
			Until:   until,
			Updates: map[string]event.Update{},
		}

		// TODO do queries in parallel
		for k, q := range qs {
			var events []event.Event

			cloned := q.Clone().AndBasisWhere("id",
				&event.WhereCompare{Compare: "<=", Value: until.String()},
			)
			if q.View.StreamShouldAutoAdvanceAfter() {
				cloned.AndBasisWhere("id",
					&event.WhereCompare{Compare: ">", Value: after.String()},
				)
			}

			// ignore more since we shouldn't be using limit here...
			// todo consider modifying queryevents to visit
			events, maxID, _, err = querier.QueryEvents(ctx, cloned)
			if err != nil {
				slog.Info("Stream.process() error ", "q", q, "err", err)
				s.eventCh <- event.Notification{Until: until, Error: err}
				return
			}
			fresh := maxID.Compare(after) > 0

			slog.Info("Stream.process() queried", "q", q, "fresh", fresh, "len(events)", len(events), "maxID", maxID, "after", after)
			// don't send notification unless at least one event is newer than after
			if fresh || initial {
				notification.Updates[k] = event.Update{
					Events:      events,
					Incremental: (!initial) && q.View.StreamShouldAutoAdvanceAfter(),
				}
			}

			if notification.MaxID.Compare(maxID) < 0 {
				notification.MaxID = maxID
			}
		}

		// don't send notification unless at least one event is newer than after
		if initial || len(notification.Updates) > 0 {
			s.eventCh <- notification
			initial = false
		}
		after = until
	}
}
