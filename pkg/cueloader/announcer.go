package cueloader

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/elnormous/contenttype"
)

// Announcer is a simple http.Handler that announces the latest value for a []byte via text/event-stream. In scenarios
// where there are many new []byte values to announce, it prioritizes sending the latest value byte rather than every
// update.
type Announcer struct {
	b  []byte
	mu *sync.Mutex
	contentType string
	chs map[chan struct{}]struct{}
}

func NewAnnouncer(contentType string) *Announcer {
	return &Announcer{
		chs: map[chan struct{}]struct{}{},
		mu:  &sync.Mutex{},
		contentType: contentType,
	}
}

func (a *Announcer) listen(l chan struct{}) ([]byte, func()) {
	a.mu.Lock()
	defer a.mu.Unlock()
	a.chs[l] = struct{}{}

	return a.b, func() {
		a.mu.Lock()
		defer a.mu.Unlock()
		delete(a.chs, l)
	}
}

func (a *Announcer) get() []byte {
	a.mu.Lock()
	defer a.mu.Unlock()

	return a.b
}

func (a *Announcer) Announce(b []byte) {
	a.mu.Lock()
	defer a.mu.Unlock()

	a.b = b

	for l := range a.chs {
		select {
		case l <- struct{}{}:
		default:
		}
	}
}

func (a *Announcer) serveEventStream(w http.ResponseWriter, r *http.Request) {
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

func (a *Announcer) serveBuffer(w http.ResponseWriter, r *http.Request) {
	header := w.Header()
	header.Set("Content-Type", a.contentType)

	b := a.get()
	w.Write(b)
}

func (a *Announcer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	availableMediaTypes := []contenttype.MediaType{
		contenttype.NewMediaType("text/event-stream"),
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
