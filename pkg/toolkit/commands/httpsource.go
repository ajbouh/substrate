package commands

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

type HTTPSource struct {
	Endpoint string
	Client   *http.Client
}

var _ Source = HTTPSource{}

func (p HTTPSource) client() *http.Client {
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
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: %s", resp.Status)
	}
	return unmarshal[DefIndex](resp)
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
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: %s", resp.Status)
	}
	return unmarshal[Fields](resp)
}