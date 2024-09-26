package httpevents

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"

	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type Subscription[RequestBody, EventType any] struct {
	RequestURL    string
	RequestMethod string
	RequestBody   *RequestBody
	Client        HTTPClient

	Marshal   func(*RequestBody) (io.Reader, error)
	Unmarshal func(*Event) (*EventType, error)

	Notifiers []notify.Notifier[EventType]
}

func (s *Subscription[RequestBody, EventType]) Initialize() {
	if s.Client == nil {
		s.Client = http.DefaultClient
	}
}

func (s *Subscription[RequestBody, EventType]) Serve(ctx context.Context) {
	err := s.process(ctx)

	// TODO should reconnect if disconnected
	// TODO don't actually panic on a failure.
	if err != nil {
		panic(fmt.Sprintf("subscription failed: %s", err.Error()))
	}
}

func (s *Subscription[RequestBody, EventType]) process(ctx context.Context) error {
	var requestBody io.Reader

	requestBody, err := s.Marshal(s.RequestBody)
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, s.RequestMethod, s.RequestURL, requestBody)
	if err != nil {
		return err
	}

	slog.Info("Subscription", "method", s.RequestMethod, "url", s.RequestURL)
	return ReadStreamEvents(s.Client, req, func(httpevt *Event) error {
		n, err := s.Unmarshal(httpevt)
		if err != nil {
			return err
		}

		notify.Notify(ctx, s.Notifiers, *n)
		return nil
	})
}

func NewJSONSubscription[RequestBody, EventType any](method, url string, body *RequestBody, notifiers ...notify.Notifier[EventType]) *Subscription[RequestBody, EventType] {
	// If no notifiers are given, then set slice to nil so engine.Run can populate it later.
	if len(notifiers) == 0 {
		notifiers = nil
	}

	return &Subscription[RequestBody, EventType]{
		RequestURL:    url,
		RequestMethod: method,
		RequestBody:   body,
		Notifiers:     notifiers,

		Marshal: func(rb *RequestBody) (io.Reader, error) {
			if rb == nil {
				return nil, nil
			}
			b, err := json.Marshal(rb)
			if err != nil {
				return nil, err
			}

			return bytes.NewReader(b), nil
		},
		Unmarshal: func(httpevt *Event) (*EventType, error) {
			var n EventType
			return &n, json.Unmarshal(httpevt.Data, &n)
		},
	}
}
