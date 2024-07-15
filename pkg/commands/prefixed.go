package commands

import (
	"context"
	"strings"
)

type PrefixedSource struct {
	Prefix string
	Source Source
}

var _ Source = (*PrefixedSource)(nil)

func (s *PrefixedSource) Reflect(ctx context.Context) (DefIndex, error) {
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

func (s *PrefixedSource) Run(ctx context.Context, name string, p Fields) (Fields, error) {
	if name, ok := strings.CutPrefix(name, s.Prefix); ok {
		return s.Source.Run(ctx, name, p)
	}
	return nil, ErrNoSuchCommand
}
