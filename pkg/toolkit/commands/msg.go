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
}

func Cap(cap string, data Fields) *Msg {
	return &Msg{
		Cap:  &cap,
		Data: data,
	}
}

// Msg represents a possible future message send.
type Msg struct {
	// Description provides human (and AI) level documentation about what the command invocation would do
	Description string `json:"description,omitempty"`

	// Cap is a way to specify an "external" place that can resolve the Msg we'll use.
	// If Cap is "reflect", the field "reflect.url" and "reflect.name" will be used to issue an HTTP REFLECT request and discover the proper Msg value.
	Cap *string `json:"cap,omitempty"`

	// Fields used for the invocation
	Data Fields `json:"data,omitempty"`

	Meta Meta `json:"meta,omitempty"`

	// Defines the underlying Msg to use, if Cap is not given.
	Msg *Msg `json:"msg,omitempty"`

	MsgIn  Bindings `json:"msg_in,omitempty"`
	MsgOut Bindings `json:"msg_out,omitempty"`
}

type DefIndex map[string]*Msg

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
