package commands

import (
	"context"
)

type Def struct {
	Description string    `json:"description,omitempty"`
	Parameters  FieldDefs `json:"parameters,omitempty"`
	Returns     FieldDefs `json:"returns,omitempty"`

	Run *RunDef `json:"run,omitempty"`
}

type RunDef struct {
	HTTP *RunHTTPDef `json:"http,omitempty"`
}

type DefIndex map[string]Def

func (c DefIndex) Reflect(ctx context.Context) (DefIndex, error) {
	ci := DefIndex{}
	for name, def := range c {
		ci[name] = def
	}

	return ci, nil
}
