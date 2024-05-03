package provisioner

import (
	"context"
	"sync"
)

type ListenerFunc func(v any)

type Announcer[T any] struct {
	mu          sync.Mutex
	listenerSet map[struct{}]ListenerFunc
	listeners   []ListenerFunc

	value T

	ctx    context.Context
	cancel func()

	Run func(context.Context)
}

func (s *Announcer[T]) GetAnnounced() T {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.value
}

func (s *Announcer[T]) Announce(v T) {
	s.mu.Lock()
	s.value = v
	listeners := s.listeners
	s.mu.Unlock()

	if listeners == nil {
		return
	}

	for _, cb := range listeners {
		cb(v)
	}
}

func (s *Announcer[T]) unlisten(key struct{}) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.listenerSet == nil {
		return
	}

	delete(s.listenerSet, key)
	s.listeners = make([]ListenerFunc, 0, len(s.listenerSet))
	for _, l := range s.listenerSet {
		s.listeners = append(s.listeners, l)
	}
	if len(s.listeners) == 0 && s.cancel != nil {
		s.cancel()
	}
}

func (s *Announcer[T]) Listen(ctx context.Context, cb ListenerFunc) {
	key := struct{}{}
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.listenerSet == nil {
		s.listenerSet = map[struct{}]ListenerFunc{}
	}

	s.listenerSet[key] = cb
	// copy so we can iterate over them during `update()` without holding the lock.
	s.listeners = append([]ListenerFunc(nil), s.listeners...)
	s.listeners = append(s.listeners, cb)

	if len(s.listeners) == 1 && s.Run != nil {
		var runCtx context.Context
		runCtx, s.cancel = context.WithCancel(s.ctx)
		go s.Run(runCtx)
	}

	go func() {
		<-ctx.Done()
		s.unlisten(key)
	}()
}
