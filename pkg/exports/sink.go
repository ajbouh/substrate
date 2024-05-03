package exports

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
)

type PublishingSink struct {
	URL string

	Sources []Source

	mu sync.Mutex
}

func (m *PublishingSink) Initialize() {
	if m.URL == "" {
		m.URL = os.Getenv("INTERNAL_SUBSTRATE_EXPORTS_URL")
	}
}

func (m *PublishingSink) ExportsChanged() {
	go func() {
		err := m.Publish(context.Background())
		if err != nil {
			log.Printf("error publishing exports after update")
		}
	}()
}

func (m *PublishingSink) Serve(ctx context.Context) {
	err := m.Publish(ctx)
	if err != nil {
		log.Printf("error with initial publish: %#v", err)
	}
}

func (m *PublishingSink) Publish(ctx context.Context) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	log.Printf("publishing exports...")

	exports, err := Union(ctx, m.Sources)
	if err != nil {
		return err
	}

	exportsB, err := json.Marshal(exports)
	if err != nil {
		return fmt.Errorf("could not marshal exports: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "PUT", m.URL, bytes.NewReader(exportsB))
	if err != nil {
		return fmt.Errorf("could not create request for exports: %w", err)
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("exports PUT failed: %w", err)
	}

	if res.StatusCode != http.StatusOK {
		b, err := io.ReadAll(res.Body)
		body := "body=" + string(b)
		if err != nil {
			body = "error reading body: " + err.Error()
		}
		return fmt.Errorf("exports http status != 200; %s", body)
	}

	return nil
}
