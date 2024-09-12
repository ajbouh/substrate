package commands

import (
	"context"
	"fmt"
	"strings"
)

func Prefixed[T Source](prefix string, source T) *PrefixedSource[T] {
	return &PrefixedSource[T]{
		Prefix: prefix,
		Source: source,
	}
}

type PrefixedSource[T Source] struct {
	Prefix string
	Source T
}

var _ Source = (*PrefixedSource[Source])(nil)

func (s *PrefixedSource[T]) String() string {
	return "*PrefixedSource[" + s.Prefix + " " + fmt.Sprintf("%v", s.Source) + "]"
}

func (s *PrefixedSource[T]) WrapsCommandsSource() Source {
	return s.Source
}

func (s *PrefixedSource[T]) Reflect(ctx context.Context) (DefIndex, error) {
	return Reflect(ctx, func(ctx context.Context, k string, v Def) (string, Def) { return s.Prefix + k, v }, s.Source)
}

func (s *PrefixedSource[T]) Run(ctx context.Context, name string, p Fields) (Fields, error) {
	if name, ok := strings.CutPrefix(name, s.Prefix); ok {
		return s.Source.Run(ctx, name, p)
	}
	return nil, ErrNoSuchCommand
}
