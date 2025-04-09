package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"path"
	"strconv"
	"strings"

	"github.com/ajbouh/substrate/images/webrtc-events/calls"
	"github.com/ajbouh/substrate/images/webrtc-events/ui"
	"github.com/ajbouh/substrate/images/webrtc-events/webrtc/js"
	"github.com/ajbouh/substrate/images/webrtc-events/webrtc/local"
	"github.com/ajbouh/substrate/images/webrtc-events/webrtc/sfu"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
	"github.com/gorilla/websocket"
	"github.com/pion/rtp"
	"github.com/pion/webrtc/v3"
	"github.com/pion/webrtc/v3/pkg/media/oggwriter"
)

func main() {
	port := parsePort(getEnv("PORT", "8080"))

	basePath := os.Getenv("SUBSTRATE_URL_PREFIX")
	// ensure the path starts and ends with a slash for setting <base href>
	baseHref := must(url.JoinPath("/", basePath, "/"))
	slog.Info("bridge starting", "baseHref", baseHref, "SUBSTRATE_URL_PREFIX", basePath)

	// eventURLPrefix := mustGetenv("SUBSTRATE_EVENT_WRITER_URL")
	pathPrefix := mustGetenv("BRIDGE_EVENT_PATH_PREFIX")
	// queryParams := url.Values{}
	// queryParams.Set("path_prefix", pathPrefix)

	// TODO do need a "session" to register with?
	// TODO write a "track" when we get a connection

	engine.Run(
		&service.Service{},
		sfu.NewSession(),
		&PeerComponent{
			SFUURL:          fmt.Sprintf("ws://localhost:%d%s/sfu", port, basePath), // FIX: hardcoded host
			EventPathPrefix: pathPrefix,
		},
		&SFURoute{},
		httpframework.Route{
			Route:   "GET /webrtc/",
			Handler: http.StripPrefix("/webrtc", http.FileServer(http.FS(js.Dir))),
		},
		httpframework.Route{
			Route:   "GET /ui/",
			Handler: http.StripPrefix("/ui", http.FileServer(http.FS(ui.Dir))),
		},
		httpframework.Route{
			Route:   "GET /",
			Handler: httpframework.ServeFileReplacingBasePathHandler(ui.Dir, baseHref, "session.html"),
		},
		// httpevents.NewJSONRequester[vad.ActivityEvent]("PUT", eventURLPrefix+"/voice-activity"),
		&EventWriteCommand{
			URL:     mustGetenv("SUBSTRATE_EVENT_COMMANDS_URL"),
			Command: "events:write",
		},
		&QueryEventsCommand{
			URL:     mustGetenv("SUBSTRATE_EVENT_COMMANDS_URL"),
			Command: "events:query",
		},
		&Streamer{
			EventsURL: mustGetenv("SUBSTRATE_EVENT_COMMANDS_URL"),
		},
		RequestBodyLogger{},
	)
}

type WriteEventsInput struct {
	Events []event.PendingEvent `json:"events"`
}

type WriteEventsReturns struct {
	IDs []event.ID `json:"ids"`

	FieldsSHA256s []*event.SHA256Digest `json:"fields_sha256s"`
	DataSHA256s   []*event.SHA256Digest `json:"data_sha256s"`
}

type EventWriteCommand = calls.CommandCall[WriteEventsInput, WriteEventsReturns]

type RequestBodyLogger struct {
	Log *slog.Logger
}

func (l *RequestBodyLogger) WrapHTTP(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, fmt.Sprintf("error reading body: %s", err), http.StatusInternalServerError)
			return
		}
		r.Body = io.NopCloser(bytes.NewReader(body))
		l.Log.Info("request", "method", r.Method, "url", r.URL.String(), "body", string(body))
		next.ServeHTTP(w, r)
	})
}

func mustGetenv(name string) string {
	value := os.Getenv(name)
	if value == "" {
		log.Fatalf("%s not set", name)
	}
	return value
}

type PeerComponent struct {
	SFUURL          string
	EventPathPrefix string
	WriteEvents     *EventWriteCommand

	peer *local.Peer
}

type PathEvent struct {
	Path string `json:"path"`
}

func pathJoin(a, b string) string {
	a = strings.TrimRight(a, "/")
	b = strings.TrimLeft(b, "/")
	return a + "/" + b
}

func MakePendingEvent[E any](event E) (r event.PendingEvent, err error) {
	pe, err := json.Marshal(event)
	if err != nil {
		return
	}
	r.Fields = pe
	return
}

