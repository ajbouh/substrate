package commands

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

type HTTPSource struct {
	Endpoint string
	Client   HTTPClient
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

var _ Source = HTTPSource{}

func (p HTTPSource) client() HTTPClient {
	if p.Client == nil {
		return http.DefaultClient
	}
	return p.Client
}

func unmarshal[T any](r *http.Response) (T, error) {
	defer r.Body.Close()
	var v T
	err := json.NewDecoder(r.Body).Decode(&v)
	return v, err
}

func (p HTTPSource) Reflect(ctx context.Context) (DefIndex, error) {
	req, err := http.NewRequestWithContext(ctx, "REFLECT", p.Endpoint, nil)
	if err != nil {
		return nil, err
	}
	resp, err := p.client().Do(req)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode == http.StatusMethodNotAllowed {
		return nil, ErrReflectNotSupported
	}
	err = demandHTTPResponseOk(req, resp)
	if err != nil {
		return nil, err
	}

	body, err := unmarshal[struct {
		Commands DefIndex `json:"commands"`
	}](resp)
	if err != nil {
		return nil, err
	}
	return body.Commands, nil
}

func (p HTTPSource) Run(ctx context.Context, name string, params Fields) (Fields, error) {
	body, err := json.Marshal(Request{
		Command:    name,
		Parameters: params,
	})
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, p.Endpoint, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := p.client().Do(req)
	if err != nil {
		return nil, err
	}

	err = demandHTTPResponseOk(req, resp)
	if err != nil {
		return nil, err
	}

	returns, err := unmarshal[Fields](resp)
	if err == nil || errors.Is(err, io.EOF) {
		return returns, nil
	}
	return nil, err
}
