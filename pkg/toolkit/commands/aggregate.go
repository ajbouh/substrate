package commands

import (
	"context"
)

type Aggregate struct {
	Delegates []Delegate

	Sources []Source

	Reflectors []Reflector
	Runners    []Runner
}

func (s *Aggregate) sources(ctx context.Context) []Source {
	sources := make([]Source, 0, len(s.Sources)+len(s.Delegates))
	sources = append(sources, s.Sources...)

	// slog.Info("Aggregate.sources", "sources", sources)

	for _, s := range s.Delegates {
		// slog.Info("Aggregate.sources", "delegate", s, "delegatetype", reflect.TypeOf(s).String())
		sources = append(sources, s.Commands(ctx))
	}

	// slog.Info("Aggregate.sources", "sources", sources)

	// gross. filter out "drop" sources...
	drop := map[Source]struct{}{}
	for _, source := range sources {
		if wr, ok := source.(Wrapper); ok {
			wraps := wr.WrapsCommandsSource()
			if wraps != nil {
				drop[wraps] = struct{}{}
			}
		}
	}

	keep := make([]Source, 0, len(sources))
	for _, source := range sources {
		if _, ok := drop[source]; !ok {
			// slog.Info("Aggregate.sources appending", "source", source)
			keep = append(keep, source)
		}
		// avoid duplicates
		drop[source] = struct{}{}
	}

	return keep
}

func (s *Aggregate) AsSource(ctx context.Context, xform DefTransformFunc) *DynamicSource[Source] {
	return &DynamicSource[Source]{
		ReflectTransform: xform,
		Sources: func() []Source {
			return s.sources(ctx)
		},
	}
}

func (s *Aggregate) GatherReflectorsExcluding(ctx context.Context, excluding []Reflector) []Reflector {
	// slog.Info("Aggregate.GatherReflectorsExcluding", "excluding", excluding)

	sources := s.sources(ctx)
	// slog.Info("Aggregate.GatherReflectorsExcluding", "excluding", excluding, "sources", sources)
	reflectors := make([]Reflector, 0, len(sources)+len(s.Reflectors))

	drop := map[Reflector]struct{}{}
	for _, source := range sources {
		reflectors = append(reflectors, source)
		drop[source] = struct{}{}
	}

	for _, source := range s.Sources {
		drop[source] = struct{}{}
	}

	for _, source := range excluding {
		drop[source] = struct{}{}
	}

	for _, reflector := range s.Reflectors {
		if _, ok := drop[reflector]; !ok {
			// slog.Info("Aggregate.AsReflector keeping", "reflector", reflector)
			reflectors = append(reflectors, reflector)
		}
		// avoid duplicates
		drop[reflector] = struct{}{}
	}

	// slog.Info("Aggregate.GatherReflectorsExcluding", "excluding", excluding, "sources", sources, "reflectors", reflectors)

	return reflectors
}

func (s *Aggregate) GatherRunners(ctx context.Context) []Runner {
	sources := s.sources(ctx)
	runners := make([]Runner, 0, len(sources)+len(s.Runners))

	drop := map[Runner]struct{}{}
	for _, source := range sources {
		runners = append(runners, source)
		drop[source] = struct{}{}
	}

	for _, source := range s.Sources {
		drop[source] = struct{}{}
	}

	for _, runner := range s.Runners {
		if _, ok := drop[runner]; !ok {
			// slog.Info("Aggregate.AsRunner keeping", "runner", runner)
			runners = append(runners, runner)
			// } else {
			// 	slog.Info("Aggregate.AsRunner skipping", "runner", runner)
		}
		// avoid duplicates
		drop[runner] = struct{}{}
	}

	return runners
}

func Group[T any](list []T, keyFunc func(t T) string) map[string][]T {
	m := map[string][]T{}

	for _, t := range list {
		key := keyFunc(t)
		m[key] = append(m[key], t)
	}

	return m
}
