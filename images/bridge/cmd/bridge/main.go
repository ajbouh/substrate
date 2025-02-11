package main

import (
	"bytes"
	"context"
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
	"text/template"
	"time"

	"github.com/ajbouh/substrate/images/bridge/assistant"
	"github.com/ajbouh/substrate/images/bridge/assistant/tools"
	"github.com/ajbouh/substrate/images/bridge/calls"
	"github.com/ajbouh/substrate/images/bridge/diarize"
	"github.com/ajbouh/substrate/images/bridge/tracks"
	"github.com/ajbouh/substrate/images/bridge/transcribe"
	"github.com/ajbouh/substrate/images/bridge/translate"
	"github.com/ajbouh/substrate/images/bridge/ui"
	"github.com/ajbouh/substrate/images/bridge/vad"
	"github.com/ajbouh/substrate/images/bridge/webrtc/js"
	"github.com/ajbouh/substrate/images/bridge/webrtc/local"
	"github.com/ajbouh/substrate/images/bridge/webrtc/sfu"
	"github.com/ajbouh/substrate/images/bridge/webrtc/trackstreamer"
	"github.com/ajbouh/substrate/images/bridge/workingset"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
	"github.com/gopxl/beep"
	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v3"
	"github.com/pion/webrtc/v3/pkg/media/oggwriter"
)

