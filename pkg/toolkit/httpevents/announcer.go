package httpevents

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/elnormous/contenttype"
)

// EventStream is a simple http.Handler that announces the latest value for a []byte via text/event-stream. In scenarios
// where there are many new []byte values to announce, it prioritizes sending the latest value byte rather than every
// update.
type EventStream[T any] struct {
	Route string

	ContentType string
	Marshal     func(t T) []byte

	b   []byte
	mu  sync.Mutex
	chs map[chan struct{}]struct{}
}

var _ notify.Notifier[struct{}] = (*EventStream[struct{}])(nil)

func (a *EventStream[T]) Notify(ctx context.Context, ev T) {
	a.Announce(ev)
}

func NewJSONEventStream[T any](route string) *EventStream[T] {
	return &EventStream[T]{
		Route:       route,
		ContentType: "application/json",
		Marshal:     MarshalJSON[T],
	}
}

func MarshalJSON[T any](t T) []byte {
	var b []byte
	var err error
	b, err = json.Marshal(t)
	if err != nil {
		return []byte(fmt.Sprintf(`{"error": %q}`, err.Error()))
	} else {
		return b
	}
}

func (a *EventStream[T]) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	if a.Route != "" {
		mux.Handle(a.Route, a)
	}
}

func (a *EventStream[T]) listen(l chan struct{}) ([]byte, func()) {
	a.mu.Lock()
	defer a.mu.Unlock()
	if a.chs == nil {
		a.chs = map[chan struct{}]struct{}{}
	}
	a.chs[l] = struct{}{}

	return a.b, func() {
		a.mu.Lock()
		defer a.mu.Unlock()
		if a.chs != nil {
			delete(a.chs, l)
		}
	}
}

func (a *EventStream[T]) get() []byte {
	a.mu.Lock()
	defer a.mu.Unlock()

	return a.b
}

func (a *EventStream[T]) Announce(t T) {
	a.AnnounceRaw(a.Marshal(t))
}

func (a *EventStream[T]) AnnounceRaw(b []byte) {
	a.mu.Lock()
	defer a.mu.Unlock()

	// Do nothing if we're about to announce exactly what we already have
	if bytes.Equal(a.b, b) {
		return
	}

	a.b = b

	if a.chs == nil {
		return
	}
	for l := range a.chs {
		select {
		case l <- struct{}{}:
		default:
		}
	}
}

func (a *EventStream[T]) serveEventStream(w http.ResponseWriter, r *http.Request) {
	writeData := func(b []byte) {
		w.Write([]byte("data: "))
		_, err := w.Write(b)
		if err != nil {
			log.Printf("error writing data to http response: %s", err)
		}
		w.Write([]byte("\n\n"))
		w.(http.Flusher).Flush()
	}

	header := w.Header()
	header.Set("Content-Type", "text/event-stream")
	header.Set("Cache-Control", "no-cache")
	header.Set("Connection", "keep-alive")
	header.Set("Access-Control-Allow-Origin", "*")

	ch := make(chan struct{}, 1)
	b, cancel := a.listen(ch)
	defer cancel()
	if b != nil {
		writeData(b)
	}

	for {
		select {
		case <-r.Context().Done():
			return
		default:
			<-ch
			if b := a.get(); b != nil {
				writeData(b)
			}
		}
	}
}

func (a *EventStream[T]) serveBuffer(w http.ResponseWriter, r *http.Request) {
	header := w.Header()
	header.Set("Content-Type", a.ContentType)

	b := a.get()
	w.Write(b)
}

func (a *EventStream[T]) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	availableMediaTypes := []contenttype.MediaType{
		contenttype.NewMediaType("text/event-stream"),
		contenttype.NewMediaType(a.ContentType),
	}
	accepted, _, err := contenttype.GetAcceptableMediaType(r, availableMediaTypes)
	if err != nil {
		w.WriteHeader(http.StatusUnsupportedMediaType)
		w.Write([]byte(fmt.Sprintf(`{"error": %q}`, err)))
		return
	}

	switch accepted.Type + "/" + accepted.Subtype {
	case "text/event-stream":
		a.serveEventStream(w, r)
	default:
		a.serveBuffer(w, r)
	}
}
