package chat

import (
	"net/http"
)

const (
	defaultEmptyMessagesLimit uint = 300
)

// ClientConfig is a configuration of a client.
type ClientConfig struct {
	BaseURL    string
	HTTPClient *http.Client

	EmptyMessagesLimit uint
}

func DefaultConfig(baseURL string) ClientConfig {
	return ClientConfig{
		BaseURL: baseURL,

		HTTPClient: &http.Client{},

		EmptyMessagesLimit: defaultEmptyMessagesLimit,
	}
}

func (ClientConfig) String() string {
	return "<API ClientConfig>"
}
