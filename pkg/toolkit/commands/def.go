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
	Bind *RunBindDef `json:"bind,omitempty"`
}

type RunBindDef struct {
	Parameters map[string]any `json:"parameters,omitempty"`
	Returns    map[string]any `json:"returns,omitempty"`
}

type RunHTTPDef struct {
	Parameters map[string]RunFieldDef `json:"parameters,omitempty"`
	Returns    map[string]RunFieldDef `json:"returns,omitempty"`
	Request    RunHTTPRequestDef      `json:"request,omitempty"`
}

type RunHTTPRequestDef struct {
	URL     string              `json:"url,omitempty"`
	Method  string              `json:"method,omitempty"`
	Headers map[string][]string `json:"headers,omitempty"`
	Body    any                 `json:"body,omitempty"`
	Query   map[string]string   `json:"query,omitempty"`
}

type RunFieldDef struct {
	Path string `json:"path,omitempty"`
}

type DefIndex map[string]Def

func (c DefIndex) Reflect(ctx context.Context) (DefIndex, error) {
	ci := DefIndex{}
	for name, def := range c {
		ci[name] = def
	}

	return ci, nil
}
