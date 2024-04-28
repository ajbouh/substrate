package commands

import (
	"context"
	"log"
)

type StaticSource struct {
	Entries  []Entry
	defIndex DefIndex
	runIndex RunIndex
}

type Entry struct {
	Name string
	Def
	Run RunnerFunc
}

var _ Source = (*StaticSource)(nil)

func (c *StaticSource) Reflect(ctx context.Context) (DefIndex, error) {
	ci := DefIndex{}
	for name, def := range c.defIndex {
		ci[name] = def
	}

	return ci, nil
}

func (c *StaticSource) Run(ctx context.Context, name string, p Fields) (Fields, error) {
	if cmd, ok := c.runIndex[name]; ok {
		return cmd(ctx, p)
	}

	return Fields{}, ErrNoSuchCommand
}

func (a *StaticSource) Initialize() {
	a.defIndex = DefIndex{}
	a.runIndex = RunIndex{}

	for _, entry := range a.Entries {
		a.defIndex[entry.Name] = entry.Def
		a.runIndex[entry.Name] = entry.Run
	}

	log.Printf("Static source initialize ... %d commands registered", len(a.defIndex))
}
