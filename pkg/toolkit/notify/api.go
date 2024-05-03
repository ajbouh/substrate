package notify

import (
	"context"
	"log/slog"
	"reflect"
)

type Notifier[Event any] interface {
	Notify(ctx context.Context, ev Event)
}

func On[Target any, Event any](f func(ctx context.Context, event Event, target *Target)) *Listener[Target, Event] {
	return &Listener[Target, Event]{f: f}
}

func EventType[Event any]() string {
	return reflect.TypeFor[Event]().String()
}

func Notify[Event any](ctx context.Context, notifiers []Notifier[Event], event Event) {
	eventName := EventType[Event]()
	slog.Debug("notify.Notify()", "eventtype", eventName, "len(notifiers)", len(notifiers))
	for _, n := range notifiers {
		slog.Debug("notify.Notify()", "eventtype", eventName, "notifier", n)
		n.Notify(ctx, event)
	}
}
