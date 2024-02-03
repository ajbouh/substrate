package asr

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/ajbouh/substrate/images/bridge/pkg/router"
)

type Client struct {
	url string
}

func NewClient(url string) (*Client, error) {
	if url == "" {
		return nil, fmt.Errorf("invalid url for Client %s", url)
	}
	return &Client{
		url: url,
	}, nil
}

func (s *Client) Transcribe(request *router.TranscriptionRequest) (*router.TranscriptionResponse, error) {
	payloadBytes, err := json.Marshal(request)
	if err != nil {
		return nil, err
	}

	// Send POST request to the API
	resp, err := http.Post(s.url, "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// Check the response status code
	if resp.StatusCode == http.StatusCreated || resp.StatusCode == http.StatusOK {
		response := router.TranscriptionResponse{}
		err = json.Unmarshal(body, &response)
		return &response, err
	} else {
		return nil, fmt.Errorf("error: %s", body)
	}
}
