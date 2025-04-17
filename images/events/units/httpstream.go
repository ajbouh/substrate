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
	Querier  event.Querier
}

// TODO this would be better if it were just another command, but commands can't stream back multiple responses yet.

func (h *EventStreamHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.Handle("GET /stream/events", h)
	mux.Handle("POST /stream/events", h)
}

func eventQueryFromURLQuery(uq url.Values) (*event.Query, error) {
	q := event.NewQuery("")

	var err error

	if uq.Has("queryjson") {
		err = json.Unmarshal([]byte(uq.Get("queryjson")), &q)
		if err != nil {
			return q, err
		}
	}

	if uq.Has("view") {
		q.View = event.View(uq.Get("view"))
	}

	if uq.Has("path") {
		q.AndBasisWhere("path", &event.WhereCompare{Compare: "=", Value: uq.Get("path")})
	}

	if uq.Has("path_prefix") {
		q.AndBasisWhere("path", event.WherePrefix(uq.Get("path_prefix")))
	}

	if uq.Has("type") {
		q.AndBasisWhere("type", &event.WhereCompare{Compare: "=", Value: uq.Get("type")})
	}

	if uq.Has("after") {
		after, err := event.ParseID(uq.Get("after"))
		if err != nil {
			return nil, err
		}

		q.AndBasisWhere("id", &event.WhereCompare{Compare: ">", Value: after.String()})
	}

	if uq.Has("until") {
		until, err := event.ParseID(uq.Get("until"))
		if err != nil {
			return nil, err
		}

		q.AndBasisWhere("id", &event.WhereCompare{Compare: "<=", Value: until.String()})
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

	if r.Header.Get("Accept") != "text/event-stream" && !r.URL.Query().Has("stream") {
		events, _, _, err := h.Querier.QueryEvents(r.Context(), q)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		header := w.Header()
		header.Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(events)
		return
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
