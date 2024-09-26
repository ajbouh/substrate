package units

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type EventStreamHandler struct {
	Streamer event.Streamer
}

// TODO this would be better if it were just another command, but commands can't stream back multiple responses yet.

func (h *EventStreamHandler) ContributeHTTP(mux *http.ServeMux) {
	mux.Handle("GET /stream/events", h)
	mux.Handle("POST /stream/events", h)
}

func (h *EventStreamHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	uq := r.URL.Query()

	var q *event.Query

	if r.Method == "GET" {
		var view event.View
		if uq.Has("view") {
			view = event.View(uq.Get("view"))
		}
		q = event.NewQuery(view)

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
			q.AndWhereEvent("id", &event.WhereCompare{Compare: ">", Value: uq.Get("after")})
		}

		if uq.Has("until") {
			q.AndWhereEvent("id", &event.WhereCompare{Compare: "<=", Value: uq.Get("until")})
		}
	} else {
		err := json.NewDecoder(r.Body).Decode(&q)
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
