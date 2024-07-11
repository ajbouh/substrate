package cmds

import (
	"bytes"
	"chromestage/commands"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

type ProxySource struct {
	Endpoint string
	Client   *http.Client
}

var _ commands.Source = ProxySource{}

func (p ProxySource) client() *http.Client {
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

func (p ProxySource) Reflect(ctx context.Context) (commands.DefIndex, error) {
	req, err := http.NewRequestWithContext(ctx, "REFLECT", p.Endpoint, nil)
	if err != nil {
		return nil, err
	}
	resp, err := p.client().Do(req)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: %s", resp.Status)
	}
	return unmarshal[commands.DefIndex](resp)
}

func (p ProxySource) Run(ctx context.Context, name string, params commands.Fields) (commands.Fields, error) {
	body, err := json.Marshal(commands.Request{
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
	return unmarshal[commands.Fields](resp)
}

type CheckBeforeRun struct {
	commands.Source
}

func (s CheckBeforeRun) Run(ctx context.Context, name string, params commands.Fields) (commands.Fields, error) {
	index, err := s.Reflect(ctx)
	if err != nil {
		return nil, err
	}
	if _, ok := index[name]; !ok {
		return nil, commands.ErrNoSuchCommand
	}
	return s.Source.Run(ctx, name, params)
}

// Sources commands based on the page currently loaded in the tab
type PrefixedSource struct {
	Prefix string
	Source commands.Source
}

var _ commands.Source = (*PrefixedSource)(nil)

func (s *PrefixedSource) Reflect(ctx context.Context) (commands.DefIndex, error) {
	index, err := s.Source.Reflect(ctx)
	if err != nil {
		return nil, err
	}
	ci := make(commands.DefIndex, len(index))
	for name, def := range index {
		ci[s.Prefix+name] = def
	}
	return ci, nil
}

func (s *PrefixedSource) Run(ctx context.Context, name string, p commands.Fields) (commands.Fields, error) {
	if name, ok := strings.CutPrefix(name, s.Prefix); ok {
		return s.Source.Run(ctx, name, p)
	}
	return nil, commands.ErrNoSuchCommand
}
