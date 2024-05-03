package httpevents

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
)

type Requester[T any] struct {
	Method string
	URL    string
	Client *http.Client

	ContentType string
	Marshal     func(t T) []byte

	mu sync.Mutex
}

func (m *Requester[T]) Initialize() {
	if m.Client == nil {
		m.Client = http.DefaultClient
	}
}

func (m *Requester[T]) Do(ctx context.Context, t T) error {
	if m.URL == "" {
		return fmt.Errorf("URL not set for %T", m)
	}

	m.mu.Lock()
	defer m.mu.Unlock()

	b := m.Marshal(t)

	req, err := http.NewRequestWithContext(ctx, m.Method, m.URL, bytes.NewReader(b))
	if err != nil {
		return fmt.Errorf("could not create request: %w", err)
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("do failed: %w", err)
	}

	if res.StatusCode != http.StatusOK {
		b, err := io.ReadAll(res.Body)
		body := "body=" + string(b)
		if err != nil {
			body = "error reading body: " + err.Error()
		}
		return fmt.Errorf("http status != 200; %s", body)
	}

	return nil
}

func NewJSONRequester[T any](method, url string) *Requester[T] {
	return &Requester[T]{
		Method:      method,
		URL:         url,
		ContentType: "application/json",
		Marshal: func(t T) []byte {
			var b []byte
			var err error
			b, err = json.Marshal(t)
			if err != nil {
				return []byte(fmt.Sprintf(`{"error": %q}`, err.Error()))
			} else {
				return b
			}
		},
	}
}
