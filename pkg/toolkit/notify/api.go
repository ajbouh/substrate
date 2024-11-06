package notify

import (
	"context"
	"log/slog"
	"reflect"
)

type Notifier[Event any] interface {
	Notify(ctx context.Context, ev Event)
}

func List[Event any](notifiers ...Notifier[Event]) []Notifier[Event] {
	return notifiers
}

func On[Target any, Event any](f func(ctx context.Context, event Event, target *Target)) *NotifierUnit[Target, Event] {
	slog.Debug("notify.On()", "eventtype", EventType[Event](), "targettype", reflect.TypeFor[Target]().String(), "listenertype", reflect.TypeFor[NotifierUnit[Target, Event]]())
	return &NotifierUnit[Target, Event]{f: f}
}

func EventType[Event any]() string {
	return reflect.TypeFor[Event]().String()
}

func Notify[Event any](ctx context.Context, notifiers []Notifier[Event], event Event) {
	eventName := EventType[Event]()
	slog.Debug("notify.Notify()", "eventtype", eventName, "len(notifiers)", len(notifiers))
	for i, n := range notifiers {
		slog.Debug("notify.Notify()", "eventtype", eventName, "notifierindex", i, "notifiertype", reflect.TypeOf(n).String())
		n.Notify(ctx, event)
	}
}

func Later[Event any](q *Queue, notifiers []Notifier[Event], event Event) {
	q.later(func(ctx context.Context) { Notify(ctx, notifiers, event) })
}

type Queue struct {
	ch chan func(context.Context)

	cancel func()
	ctx    context.Context
}

func NewQueue() *Queue {
	// TODO don't use a buffered channel. use goroutine-safe, unbounded FIFO queue
	return &Queue{
		ch: make(chan func(context.Context), 100),
	}
}

func (q *Queue) Terminate() {
	if q.cancel != nil {
		q.cancel()
	}
}

func (q *Queue) Serve(ctx context.Context) {

	q.ctx, q.cancel = context.WithCancel(ctx)

	// this will cause a panic if someone writes to it
	defer close(q.ch)

	for {
		select {
		case <-q.ctx.Done():
			// return q.ctx.Err()
			return
		case do, ok := <-q.ch:
			if !ok {
				return
			}
			do(q.ctx)
		}
	}

	// todo need to handle funcs sitting in channel
}

func (q *Queue) later(do func(ctx context.Context)) {
	defer slog.Info("Queue.later() done")
	q.ch <- do
}
