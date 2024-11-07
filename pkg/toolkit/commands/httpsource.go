package commands

import (
	"context"
)

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

type URLReflector interface {
	ReflectURL(ctx context.Context, url string) (Source, DefIndex, error)
}

type URLBasedSource struct {
	URLReflector URLReflector

	URL string
}

var _ Source = (*URLBasedSource)(nil)

func (h *URLBasedSource) Reflect(ctx context.Context) (DefIndex, error) {
	_, di, err := h.URLReflector.ReflectURL(ctx, h.URL)
	return di, err
}

func (h *URLBasedSource) Run(ctx context.Context, name string, p Fields) (Fields, error) {
	runner, _, err := h.URLReflector.ReflectURL(ctx, h.URL)
	if err != nil {
		return nil, err
	}

	return runner.Run(ctx, name, p)
}

func RunURL(ctx context.Context, hrr URLReflector, url, name string, p Fields) (Fields, error) {
	runner, _, err := hrr.ReflectURL(ctx, url)
	if err != nil {
		return nil, err
	}

	return runner.Run(ctx, name, p)
}
