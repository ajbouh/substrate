package commands

import (
	"context"
	"strings"
)

type Meta map[DataPointer]Metadata

type Bindings map[DataPointer]DataPointer // map[dst]src

type Metadata struct {
	Description string `json:"description,omitempty"`
	Type        string `json:"type,omitempty"`
	Required    bool   `json:"required,omitempty"`
}

type DefIndex map[string]Fields

func (c DefIndex) String() string {
	keys := make([]string, 0, len(c))
	for k := range c {
		keys = append(keys, k)
	}
	return "DefIndex[" + strings.Join(keys, ",") + "]"
}

func (c DefIndex) Reflect(ctx context.Context) (DefIndex, error) {
	ci := DefIndex{}
	for name, def := range c {
		ci[name] = def
	}

	return ci, nil
}