func main() {
	format := beep.Format{
		SampleRate:  beep.SampleRate(16000),
		NumChannels: 1,
		Precision:   4,
	}

	newAssistantClient := assistant.OpenAIClientGenerator

	port := parsePort(getEnv("PORT", "8080"))

	basePath := os.Getenv("SUBSTRATE_URL_PREFIX")
	// ensure the path starts and ends with a slash for setting <base href>
	baseHref := must(url.JoinPath("/", basePath, "/"))
	slog.Info("bridge starting", "baseHref", baseHref, "SUBSTRATE_URL_PREFIX", basePath)

	sessionDir := getEnv("BRIDGE_SESSION_DIR", "./session")

	slog.Info("loading session from disk")
	session, err := tracks.LoadSession(sessionDir)
	if err != nil {
		if !errors.Is(err, tracks.ErrSessionNotFound) {
			fatal(err)
		}
		slog.Info("session not found, creating a new one")
		session = tracks.NewSession()
	}

	eventURLPrefix := mustGetenv("SUBSTRATE_EVENT_WRITER_URL")
	pathPrefix := mustGetenv("BRIDGE_EVENT_PATH_PREFIX")
	queryParams := url.Values{}
	queryParams.Set("path_prefix", pathPrefix)
	eventStreamURL := fmt.Sprintf("%s?%s", mustGetenv("SUBSTRATE_STREAM_URL_PATH"), queryParams.Encode())

	toolSelect := &tools.OpenAICompleter{
		Template: "tool-select",
	}

	brigeCommandsURL := getEnv("BRIDGE_COMMANDS_URL", "http://localhost:8090/")

	engine.Run(
		&service.Service{},
		&SessionHandler{
			EventStreamURL: eventStreamURL,
		},
		sfu.NewSession(),
		&PeerComponent{
			SFUURL: fmt.Sprintf("ws://localhost:%d%s/sfu", port, basePath), // FIX: hardcoded host
			Format: format,
		},
		session,
		&tracks.SessionStoragePaths{
			SessionDir: sessionDir,
		},
		&commandSourceRegistry{},
		eventLogger{
			exclude: []string{"audio"},
		},
		&tracks.SessionSaver{},
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
		vad.New(vad.Config{
			SampleRate:   format.SampleRate.N(time.Second),
			SampleWindow: 24 * time.Second,
		}),
		transcribe.Agent{},
		&transcribe.Command{
			URL:     brigeCommandsURL,
			Command: getEnv("BRIDGE_TRANSCRIBE_COMMAND", "transcribe"),
		},
		translate.Agent{
			TargetLanguage: "en",
		},
		&translate.Command{
			URL:     brigeCommandsURL,
			Command: getEnv("BRIDGE_TRANSLATE_COMMAND", "transcribe"),
		},
		&tools.OfferAgent{
			Name:      "bridge",
			Completer: toolSelect,
		},
		toolSelect,
		&tools.AutoTriggerAgent{},
		&tools.CallAgent{
			Name: "bridge",
		},
		diarize.Agent{},
		&diarize.PyannoteClient{},
		&diarize.Command{
			URL:     brigeCommandsURL,
			Command: getEnv("BRIDGE_DIARIZE_COMMAND", "diarize"),
		},
		assistant.Agent{
			DefaultAssistants: map[string]string{
				"bridge": must(assistant.DefaultPromptTemplateForName("bridge")),
			},
			NewClient: newAssistantClient,
		},
		httpevents.NewJSONRequester[vad.ActivityEvent]("PUT", eventURLPrefix+"/voice-activity"),
		workingset.CommandProvider{},
		EventCommands{
			EventPathPrefix: pathPrefix,
			BridgeURL:       baseHref,
		},
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

type EventCommands struct {
	Session         *tracks.Session
	EventPathPrefix string
	BridgeURL       string
	Handlers        []interface {
		HandleEvent2(context.Context, tracks.Event) ([]tracks.PathEvent, error)
	}
	WriteEvents *EventWriteCommand
}

type EventResult struct {
	Next []event.PendingEvent `json:"next" doc:""`
}

type CommandRuleInput struct {
	Path     string `json:"path"`
	Disabled bool   `json:"disabled,omitempty"`
	Deleted  bool   `json:"deleted,omitempty"`

	Conditions []*event.Query  `json:"conditions"`
	Command    commands.Fields `json:"command"`

	// Cursor *CommandRuleCursor `json:"-"`
}

func (es *EventCommands) Initialize() {
	rules := []CommandRuleInput{
		{
			Path: "/rules/defs" + es.EventPathPrefix,
			Conditions: []*event.Query{
				{
					EventsWherePrefix: map[string][]event.WherePrefix{
						"path": {{Prefix: es.EventPathPrefix}},
					},
				},
			},
			Command: commands.Fields{
				"meta": commands.Meta{
					"#/data/parameters/events": {Type: "any"},
					"#/data/returns/events":    {Type: "any"},
				},
				"msg_in": commands.Bindings{
					"#/msg/data/parameters/events": "#/data/parameters/events",
				},
				"msg_out": commands.Bindings{
					"#/data/returns/next": "#/msg/data/returns/next",
				},
				"msg": commands.Fields{
					"cap":  "reflect",
					"url":  es.BridgeURL,
					"name": "events:handle",
				},
			},
		},
	}
	events := make([]event.PendingEvent, 0, len(rules))
	for _, r := range rules {
		b, err := json.Marshal(r)
		fatal(err)
		events = append(events, event.PendingEvent{
			ConflictKeys: []string{"conditions", "command"},
			Fields:       b,
		})
	}
	r, err := es.WriteEvents.Call(context.TODO(), WriteEventsInput{Events: events})
	fatal(err)
	slog.Info("initialized rules", "result", r)
}

func (es *EventCommands) Commands(ctx context.Context) commands.Source {
	sources := []commands.Source{
		commands.List[commands.Source](
			handle.Command("handle",
				"Inserts events into the session",
				func(ctx context.Context, t *struct{}, args struct {
					Events []event.Event `json:"events" doc:""`
				}) (EventResult, error) {
					r := EventResult{
						// XXX is the events service processing this?
						// not seeing new events show up
						Next: []event.PendingEvent{},
					}
					jsonEvents, err := event.Unmarshal[tracks.JSONEvent](args.Events, true)
					if err != nil {
						slog.ErrorContext(ctx, "events:handle unable to Unmarshal", "err", err)
						return r, err
					}
					slog.InfoContext(ctx, "events:handle", "num_events", len(jsonEvents))
					for _, e := range jsonEvents {
						event, isNew, err := tracks.InsertJSONEvent(es.Session, e)
						if err != nil {
							slog.InfoContext(ctx, "error inserting event", "err", err)
							continue
							// return r, err
						}
						slog.InfoContext(ctx, "events:handle", "event_id", event.ID, "type", event.Type, "isNew", isNew)
						if isNew {
							// we eventually want these to be async, but could wait until
							// splitting it into separate services which would be processing
							// events independently
							for _, h := range es.Handlers {
								results, err := h.HandleEvent2(ctx, *event)
								if err != nil {
									slog.InfoContext(ctx, "error processing event", "err", err)
									continue
								}
								pes, err := es.toPendingEvents(results)
								if err != nil {
									slog.InfoContext(ctx, "error converting to pending events", "err", err)
									continue
								}
								r.Next = append(r.Next, pes...)
							}
						}
					}
					return r, nil
				}),
		),
	}

	return commands.Prefixed("events:",
		commands.Dynamic(nil, nil, func() []commands.Source { return sources }),
	)
}

func pathJoin(a, b string) string {
	a = strings.TrimRight(a, "/")
	b = strings.TrimLeft(b, "/")
	return a + "/" + b
}

// TODO add "links" for storing relationship of events:
// in the event, add a `links` field, with `{[linkname]: {rel: "eventref", "eventref:event": othereventid, "eventref:start": X, "eventref:end": Y, "eventref:unit": "second", "eventref:axis": "audiotrack/1"}`
func (es *EventCommands) toPendingEvents(events []tracks.PathEvent) ([]event.PendingEvent, error) {
	var pes []event.PendingEvent
	for _, e := range events {
		e.Path = pathJoin(es.EventPathPrefix, e.Path)
		pe, err := json.Marshal(e)
		if err != nil {
			return nil, err
		}
		pes = append(pes, event.PendingEvent{Fields: pe})
	}
	return pes, nil
}

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

type eventLogger struct {
	exclude []string
}

func (l eventLogger) HandleEvent(e tracks.Event) {
	for _, t := range l.exclude {
		if e.Type == t {
			return
		}
	}
	slog.Info("event", "type", e.Type, "id", e.ID, "start", time.Duration(e.Start), "end", time.Duration(e.End), "data", e.Data)
}

type commandSourceRegistry struct {
	Aggregate *commands.Aggregate
}

var _ tools.Registry = (*commandSourceRegistry)(nil)

func (s *commandSourceRegistry) ListTools(ctx context.Context) ([]tools.Definition, error) {
	def, err := s.Aggregate.AsSource(ctx, nil).Reflect(ctx)
	if err != nil {
		return nil, err
	}
	var td []tools.Definition
	for name, d := range def {
		desc, err := commands.GetPath[string](d, "description")
		if err != nil {
			return nil, err
		}

		d2 := tools.Definition{
			Type: "function",
			Function: tools.Func{
				Name:        name,
				Description: desc,
				Parameters: tools.Params{
					Type:       "object",
					Properties: map[string]tools.Prop{},
				},
			},
		}

		parametersPrefix := commands.NewDataPointer("data", "parameters")
		meta, err := commands.GetPath[commands.Meta](d, "meta")
		if err != nil {
			return nil, err
		}
		for pointer, metadata := range meta {
			subpath, ok := pointer.TrimPathPrefix(parametersPrefix)
			if !ok {
				continue
			}

			p := subpath.Path()
			if len(p) == 0 {
				continue
			}
			paramName := p[0]

			d2.Function.Parameters.Properties[paramName] = tools.Prop{Type: metadata.Type}

			// TODO update commands to show which are required
			d2.Function.Parameters.Required = append(d2.Function.Parameters.Required, paramName)
		}
		td = append(td, d2)
	}
	return td, nil
}

func (s *commandSourceRegistry) RunTool(ctx context.Context, call tools.Call[any]) (any, error) {
	params := commands.Fields{}
	for k, v := range call.Arguments.(map[string]any) {
		params[k] = v
	}
	ret, err := s.Aggregate.AsSource(ctx, nil).Run(ctx, call.Name, params)
	if err != nil {
		return nil, err
	}
	return ret, nil
}

type PeerComponent struct {
	SFUURL              string
	Format              beep.Format
	Session             *tracks.Session
	SessionStoragePaths *tracks.SessionStoragePaths

	peer *local.Peer
}

func (pc *PeerComponent) Serve(ctx context.Context) {
	var err error
	pc.peer, err = local.NewPeer(pc.SFUURL)
	fatal(err)

	pc.peer.OnTrack(func(track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
		sessTrack := pc.Session.NewTrack(pc.Format)

		slog.InfoContext(ctx, "got track", "id", track.ID(), "kind", track.Kind())
		if track.Kind() != webrtc.RTPCodecTypeAudio {
			return
		}
		ogg, err := oggwriter.New(pc.SessionStoragePaths.File(fmt.Sprintf("track-%s.ogg", track.ID())), uint32(pc.Format.SampleRate.N(time.Second)), uint16(pc.Format.NumChannels))
		fatal(err)
		defer ogg.Close()
		rtp := trackstreamer.Tee(track, ogg)
		s, err := trackstreamer.New(rtp, pc.Format)
		fatal(err)

		chunkSize := sessTrack.AudioFormat().SampleRate.N(100 * time.Millisecond)
		for {
			// since Track.AddAudio expects finite segments, split it into chunks of
			// a smaller size we can append incrementally
			chunk := beep.Take(chunkSize, s)
			sessTrack.AddAudio(chunk)
			if err := chunk.Err(); err != nil {
				slog.InfoContext(ctx, "error in AddAudio", "track_id", track.ID(), "err", err)
				break
			}
		}
	})

	pc.peer.HandleSignals()
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

type SessionHandler struct {
	Session        *tracks.Session
	EventStreamURL string
}

func (m *SessionHandler) addEvent(w http.ResponseWriter, r *http.Request) {
	trackID := tracks.ID(r.PathValue("track_id"))
	track := m.Session.Track(trackID)
	if track == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	defer r.Body.Close()
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, fmt.Sprintf("error reading body: %s", err), http.StatusInternalServerError)
		return
	}
	event, err := tracks.RecordJSONEvent(track, body)
	if err != nil {
		// TODO check for unknown event type or JSON parse errors
		http.Error(w, fmt.Sprintf("error recording event: %s", err), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	err = json.NewEncoder(w).Encode(map[string]any{
		"id": event.ID,
	})
	if err != nil {
		panic(err)
	}
}

func (m *SessionHandler) serveSessionText(w http.ResponseWriter, r *http.Request) {
	snapshot := m.Session.Snapshot()
	tmpl, err := template.New("session.tmpl.txt").
		Funcs(template.FuncMap{
			"json": func(v any) (string, error) {
				b, err := json.Marshal(v)
				return string(b), err
			},
			"duration": func(s string) (time.Duration, error) {
				return time.ParseDuration(s)
			},
		}).
		ParseFS(ui.Dir, "session.tmpl.txt")
	if err != nil {
		slog.Info("error parsing template", "session_id", snapshot.ID, "err", err)
		http.Error(w, fmt.Sprintf("template parse error: %s", err), http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, map[string]any{
		"Session":         snapshot,
		"NativeLanguages": map[string]bool{"en": true},
	})
	if err != nil {
		slog.Info("error executing template", "session_id", snapshot.ID, "err", err)
	}
}

func (m *SessionHandler) serveSessionData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"session_start":    m.Session.Start,
		"event_stream_url": m.EventStreamURL,
	})
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

func (m *SessionHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.HandleFunc("GET /data", m.serveSessionData)
	mux.HandleFunc("GET /text", m.serveSessionText)
	mux.HandleFunc("POST /tracks/{track_id}", m.addEvent)
}
