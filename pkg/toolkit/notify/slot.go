package notify

import (
	"context"
	"sync/atomic"
)

type Loader[T any] interface {
	Load() T
}

type Storer[T any] interface {
	Store(T)
}

var _ Loader[*string] = (*Slot[string])(nil)
var _ Storer[*string] = (*Slot[string])(nil)

type StoreLoader[T any] interface {
	Storer[T]
	Loader[T]
}

type Slot[T any] struct {
	Notifiers []Notifier[*T]

	pointer atomic.Pointer[T]
	readyCh <-chan struct{}
	ready   func()
}

func (s *Slot[T]) Initialize() {
	var ctx context.Context
	ctx, s.ready = context.WithCancel(context.Background())
	s.readyCh = ctx.Done()
}

func (s *Slot[T]) Load() *T {
	<-s.readyCh
	return s.pointer.Load()
}

func (s *Slot[T]) Peek() *T {
	return s.pointer.Load()
}

func (s *Slot[T]) CompareAndSwap(old, new *T) bool {
	return s.CompareAndSwapWithContext(context.Background(), old, new)
}

func (s *Slot[T]) CompareAndSwapWithContext(ctx context.Context, old, new *T) bool {
	if s.pointer.CompareAndSwap(old, new) {
		s.ready()
		Notify(ctx, s.Notifiers, new)
		return true
	}

	return false
}

func (s *Slot[T]) Store(t *T) {
	s.StoreWithContext(context.Background(), t)
}

func (s *Slot[T]) StoreWithContext(ctx context.Context, t *T) {
	s.pointer.Store(t)
	s.ready()
	Notify(ctx, s.Notifiers, t)
}
