package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"text/template"
	"time"

	"github.com/ajbouh/substrate/images/bridge/assistant"
	"github.com/ajbouh/substrate/images/bridge/assistant/tools"
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
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
	"github.com/fxamacker/cbor/v2"
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
	log.Println("got basePath", baseHref, "from SUBSTRATE_URL_PREFIX", basePath)

	sessionDir := getEnv("BRIDGE_SESSION_DIR", "./session")

	log.Println("loading session from disk")
	session, err := tracks.LoadSession(sessionDir)
	if err != nil {
		if !errors.Is(err, tracks.ErrSessionNotFound) {
			fatal(err)
		}
		log.Println("session not found, creating a new one")
		session = tracks.NewSession()
	}

	cmdSource := &commands.URLBasedSource{
		URL: getEnv("BRIDGE_COMMANDS_URL", "http://localhost:8090/"),
	}

	eventWriterURL := mustGetenv("SUBSTRATE_EVENT_WRITER_URL")
	sessionID := mustGetenv("BRIDGE_SESSION_ID")
	eventURLPrefix := fmt.Sprintf("%s/bridge/%s", eventWriterURL, sessionID)

	queryParams := url.Values{}
	queryParams.Set("path_prefix", "bridge/"+sessionID)
	eventStreamURL := fmt.Sprintf("%s?%s", mustGetenv("SUBSTRATE_STREAM_URL_PATH"), queryParams.Encode())

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
		cmdSource,
		transcribe.Agent{
			Source:  cmdSource,
			Command: getEnv("BRIDGE_TRANSCRIBE_COMMAND", "transcribe"),
		},
		translate.Agent{
			Source:         cmdSource,
			Command:        getEnv("BRIDGE_TRANSLATE_COMMAND", "transcribe"),
			TargetLanguage: "en",
		},
		&tools.OfferAgent{
			Name:      "bridge",
			Completer: tools.OpenAICompleter("tool-select"),
		},
		&tools.AutoTriggerAgent{},
		&tools.CallAgent{
			Name: "bridge",
		},
		diarize.Agent{
			Client: &diarize.PyannoteClient{
				Source:  cmdSource,
				Command: getEnv("BRIDGE_DIARIZE_COMMAND", "diarize"),
			},
		},
		assistant.Agent{
			DefaultAssistants: []assistant.Client{
				must(newAssistantClient("bridge", must(assistant.DefaultPromptTemplateForName("bridge")))),
			},
			NewClient: newAssistantClient,
		},
		httpevents.NewJSONRequester[assistant.AssistantTextNotification]("PUT", eventURLPrefix+"/assistant/text"),
		httpevents.NewJSONRequester[tools.OfferNotification]("PUT", eventURLPrefix+"/tools/offer"),
		httpevents.NewJSONRequester[tools.TriggerNotification]("PUT", eventURLPrefix+"/tools/trigger"),
		httpevents.NewJSONRequester[tools.CallNotification]("PUT", eventURLPrefix+"/tools/call"),
		httpevents.NewJSONRequester[diarize.SpeakerDetectedEvent]("PUT", eventURLPrefix+"/diarize/speaker-detected"),
		httpevents.NewJSONRequester[diarize.SpeakerNameEvent]("PUT", eventURLPrefix+"/diarize/speaker-name"),
		httpevents.NewJSONRequester[transcribe.TranscriptionEvent]("PUT", eventURLPrefix+"/transcription"),
		httpevents.NewJSONRequester[translate.TranslationEvent]("PUT", eventURLPrefix+"/translation"),
		httpevents.NewJSONRequester[vad.ActivityEvent]("PUT", eventURLPrefix+"/voice-activity"),
		workingset.CommandProvider{},
	)
}

func mustGetenv(name string) string {
	value := os.Getenv(name)
	if value == "" {
		log.Fatalf("%s not set", name)
	}
	return value
}

var cborenc = func() cbor.EncMode {
	opts := cbor.CoreDetEncOptions()
	opts.Time = cbor.TimeRFC3339
	em, err := opts.EncMode()
	fatal(err)
	return em
}()

type eventLogger struct {
	exclude []string
}

func (l eventLogger) HandleEvent(e tracks.Event) {
	for _, t := range l.exclude {
		if e.Type == t {
			return
		}
	}
	log.Printf("event: %s %s %s-%s %#v", e.Type, e.ID, time.Duration(e.Start), time.Duration(e.End), e.Data)
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
		d2 := tools.Definition{
			Type: "function",
			Function: tools.Func{
				Name:        name,
				Description: d.Description,
				Parameters: tools.Params{
					Type:       "object",
					Properties: map[string]tools.Prop{},
				},
			},
		}

		parametersPrefix := commands.NewDataPointer("data", "parameters")
		for pointer, metadata := range d.Meta {
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

		log.Printf("got track %s %s", track.ID(), track.Kind())
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
				log.Printf("track %s: %s", track.ID(), err)
				break
			}
		}
	})

	pc.peer.HandleSignals()
}

type View struct {
	Session *tracks.Session
}

func fatal(err error) {
	if err != nil {
		log.Printf("FATAL")
		log.Fatal(err)
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
	for _, t := range m.Session.Tracks() {
		log.Printf("track: %s", t.ID)
	}
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
		log.Printf("error parsing template for session %s: %s", snapshot.ID, err)
		http.Error(w, fmt.Sprintf("template parse error: %s", err), http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, map[string]any{
		"Session":         snapshot,
		"NativeLanguages": map[string]bool{"en": true},
	})
	if err != nil {
		log.Printf("error executing template for session %s: %s", snapshot.ID, err)
	}
}

func (m *SessionHandler) serveSessionUpdates(w http.ResponseWriter, r *http.Request) {
	if !websocket.IsWebSocketUpgrade(r) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]any{
			"session_start":    m.Session.Start,
			"event_stream_url": m.EventStreamURL,
		})
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	for range m.Session.UpdateHandler(r.Context()) {
		data, err := cborenc.Marshal(View{
			Session: m.Session,
		})
		fatal(err)
		if err := conn.WriteMessage(websocket.BinaryMessage, data); err != nil {
			log.Println("data:", err)
			return
		}
	}
}

type SFURoute struct {
	SFU *sfu.Session
}

func (m *SFURoute) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.HandleFunc("GET /sfu", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Print("upgrade:", err)
			return
		}
		peer, err := m.SFU.AddPeer(conn)
		if err != nil {
			log.Print("peer:", err)
			return
		}
		peer.HandleSignals()
	})
}

func (m *SessionHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.HandleFunc("GET /data", m.serveSessionUpdates)
	mux.HandleFunc("GET /text", m.serveSessionText)
	mux.HandleFunc("POST /tracks/{track_id}", m.addEvent)
}
