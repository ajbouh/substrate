package main

import (
	"bytes"
	"context"
	"crypto/tls"
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
	"strconv"
	"strings"

	"github.com/ajbouh/substrate/images/webrtc-events/calls"
	"github.com/ajbouh/substrate/images/webrtc-events/ui"
	"github.com/ajbouh/substrate/images/webrtc-events/webrtc/js"
	"github.com/ajbouh/substrate/images/webrtc-events/webrtc/local"
	"github.com/ajbouh/substrate/images/webrtc-events/webrtc/sfu"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
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

// XXX need a way to pass binary data too
func ToPendingEvents(prefix string, events ...commands.Fields) ([]event.PendingEvent, error) {
	var pes []event.PendingEvent
	for _, e := range events {
		e["path"] = pathJoin(prefix, e["path"].(string))
		pe, err := json.Marshal(e)
		if err != nil {
			return nil, err
		}
		pes = append(pes, event.PendingEvent{Fields: pe})
	}
	return pes, nil
}

func init() {
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
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

		r, err := pc.WriteEvents.Call(ctx, WriteEventsInput{
			Events: must(ToPendingEvents(pc.EventPathPrefix, commands.Fields{
				"path":      "/tracks",
				"webrtc_id": track.ID(),
				"kind":      track.Kind(),
				"encoding": commands.Fields{
					"mime_type":   track.Codec().MimeType,
					"sample_rate": track.Codec().ClockRate,
					"channels":    track.Codec().Channels,
				},
				// TODO session offset, or do we record the current time?
			})),
		})
		if err != nil {
			slog.ErrorContext(ctx, "error recording track event", "err", err)
			return
		}
		slog.InfoContext(ctx, "recorded track event", "r", r)
		trackID := r.IDs[0]

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

		var timestamps []uint32
		var offsets []int
		var sizes []int
		var buffer [4 << 10]byte
		offset := 0
		flush := func() {
			slog.InfoContext(ctx, "flushing buffer", "written", offset)
			pe := must(ToPendingEvents(pc.EventPathPrefix, commands.Fields{
				"path": "/audio",
				"ts":   timestamps,
				"ix":   offsets,
				"sz":   sizes,
				"encoding": commands.Fields{
					"mime_type":   track.Codec().MimeType,
					"sample_rate": track.Codec().ClockRate,
					"channels":    track.Codec().Channels,
				},
				// TODO use links for track
				"track": trackID,
			}))[0]
			pe.DataEncoding = "base64"
			pe.Data = base64.RawStdEncoding.EncodeToString(buffer[:offset])
			r, err := pc.WriteEvents.Call(ctx, WriteEventsInput{
				Events: []event.PendingEvent{pe},
			})
			if err != nil {
				slog.ErrorContext(ctx, "error recording audio event", "err", err)
				return
			}
			slog.InfoContext(ctx, "recorded track audio", "r", r)
			offset = 0
			timestamps = timestamps[:0]
			offsets = offsets[:0]
			sizes = sizes[:0]
		}

		for {
			pkt, _, err := track.ReadRTP()
			if err != nil {
				if errors.Is(err, io.EOF) {
					slog.InfoContext(ctx, "got EOF")
					flush()
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
				flush()
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

type Streamer struct {
	EventPathPrefix string
	// WriteEvents     *EventWriteCommand
}

func (s *Streamer) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	// XXX seems like no direct way to fetch data for an event ID but could limit
	// it using "until"?

	// /events/tree/data/path/to/audio?until=<ID>

	// fetch audio by track id
	// optionally include time ranges to splice together into one result
	mux.HandleFunc("GET /stream", func(w http.ResponseWriter, r *http.Request) {
		// w.WriteHeader()

		// get these from event data
		var buffer []byte
		offset := 0
		size := 0
		sampleRate := uint32(16000)
		channels := uint16(2)

		ogg, err := oggwriter.NewWith(w, sampleRate, channels)
		fatal(err)
		var pkt rtp.Packet
		pkt.Unmarshal(buffer[offset : offset+size])
		err = ogg.WriteRTP(&pkt)
		fatal(err)
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
