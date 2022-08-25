package jamsocket

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

type Logf func(format string, v ...interface{})

type Client struct {
	Client *http.Client
	Logf   Logf
	URL    string
	Token  string
	User   string
}

type SpawnRequest struct {
	Service            string            `json:"-"`
	GracePeriodSeconds *int              `json:"grace_period_seconds,omitempty"`
	Tag                *string           `json:"tag,omitempty"`
	Port               *int              `json:"port,omitempty"`
	Env                map[string]string `json:"env,omitempty"`
	VolumeMounts       []*Mount          `json:"volume_mounts,omitempty"`
	RequireBearerToken bool              `json:"require_bearer_token"`
}

type SpawnResponse struct {
	Name        string  `json:"name"`
	URL         string  `json:"url"`
	ReadyURL    string  `json:"ready_url"`
	StatusURL   string  `json:"status_url"`
	BearerToken *string `json:"bearer_token"`
}

type State string

// The backend has been created, and the image is being fetched
const LoadingState = "Loading"

// The image has been fetched and is running but is not yet listening on a port
const StartingState = "Starting"

// The backend is listening on the expected port
const ReadyState = "Ready"

// The backend was terminated by Jamsocket because all connections were closed for the grace period
const SweptState = "Swept"

// The backend exited on its own with a zero status
const ExitedState = "Exited"

// T failure occurred while loading the image
const ErrorLoadingState = "ErrorLoading"

// T failure occurred while starting the backend
const ErrorStartingState = "ErrorStarting"

// T timeout occurred while waiting for the backend to become Ready
const TimedOutBeforeReadyState = "TimedOutBeforeReady"

// The backend exited on its own with a non-zero status
const FailedState = "Failed"

// The backend was terminated externally
const TerminatedState = "Terminated"

type StatusEvent struct {
	Backend string `json:"backend"`
	State   State  `json:"state"`
	Time    string `json:"time"`
	Error   error  `json:"error,omitempty"`
}

func (c *Client) logf(format string, args ...interface{}) {
	if c.Logf != nil {
		c.Logf(format, args...)
	}
}

// From go stdlib
func singleJoiningSlash(a, b string) string {
	aslash := strings.HasSuffix(a, "/")
	bslash := strings.HasPrefix(b, "/")
	switch {
	case aslash && bslash:
		return a + b[1:]
	case !aslash && !bslash:
		return a + "/" + b
	}
	return a + b
}

func (s State) String() string {
	return string(s)
}

func (s State) IsReady() bool {
	return s == ReadyState
}

func (s State) IsPending() bool {
	switch s {
	case LoadingState, StartingState:
		return true
	}

	return false
}

func (s State) IsGone() bool {
	switch s {
	case SweptState, ExitedState, ErrorLoadingState, ErrorStartingState, TimedOutBeforeReadyState, FailedState, TerminatedState:
		return true
	}

	return false
}

func (c *Client) newRequest(ctx context.Context, method string, path string, body io.Reader) (*http.Request, error) {
	req, err := http.NewRequestWithContext(ctx, method, singleJoiningSlash(c.URL, path), body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.Token)
	return req, nil
}

func (c *Client) Status(ctx context.Context, backendID string) (*StatusEvent, error) {
	req, err := c.newRequest(ctx, "GET", fmt.Sprintf("/backend/%s/status", backendID), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/json")

	res, err := c.Client.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != 200 {
		return nil, fmt.Errorf("non-200 status code=%d", res.StatusCode)
	}

	var event StatusEvent
	err = json.NewDecoder(res.Body).Decode(&event)
	if err != nil {
		return nil, fmt.Errorf("error decoding status: %w", err)
	}

	return &event, nil
}

func (c *Client) StatusStream(ctx context.Context, backendID string) (<-chan *StatusEvent, error) {
	req, err := c.newRequest(ctx, "GET", fmt.Sprintf("/backend/%s/status/stream", backendID), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "text/event-stream")

	res, err := c.Client.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != 200 {
		defer res.Body.Close()
		b, err := io.ReadAll(res.Body)
		return nil, fmt.Errorf("non-200 status code=%d body=%s bodyerr=%s", res.StatusCode, string(b), err)
	}

	ch := make(chan *StatusEvent)

	go func() {
		defer close(ch)
		defer res.Body.Close()

		scanner := bufio.NewScanner(res.Body)
		for scanner.Scan() {
			line := scanner.Text()
			if line == "" {
				continue
			}

			split := strings.SplitN(line, ":", 2)
			eventType := split[0]

			rest := ""
			if len(split) > 1 {
				rest = strings.TrimLeft(split[1], " ")
			}

			if eventType != "data" {
				c.logf("event backend=%s type=%s line=%q", backendID, eventType, line)
				continue
			}

			var event StatusEvent
			err := json.Unmarshal([]byte(rest), &event)
			if err != nil {
				c.logf("event backend=%s rest=%q err=%s", backendID, rest, err)
				ch <- &StatusEvent{Backend: backendID, Error: err}
				break
			}

			// Not in JSON from jamsocket, so add it ourselves.
			c.logf("event backend=%s event=%#v", backendID, event)
			ch <- &event
		}

		if err := scanner.Err(); err != nil {
			c.logf("event backend=%s err=%s", backendID, err)
			ch <- &StatusEvent{Backend: backendID, Error: err}
		}

		c.logf("event backend=%s done", backendID)
	}()

	return ch, nil
}

func (c *Client) Spawn(ctx context.Context, sreq *SpawnRequest) (*SpawnResponse, error) {
	b, err := json.Marshal(sreq)
	if err != nil {
		return nil, err
	}

	body := bytes.NewReader(b)
	req, err := c.newRequest(ctx, "POST", fmt.Sprintf("/user/%s/service/%s/spawn", c.User, sreq.Service), body)
	if err != nil {
		c.logf("spawn service=%s user=%s api=%s err=%d", sreq.Service, c.User, c.URL, err)
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	res, err := c.Client.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode != 200 {
		b, err := io.ReadAll(res.Body)
		if err != nil {
			return nil, err
		}
		c.logf("spawn service=%s user=%s api=%s status=%q statuscode=%d url=%s body=%s", sreq.Service, c.User, c.URL, res.Status, res.StatusCode, req.URL.String(), string(b))
		return nil, fmt.Errorf("non-200 status code=%d", res.StatusCode)
	}

	var sres SpawnResponse
	err = json.NewDecoder(res.Body).Decode(&sres)
	if err != nil {
		return nil, err
	}

	c.logf("spawn service=%s user=%s api=%s status=%q statuscode=%d backend=%s spawnreq=%q", sreq.Service, c.User, c.URL, res.Status, res.StatusCode, sres.Name, string(b))
	return &sres, nil
}
