package commands

import (
	"context"
	"strings"
)

type PrefixedSource[T Source] struct {
	Prefix string
	Source T
}

var _ Source = (*PrefixedSource[Source])(nil)

func (s *PrefixedSource[T]) WrapsCommandsSource() Source {
	return s.Source
}

func (s *PrefixedSource[T]) Reflect(ctx context.Context) (DefIndex, error) {
	index, err := s.Source.Reflect(ctx)
	if err != nil {
		return nil, err
	}
	ci := make(DefIndex, len(index))
	for name, def := range index {
		ci[s.Prefix+name] = def
	}
	return ci, nil
}

func (s *PrefixedSource[T]) Run(ctx context.Context, name string, p Fields) (Fields, error) {
	if name, ok := strings.CutPrefix(name, s.Prefix); ok {
		return s.Source.Run(ctx, name, p)
	}
	return nil, ErrNoSuchCommand
}
