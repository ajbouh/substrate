package httpevents

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"
)

type StreamListenerFunc func(v any)

type StreamListener interface {
	Listen(key any) (context.Context, StreamListenerFunc)
}

type StreamLoader struct {
	value       any
	mu          sync.Mutex
	listenerSet map[struct{}]StreamListenerFunc
	listeners   []StreamListenerFunc

	ctx    context.Context
	cancel func()

	URL string
	Key any

	Listeners []StreamListener
}

func (s *StreamLoader) update(v any) {
	s.mu.Lock()
	s.value = v
	listeners := s.listeners
	s.mu.Unlock()

	for _, cb := range listeners {
		cb(v)
	}
}

func (s *StreamLoader) run(ctx context.Context) {
	time.Sleep(3 * time.Second)

	// TODO we should restart this if it aborts.
	req, err := http.NewRequestWithContext(ctx, "GET", s.URL, nil)
	if err != nil {
		log.Printf("error streaming from %s: %s", s.URL, err)
		return
	}
	log.Printf("making request of %s", s.URL)
	err = ReadStreamEvents(http.DefaultClient, req, func(event *Event) error {
		var m any
		log.Printf("event from %s", s.URL)
		err := json.Unmarshal(event.Data, &m)
		if err != nil {
			return err
		}
		s.update(m)
		// log.Printf("update from %s is %#v", s.URL, m)
		return nil
	})
	if err != nil {
		log.Printf("error streaming from %s: %s", s.URL, err)
		return
	}
}

func (s *StreamLoader) unlisten(key struct{}) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.listenerSet != nil {
		delete(s.listenerSet, key)
	}
	s.listeners = make([]StreamListenerFunc, 0, len(s.listenerSet))
	for _, l := range s.listenerSet {
		s.listeners = append(s.listeners, l)
	}
	if len(s.listeners) == 0 && s.cancel != nil {
		s.cancel()
	}
}

func (s *StreamLoader) Serve(ctx context.Context) {
	s.ctx = ctx

	for _, l := range s.Listeners {
		fnCtx, fn := l.Listen(s.Key)
		if fn == nil {
			continue
		}

		s.Listen(fnCtx, fn)
	}
}

func (s *StreamLoader) Listen(ctx context.Context, cb StreamListenerFunc) {
	key := struct{}{}
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.listenerSet == nil {
		s.listenerSet = map[struct{}]StreamListenerFunc{}
	}
	s.listenerSet[key] = cb
	// copy so we can iterate over them during `update()` without holding the lock.
	s.listeners = append([]StreamListenerFunc(nil), s.listeners...)
	s.listeners = append(s.listeners, cb)

	if len(s.listeners) == 1 {
		var runCtx context.Context
		runCtx, s.cancel = context.WithCancel(s.ctx)
		go s.run(runCtx)
	}

	go func() {
		<-ctx.Done()
		s.unlisten(key)
	}()
}

func (s *StreamLoader) Get() any {
	s.mu.Lock()
	defer s.mu.Unlock()

	return s.value
}
