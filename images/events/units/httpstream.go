package units

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"
	"net/url"
	"strconv"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type EventStreamHandler struct {
	Streamer event.Streamer
}

// TODO this would be better if it were just another command, but commands can't stream back multiple responses yet.

func (h *EventStreamHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.Handle("GET /stream/events", h)
	mux.Handle("POST /stream/events", h)
}

func eventQueryFromURLQuery(uq url.Values) (*event.Query, error) {
	var view event.View
	if uq.Has("view") {
		view = event.View(uq.Get("view"))
	}

	q := event.NewQuery(view)

	if uq.Has("path") {
		q.AndWhereEvent("path", &event.WhereCompare{Compare: "=", Value: uq.Get("path")})
	}

	if uq.Has("path_prefix") {
		q.AndWhereEvent("path", &event.WherePrefix{Prefix: uq.Get("path_prefix")})
	}

	if uq.Has("type") {
		q.AndWhereEvent("type", &event.WhereCompare{Compare: "=", Value: uq.Get("type")})
	}

	if uq.Has("after") {
		after, err := event.ParseID(uq.Get("after"))
		if err != nil {
			return nil, err
		}

		q.AndWhereEvent("id", &event.WhereCompare{Compare: ">", Value: after})
	}

	if uq.Has("until") {
		until, err := event.ParseID(uq.Get("until"))
		if err != nil {
			return nil, err
		}

		q.AndWhereEvent("id", &event.WhereCompare{Compare: "<=", Value: until})
	}

	return q, nil
}

func (h *EventStreamHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var q *event.Query
	var err error

	// TODO if this is present, and it is greater than after, then use it.
	// r.Header.Get("Last-Event-ID")

	if r.Method == "GET" {
		q, err = eventQueryFromURLQuery(r.URL.Query())
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
	} else {
		err = json.NewDecoder(r.Body).Decode(&q)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		r.Body.Close()
	}

	header := w.Header()
	header.Set("Content-Type", "text/event-stream")
	header.Set("Cache-Control", "no-store")
	header.Set("Connection", "keep-alive")

	// at this time we only write the event fields as data. we don't yet include "since" or "data".
	writeEvents := func(n event.Notification) error {
		slog.Info("EventStreamHandler.ServeHTTP writeEvents()", "until", n.Until, "err", n.Error)

		if n.Error != nil {
			for _, b := range [][]byte{
				[]byte("id: "),
				[]byte(n.Until.String()),
				[]byte("\nevent: streamerror"),
				[]byte("\ndata: "),
				[]byte(strconv.Quote(n.Error.Error())),
				[]byte("\n\n"),
			} {
				_, err := w.Write(b)
				if err != nil {
					return err
				}
				w.(http.Flusher).Flush()
			}
			return n.Error
		}

		data, err := json.Marshal(n)
		if err != nil {
			return err
		}
		for _, b := range [][]byte{
			[]byte("id: "),
			[]byte(n.Until.String()),
			[]byte("\ndata: "),
			data,
			[]byte("\n\n"),
		} {
			_, err := w.Write(b)
			if err != nil {
				return err
			}
			w.(http.Flusher).Flush()
		}
		return nil
	}

	stream, err := h.Streamer.StreamEvents(r.Context(), q)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for {
		select {
		case n, ok := <-stream.Events():
			if !ok {
				return
			}
			err := writeEvents(n)
			if err != nil {
				slog.Error("error writing event", "err", err)
				return
			}
		}
	}
}
