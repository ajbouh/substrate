package notify

import (
	"context"
	"time"
)

type Tick[T any] time.Time

type Ticker[T any] struct {
	Interval  time.Duration
	Notifiers []Notifier[Tick[T]]
}

func (s *Ticker[T]) Serve(ctx context.Context) {
	tick := time.NewTicker(s.Interval)
	defer tick.Stop()

	Notify(ctx, s.Notifiers, Tick[T](time.Now()))

	for {
		select {
		case <-ctx.Done():
			return
		case t := <-tick.C:
			Notify(ctx, s.Notifiers, Tick[T](t))
		}
	}
}
