package tracks

import (
	"reflect"
	"sync"
)

type EventEmitter struct {
	m sync.Map
}

func (ee *EventEmitter) Listen(n Handler) {
	ee.m.Store(reflect.ValueOf(n), n)
}

func (ee *EventEmitter) Unlisten(n Handler) {
	ee.m.Delete(reflect.ValueOf(n))
}

func (ee *EventEmitter) Emit(e Event) {
	ee.m.Range(func(k, v any) bool {
		if h, ok := v.(Handler); ok {
			go h.HandleEvent(e)
		}
		return true
	})
}

type HandlerFunc func(e Event)

func (f HandlerFunc) HandleEvent(e Event) { f(e) }
