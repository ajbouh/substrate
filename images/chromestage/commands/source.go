package commands

import (
	"context"
	"errors"
)

type Fields map[string]any

type FieldDef struct {
	Description string `json:"description,omitempty"`
	Name        string `json:"name"`
	Type        string `json:"type"` // "string", "number", "boolean"
}

type FieldDefs map[string]FieldDef

type Def struct {
	Description string    `json:"description,omitempty"`
	Parameters  FieldDefs `json:"parameters,omitempty"`
	Returns     FieldDefs `json:"returns,omitempty"`
}

type Request struct {
	Command    string `json:"command"`
	Parameters Fields `json:"parameters"`
}

type ResponseError struct {
	Message string `json:"message"`
}

type Response struct {
	Error   *ResponseError `json:"error,omitempty"`
	Returns Fields         `json:"returns,omitempty"`
}

type DefIndex map[string]Def

type RunIndex map[string]RunnerFunc

type RunnerFunc func(ctx context.Context, p Fields) (Fields, error)

func (f Fields) String(k string) string {
	v, ok := f[k]
	if ok {
		return v.(string)
	}
	return ""
}

func (f Fields) Bool(k string) bool {
	v, ok := f[k]
	if ok {
		return v.(bool)
	}
	return false
}

var ErrNoSuchCommand = errors.New("no such command")

type Source interface {
	Reflect(ctx context.Context) (DefIndex, error)
	Run(ctx context.Context, name string, p Fields) (Fields, error)
}
