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
	sources := append([]Source(nil), s.Sources...)

	for _, s := range s.Delegates {
		sources = append(sources, s.Commands(ctx))
	}

	// gross. filter out "drop" sources...
	drop := map[Source]struct{}{}
	for _, source := range sources {
		if wr, ok := source.(Wrapper); ok {
			drop[wr.WrapsCommandsSource()] = struct{}{}
		}
	}

	keep := make([]Source, 0, len(sources))
	for _, source := range sources {
		if _, ok := drop[source]; !ok {
			keep = append(keep, source)
		}
	}

	return keep

}

func (s *Aggregate) AsSource(ctx context.Context, xform DefTransformFunc) *DynamicSource {
	return &DynamicSource{
		ReflectTransform: xform,
		Sources: func() []Source {
			return s.sources(ctx)
		},
	}
}

func (s *Aggregate) AsReflector(ctx context.Context, xform DefTransformFunc) *DynamicReflector {
	return &DynamicReflector{
		ReflectTransform: xform,
		Reflectors: func() []Reflector {
			sources := s.sources(ctx)
			reflectors := make([]Reflector, 0, len(sources))

			drop := map[Reflector]struct{}{}
			for _, source := range sources {
				reflectors = append(reflectors, source)
				drop[source] = struct{}{}
			}

			for _, reflector := range reflectors {
				if _, ok := drop[reflector]; !ok {
					reflectors = append(reflectors, reflector)
				}
			}

			return reflectors
		},
	}
}

func (s *Aggregate) AsRunner(ctx context.Context) *DynamicRunner {
	return &DynamicRunner{
		Runners: func() []Runner {
			sources := s.sources(ctx)
			runners := make([]Runner, 0, len(sources))

			drop := map[Runner]struct{}{}
			for _, source := range sources {
				runners = append(runners, source)
				drop[source] = struct{}{}
			}

			for _, runner := range runners {
				if _, ok := drop[runner]; !ok {
					runners = append(runners, runner)
				}
			}

			return runners
		},
	}
}
