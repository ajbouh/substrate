package notify

import (
	"context"
	"log/slog"
	"reflect"

	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/xengine"
)

type NotifierUnit[Target any, Event any] struct {
	Target     *Target
	eventtype  string
	targettype string
	f          func(ctx context.Context, ev Event, target *Target)
}

func (s *NotifierUnit[Target, Event]) Assembly() []engine.Unit {
	slog.Debug("NotifierUnit.Assembly()", "eventtype", s.eventtype, "targettype", s.targettype)

	targetType := reflect.TypeFor[Target]()
	s.targettype = targetType.String()
	s.eventtype = EventType[Event]()

	target, units, ok := xengine.AssemblyForPossiblyAnonymousTarget[Target]()
	if ok {
		s.Target = target
	}
	return units
}

func (s *NotifierUnit[Target, Event]) Notify(ctx context.Context, ev Event) {
	slog.Debug("NotifierUnit.Notify()", "eventtype", s.eventtype, "targettype", s.targettype)
	s.f(ctx, ev, s.Target)
}