func ToPendingEvents[E any](events ...E) ([]event.PendingEvent, error) {
	var pes []event.PendingEvent
	for _, e := range events {
		pe, err := json.Marshal(e)
		if err != nil {
			return nil, err
		}
		pes = append(pes, event.PendingEvent{Fields: pe})
	}
	return pes, nil
}

func (pc *PeerComponent) Serve(ctx context.Context) {
	var err error
	pc.peer, err = local.NewPeer(pc.SFUURL)
	fatal(err)

	pc.peer.OnTrack(func(track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
		slog.InfoContext(ctx, "got track", "id", track.ID(), "kind", track.Kind())
		if kind := track.Kind(); kind != webrtc.RTPCodecTypeAudio {
			slog.InfoContext(ctx, "not an audio track", "kind", kind)
			return
		}

		eventFields := Track{
			Path:     pathJoin(pc.EventPathPrefix, "/tracks"),
			WebRTCID: track.ID(),
			Kind:     track.Kind().String(),
			Encoding: AudioEncoding{
				MimeType:   track.Codec().MimeType,
				SampleRate: track.Codec().ClockRate,
				Channels:   track.Codec().Channels,
			},
		}

		r, err := pc.WriteEvents.Call(ctx, WriteEventsInput{
			Events: must(ToPendingEvents(eventFields)),
		})
		if err != nil {
			slog.ErrorContext(ctx, "error recording track event", "err", err)
			return
		}
		slog.InfoContext(ctx, "recorded track event", "r", r)
		trackID := r.IDs[0]
		slog.InfoContext(ctx, "recording to trackID", "trackID", trackID)

		// i did some research and i think we should just write the opus packets directly. the simplest thing to do would be write up to N packets in each record
		// fields in each record being:
		// ts array of timestamps for each packet in record
		// ix array of packet stream indexes for each packet in record
		// sz array of sizes for each packet in record data
		// for record type i'm thinking audio/opus
		// we also need to store the header, which is 19 bytes
		// we can do it with each packet, but it seems like we might be better off doing it once for each stream
		// for the header we need channel count, sample rate, version number, and preskip value. but i think it's easier just to include the raw header bytes
		// we can then add an endpoint somewhere that will stream an ogg file for a given stream query and offset

		// when we're combining RTP packets, can we jump around to different timestamps?
		// maybe just need to adjust the offset for each segment so that they are
		// incrementing?

		audioPath := path.Join("/tracks", trackID.String(), "audio")

		var timestamps []uint32
		var offsets []int
		var sizes []int
		var buffer [4 << 10]byte
		offset := 0
		// should this path have timestamp or something to be unique
		// could override id to be "path"
		flush := func() error {
			slog.InfoContext(ctx, "flushing buffer", "written", offset)
			pe := must(MakePendingEvent(AudioChunk{
				Path:       pathJoin(pc.EventPathPrefix, audioPath),
				Timestamps: timestamps,
				Offsets:    offsets,
				Sizes:      sizes,
				Encoding:   eventFields.Encoding,
				Track:      trackID,
			}))
			pe.DataEncoding = "base64"
			pe.Data = base64.StdEncoding.EncodeToString(buffer[:offset])
			r, err := pc.WriteEvents.Call(ctx, WriteEventsInput{
				Events: []event.PendingEvent{pe},
			})
			if err != nil {
				return err
			}
			slog.InfoContext(ctx, "recorded track audio", "r", r)
			offset = 0
			timestamps = timestamps[:0]
			offsets = offsets[:0]
			sizes = sizes[:0]
			return nil
		}

		// min = 0 max = 10
		// (0, 10)

		for {
			pkt, _, err := track.ReadRTP()
			if err != nil {
				if errors.Is(err, io.EOF) {
					slog.InfoContext(ctx, "got EOF")
					fatal(flush())
					return
				}
				if errors.Is(err, io.ErrShortBuffer) || err.Error() == "buffer too small" {
					slog.InfoContext(ctx, "got short buffer")
					continue
				}
				slog.ErrorContext(ctx, "error reading RTP", "err", err)
				return
			}
			if pkt == nil {
				slog.InfoContext(ctx, "got nil packet")
				continue
			}
			expectedSize := pkt.MarshalSize()
			endOffset := offset + expectedSize
			if endOffset > len(buffer) {
				fatal(flush())
				endOffset = offset + expectedSize
			}
			n, err := pkt.MarshalTo(buffer[offset:endOffset])
			if n != expectedSize {
				slog.ErrorContext(ctx, "error marshalling RTP to buffer", "n", n, "expectedSize", expectedSize)
				return
			}
			timestamps = append(timestamps, pkt.Timestamp)
			offsets = append(offsets, offset)
			sizes = append(sizes, expectedSize)
			offset = endOffset
			if err != nil {
				slog.ErrorContext(ctx, "error marshaling RTP to buffer", "err", err)
				break
			}
		}
	})

	pc.peer.HandleSignals()
}

