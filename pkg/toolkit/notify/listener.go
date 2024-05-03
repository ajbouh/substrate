package notify

import (
	"context"
	"log/slog"
	"reflect"

	"tractor.dev/toolkit-go/engine"
)

type Listener[Target any, Event any] struct {
	Target     *Target
	eventtype  string
	targettype string
	f          func(ctx context.Context, ev Event, target *Target)
}

func (s *Listener[Target, Event]) Assembly() []engine.Unit {
	targetType := reflect.TypeFor[Target]()
	pkgPath := targetType.PkgPath()
	isAnonymous := pkgPath == ""
	s.targettype = targetType.String()
	s.eventtype = EventType[Event]()

	defer func() {
		slog.Debug("Listener.Assembly()", "listener", s, "eventtype", s.eventtype, "targettype", s.targettype, "pkgpath", pkgPath, "isanonymous", isAnonymous)
	}()

	// Only recurse into Target if it is anonymous (e.g. struct { ... })
	if isAnonymous {
		s.Target = new(Target)
		return []engine.Unit{s.Target}
	}
	return nil
}

func (s *Listener[Target, Event]) Notify(ctx context.Context, ev Event) {
	slog.Debug("Listener.Notify()", "eventtype", s.eventtype, "targettype", s.targettype)
	s.f(ctx, ev, s.Target)
}
