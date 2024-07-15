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

func NewStaticSource(entries []Entry) *StaticSource {
	a := &StaticSource{
		defIndex: DefIndex{},
		runIndex: RunIndex{},
	}

	for _, entry := range entries {
		a.defIndex[entry.Name] = entry.Def
		a.runIndex[entry.Name] = entry.Run
	}

	log.Printf("Static source initialize ... %d commands registered", len(a.defIndex))
	return a
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
		log.Printf("Static command %s running... parameters:%#v", name, p)
		var err error
		defer log.Printf("Static command %s done; err:%s", name, err)
		f, err := cmd(ctx, p)
		return f, err
	}

	return Fields{}, ErrNoSuchCommand
}