type AudioChunk struct {
	Path       string        `json:"path"`
	Timestamps []uint32      `json:"ts"`
	Offsets    []int         `json:"ix"`
	Sizes      []int         `json:"sz"`
	Encoding   AudioEncoding `json:"encoding"`
	Track      event.ID      `json:"track"`
}

type Track struct {
	Path     string        `json:"path"`
	WebRTCID string        `json:"webrtc_id"`
	Kind     string        `json:"kind"`
	Encoding AudioEncoding `json:"encoding"`
}

type AudioEncoding struct {
	MimeType   string `json:"mime_type"`
	SampleRate uint32 `json:"sample_rate"`
	Channels   uint16 `json:"channels"`
}

type QueryEventsInput struct {
	Path string `json:"path"`

	After *event.ID `json:"after" query:"after"`
	Until *event.ID `json:"until" query:"until"`

	Limit *int `json:"limit" query:"limit"`
	Bias  *int `json:"bias" query:"bias"` // -1, 0, 1
}

type QueryEventsReturns struct {
	Events []event.Event `json:"events"`
	More   bool          `json:"more"`
}

type QueryEventsCommand = calls.CommandCall[QueryEventsInput, QueryEventsReturns]

type Streamer struct {
	EventsURL       string
	EventPathPrefix string
	QueryEvents     *QueryEventsCommand
}

func ptr[T any](v T) *T {
	return &v
}

func (s *Streamer) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.HandleFunc("GET /stream/{trackID}", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		trackID := r.PathValue("trackID")
		audioPath := "bridge/audio-events/tracks/" + trackID + "/audio"

		res, err := s.QueryEvents.Call(ctx, QueryEventsInput{
			Path: audioPath,
			// Limit: nil,
			Bias: ptr(-1),
			// After: nil,
			// Until: nil,
		})
		if err != nil {
			slog.ErrorContext(ctx, "error querying events", "err", err)
			http.Error(w, fmt.Sprintf("error querying events: %s", err), http.StatusInternalServerError)
			return
		}
		slog.InfoContext(ctx, "query events", "len(events)", len(res.Events), "path", audioPath, "more", res.More)

		var b bytes.Buffer

		var ogg *oggwriter.OggWriter
		var encoding AudioEncoding
		for _, event := range res.Events {
			var chunk AudioChunk
			err = json.Unmarshal(event.Payload, &chunk)
			fatal(err)

			if ogg == nil {
				encoding = chunk.Encoding
				ogg, err = oggwriter.NewWith(&b, chunk.Encoding.SampleRate, chunk.Encoding.Channels)
				fatal(err)
			} else if encoding != chunk.Encoding {
				slog.ErrorContext(ctx, "encoding mismatch", "encoding", chunk.Encoding, "expected", encoding)
				http.Error(w, fmt.Sprintf("encoding mismatch: %s", err), http.StatusInternalServerError)
				return
			}

			dataPath := s.EventsURL + "/events/" + event.ID.String() + "/data"
			resp, err := http.Get(dataPath)
			fatal(err)
			defer resp.Body.Close()

			body, err := io.ReadAll(resp.Body)
			fatal(err)

			for i, offset := range chunk.Offsets {
				size := chunk.Sizes[i]
				var pkt rtp.Packet
				err = pkt.Unmarshal(body[offset : offset+size])
				fatal(err)
				err = ogg.WriteRTP(&pkt)
				fatal(err)
			}
		}

		w.Header().Set("Content-Type", "audio/ogg")
		b.WriteTo(w)
	})
}

func fatal(err error, msg ...string) {
	args := []any{err}
	for _, m := range msg {
		args = append(args, m)
	}
	if err != nil {
		log.Printf("FATAL")
		log.Fatal(args...)
	}
}

func must[T any](t T, err error) T {
	fatal(err)
	return t
}

func getEnv(key, def string) string {
	v := os.Getenv(key)
	if v == "" {
		return def
	}
	return v
}

func parsePort(port string) int {
	port16 := must(strconv.ParseUint(port, 10, 16))
	return int(port16)
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type SFURoute struct {
	SFU *sfu.Session
}

func (m *SFURoute) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.HandleFunc("GET /sfu", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			slog.InfoContext(r.Context(), "error upgrading to WebSocket", "err", err)
			return
		}
		peer, err := m.SFU.AddPeer(conn)
		if err != nil {
			slog.InfoContext(r.Context(), "error in AddPeer", "err", err)
			return
		}
		peer.HandleSignals()
	})
}
