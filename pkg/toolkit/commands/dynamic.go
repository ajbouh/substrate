package commands

import (
	"context"
	"errors"
	"log"
)

type Delegate interface {
	Commands(ctx context.Context) Source
}

type Wrapper interface {
	WrapsCommandsSource() Source
}

type Aggregate struct {
	Delegates []Delegate
	Sources   []Source

	Entries []*Entry
}

func (s *Aggregate) AsDynamicSource(ctx context.Context) *DynamicSource {
	sources := append([]Source(nil), s.Sources...)

	for _, s := range s.Delegates {
		sources = append(sources, s.Commands(ctx))
	}

	entries := make([]Entry, 0, len(s.Entries))
	for _, entry := range s.Entries {
		entries = append(entries, *entry)
	}

	if len(entries) > 0 {
		sources = append(sources, &StaticSource[Aggregate]{Entries: entries})
	}

	wrapped := map[Source]struct{}{}
	for _, source := range sources {
		if wr, ok := source.(Wrapper); ok {
			wrapped[wr.WrapsCommandsSource()] = struct{}{}
		}
	}

	src := &DynamicSource{}

	for _, source := range sources {
		if _, ok := wrapped[source]; !ok {
			src.Sources = append(src.Sources, source)
		}
	}

	return src
}

type DynamicSource struct {
	Sources []Source
}

var _ Source = (*DynamicSource)(nil)

func (c *DynamicSource) Reflect(ctx context.Context) (DefIndex, error) {
	ci := DefIndex{}
	for _, src := range c.Sources {
		dci, err := src.Reflect(ctx)
		if errors.Is(err, ErrReflectNotSupported) {
			continue
		}
		if err != nil {
			return nil, err
		}
		for k, v := range dci {
			ci[k] = v
		}
	}

	return ci, nil
}

func (c *DynamicSource) Run(ctx context.Context, name string, p Fields) (Fields, error) {
	for _, src := range c.Sources {
		log.Printf("Dynamic command %s running... parameters:%#v", name, p)
		var err error
		defer log.Printf("Dynamic command %s done. err:%s", name, err)
		result, err := src.Run(ctx, name, p)
		if err == nil || !errors.Is(err, ErrNoSuchCommand) {
			return result, err
		}
	}

	return nil, ErrNoSuchCommand
}
