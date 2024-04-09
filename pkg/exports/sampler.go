package exports

import (
	"context"
	"encoding/json"
	"sync"
	"time"
)

type Sampler[T any] struct {
	SampleFunc func() (T, error)
	Interval   time.Duration

	ExportsChanged []Changed

	value T
	err   error
	mu    sync.Mutex
}

func (s *Sampler[T]) Exports(ctx context.Context) (map[string]any, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.err != nil {
		return nil, s.err
	}

	b, err := json.Marshal(s.value)
	if err != nil {
		return nil, err
	}

	v := map[string]any{}
	err = json.Unmarshal(b, &v)
	if err != nil {
		return nil, err
	}

	return v, nil
}

func (s *Sampler[T]) sample() {
	value, err := s.SampleFunc()
	s.mu.Lock()
	s.err = err
	s.value = value
	s.mu.Unlock()

	NotifyChanged(s.ExportsChanged)
}

func (s *Sampler[T]) Serve(ctx context.Context) {
	tick := time.NewTicker(s.Interval)
	defer tick.Stop()

	s.sample()

	for {
		select {
		case <-ctx.Done():
			return
		case <-tick.C:
			s.sample()
		}
	}
}
