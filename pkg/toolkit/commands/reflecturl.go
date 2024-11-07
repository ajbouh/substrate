package commands

import (
	"context"
	"encoding/json"
	"net/http"
)

func unmarshal[T any](r *http.Response) (T, error) {
	defer r.Body.Close()
	var v T
	err := json.NewDecoder(r.Body).Decode(&v)
	return v, err
}

func ReflectURL(ctx context.Context, client HTTPClient, url string) (DefIndex, error) {
	req, err := http.NewRequestWithContext(ctx, "REFLECT", url, nil)
	if err != nil {
		return nil, err
	}

	if client == nil {
		client = http.DefaultClient
	}

	resp, err := client.Do(req)
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
