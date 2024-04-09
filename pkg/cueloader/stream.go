package cueloader

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"
)

type StreamListenerFunc func(v any)

type StreamLoader struct {
	value       any
	mu          *sync.Mutex
	listenerSet map[struct{}]StreamListenerFunc
	listeners   []StreamListenerFunc

	ctx    context.Context
	cancel func()
	url    string
}

func NewStreamLoader(ctx context.Context, url string) *StreamLoader {
	return &StreamLoader{
		url:         url,
		mu:          &sync.Mutex{},
		listenerSet: map[struct{}]StreamListenerFunc{},
		ctx:         ctx,
	}
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
	req, err := http.NewRequestWithContext(ctx, "GET", s.url, nil)
	if err != nil {
		log.Printf("error streaming from %s: %s", s.url, err)
		return
	}
	log.Printf("making request of %s", s.url)
	err = ReadStreamEvents(http.DefaultClient, req, func(event *Event) error {
		var m any
		log.Printf("event from %s", s.url)
		err := json.Unmarshal(event.Data, &m)
		if err != nil {
			return err
		}
		s.update(m)
		// log.Printf("update from %s is %#v", s.url, m)
		return nil
	})
	if err != nil {
		log.Printf("error streaming from %s: %s", s.url, err)
		return
	}
}

func (s *StreamLoader) unlisten(key struct{}) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.listenerSet, key)
	s.listeners = make([]StreamListenerFunc, 0, len(s.listenerSet))
	for _, l := range s.listenerSet {
		s.listeners = append(s.listeners, l)
	}
	if len(s.listeners) == 0 && s.cancel != nil {
		s.cancel()
	}
}

func (s *StreamLoader) Listen(ctx context.Context, cb StreamListenerFunc) {
	key := struct{}{}
	s.mu.Lock()
	defer s.mu.Unlock()
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
