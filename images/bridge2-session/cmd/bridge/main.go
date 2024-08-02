package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"text/template"
	"time"

	"github.com/ajbouh/substrate/images/bridge2-session/assistant"
	"github.com/ajbouh/substrate/images/bridge2-session/assistant/tools"
	"github.com/ajbouh/substrate/images/bridge2-session/diarize"
	"github.com/ajbouh/substrate/images/bridge2-session/tracks"
	"github.com/ajbouh/substrate/images/bridge2-session/transcribe"
	"github.com/ajbouh/substrate/images/bridge2-session/translate"
	"github.com/ajbouh/substrate/images/bridge2-session/ui"
	"github.com/ajbouh/substrate/images/bridge2-session/vad"
	"github.com/ajbouh/substrate/images/bridge2-session/webrtc/js"
	"github.com/ajbouh/substrate/images/bridge2-session/webrtc/local"
	"github.com/ajbouh/substrate/images/bridge2-session/webrtc/sfu"
	"github.com/ajbouh/substrate/images/bridge2-session/webrtc/trackstreamer"
	"github.com/ajbouh/substrate/images/bridge2-session/workingset"
	"github.com/ajbouh/substrate/pkg/commands"
	"github.com/fxamacker/cbor/v2"
	"github.com/gopxl/beep"
	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v3"
	"github.com/pion/webrtc/v3/pkg/media/oggwriter"
	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"
)

func main() {
	format := beep.Format{
		SampleRate:  beep.SampleRate(16000),
		NumChannels: 1,
		Precision:   4,
	}

	newAssistantClient := assistant.OpenAIClientGenerator

	engine.Run(
		Main{
			format: format,
		},
		vad.New(vad.Config{
			SampleRate:   format.SampleRate.N(time.Second),
			SampleWindow: 24 * time.Second,
		}),
		transcribe.Agent{
			Endpoint: getEnv("BRIDGE_TRANSCRIBE_URL", "http://localhost:8090/v1/transcribe"),
		},
		translate.Agent{
			Endpoint:       getEnv("BRIDGE_TRANSLATE_URL", "http://localhost:8091/v1/transcribe"),
			TargetLanguage: "en",
		},
		diarize.Agent{
			Client: &diarize.PyannoteClient{Endpoint: getEnv("BRIDGE_DIARIZE_URL", "http://localhost:8092/v1/diarize")},
		},
		assistant.Agent{
			DefaultAssistants: []assistant.Client{
				must(newAssistantClient("bridge", must(assistant.DefaultPromptTemplateForName("bridge")))),
			},
			NewClient: newAssistantClient,
		},
		&AssistantCommands{},
		workingset.CommandProvider{},
		eventLogger{
			exclude: []string{"audio"},
		},
	)
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

type SessionInitHandler interface {
	HandleSessionInit(*tracks.Session)
}

type commandSourceRegistry struct {
	Source commands.Source
}

var _ tools.Registry = (*commandSourceRegistry)(nil)

func (s *commandSourceRegistry) ListTools(ctx context.Context) ([]tools.Definition, error) {
	def, err := s.Source.Reflect(ctx)
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
		for paramName, param := range d.Parameters {
			d2.Function.Parameters.Properties[paramName] = tools.Prop{Type: param.Type}
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
	ret, err := s.Source.Run(ctx, call.Name, params)
	if err != nil {
		return nil, err
	}
	return ret, nil
}

type lazySource func() commands.Source

var _ commands.Source = lazySource(nil)

func (l lazySource) Reflect(ctx context.Context) (commands.DefIndex, error) {
	return l().Reflect(ctx)
}

func (l lazySource) Run(ctx context.Context, name string, p commands.Fields) (commands.Fields, error) {
	return l().Run(ctx, name, p)
}

type AssistantCommands struct {
	SessionCommandSources []SessionCommandSource
}

func (a *AssistantCommands) HandleSessionInit(sess *tracks.Session) {
	agent := tools.NewAgent(
		"bridge",
		&commandSourceRegistry{Source: lazySource(func() commands.Source {
			return sessionCommandSource(a.SessionCommandSources, sess)
		})},
	)
	sess.Listen(agent)
}

type SessionCommandSource interface {
	CommandsSource(sess *tracks.Session) commands.Source
}

type Main struct {
	SessionInitHandlers   []SessionInitHandler
	EventHandlers         []tracks.Handler
	SessionCommandSources []SessionCommandSource

	session  *Session
	format   beep.Format
	basePath string
	port     int

	sessionDir string

	Daemon *daemon.Framework
}

type Session struct {
	*tracks.Session
	sfu  *sfu.Session
	peer *local.Peer
}

type View struct {
	Sessions []*tracks.SessionInfo
	Session  *Session
}

func fatal(err error) {
	if err != nil {
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

func (m *Main) Initialize() {
	basePath := os.Getenv("SUBSTRATE_URL_PREFIX")
	// ensure the path starts and ends with a slash for setting <base href>
	m.basePath = must(url.JoinPath("/", basePath, "/"))
	log.Println("got basePath", m.basePath, "from SUBSTRATE_URL_PREFIX", basePath)
	m.port = parsePort(getEnv("PORT", "8080"))

	m.sessionDir = getEnv("BRIDGE_SESSIONS_DIR", "./sessions")
}

func (m *Main) InitializeCLI(root *cli.Command) {
	// a workaround for an unresolved issue in toolkit-go/engine
	// for figuring out if its a CLI or a daemon program...
	root.Run = func(ctx *cli.Context, args []string) {
		if err := m.Daemon.Run(ctx); err != nil {
			log.Fatal(err)
		}
	}
}

func (m *Main) TerminateDaemon(ctx context.Context) error {
	if sess := m.session; sess != nil {
		if err := m.saveSession(sess); err != nil {
			return err
		}
	}
	return nil
}

func (m *Main) saveSession(sess *Session) error {
	b, err := cborenc.Marshal(sess)
	if err != nil {
		return err
	}
	filename := fmt.Sprintf("%s/session", m.sessionDir)
	if err := os.WriteFile(filename, b, 0644); err != nil {
		return err
	}
	// for debugging!
	// b, err = json.Marshal(sess)
	// if err != nil {
	// 	return err
	// }
	// filename = fmt.Sprintf("%s/%s/session.json", m.sessionDir, id)
	// if err := os.WriteFile(filename, b, 0644); err != nil {
	// 	return err
	// }
	return nil
}

func (m *Main) SessionStoragePath(sess *tracks.Session, scope string) string {
	dir := filepath.Join(m.sessionDir, scope)
	err := os.MkdirAll(dir, 0744)
	fatal(err)
	return dir
}

func (m *Main) StartSession(sess *Session) {
	var err error
	sess.peer, err = local.NewPeer(fmt.Sprintf("ws://localhost:%d/sfu", m.port)) // FIX: hardcoded host
	fatal(err)
	sess.peer.OnTrack(func(track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
		sessTrack := sess.NewTrack(m.format)

		log.Printf("got track %s %s", track.ID(), track.Kind())
		if track.Kind() != webrtc.RTPCodecTypeAudio {
			return
		}
		ogg, err := oggwriter.New(fmt.Sprintf("%s/track-%s.ogg", m.sessionDir, track.ID()), uint32(m.format.SampleRate.N(time.Second)), uint16(m.format.NumChannels))
		fatal(err)
		defer ogg.Close()
		rtp := trackstreamer.Tee(track, ogg)
		s, err := trackstreamer.New(rtp, m.format)
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
	sess.peer.HandleSignals()
}

// Return a channel which will be notified when the session receives a new
// event. Designed to debounce handling for one update at a time. The channel
// will be closed when the context is cancelled to allow "range" loops over
// the updates.
func sessionUpdateHandler(ctx context.Context, sess *Session) <-chan struct{} {
	ch := make(chan struct{}, 1)
	// start with a message in order to send an update right away
	ch <- struct{}{}
	h := tracks.HandlerFunc(func(e tracks.Event) {
		if e.Type == "audio" {
			// if this is a transient event like "audio" we don't need to save
			return
		}
		select {
		case ch <- struct{}{}:
		default:
		}
	})
	go func() {
		<-ctx.Done()
		sess.Unlisten(h)
		close(ch)
	}()
	sess.Listen(h)
	return ch
}

func (m *Main) loadOrCreateSession(ctx context.Context) (*Session, error) {
	log.Println("loading session from disk")
	trackSess, err := tracks.LoadSession(m.sessionDir)
	if err != nil {
		if !errors.Is(err, tracks.ErrSessionNotFound) {
			return nil, err
		}
		log.Println("session not found, creating a new one")
		trackSess = tracks.NewSession()
	}
	sess := &Session{
		sfu:     sfu.NewSession(),
		Session: trackSess,
	}
	for _, h := range m.SessionInitHandlers {
		h.HandleSessionInit(sess.Session)
	}
	// For older sessions we may want to leave them read-only, at least by
	// default. We could give them the option to start recording again, but they
	// may not want new audio to be automatically recorded when they look it up.
	for _, h := range m.EventHandlers {
		sess.Listen(h)
	}
	go func() {
		for range sessionUpdateHandler(ctx, sess) {
			log.Printf("saving session")
			fatal(m.saveSession(sess))
		}
	}()
	fatal(os.MkdirAll(fmt.Sprintf("%s", m.sessionDir), 0744))
	go m.StartSession(sess)
	return sess, nil
}

func serveWithBasePath(basePath string, dir fs.FS, path string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		content, err := fs.ReadFile(dir, path)
		if err != nil {
			log.Println(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		content = bytes.Replace(content,
			[]byte("<head>"),
			[]byte(`<head><base href="`+basePath+`">`),
			1)
		b := bytes.NewReader(content)
		http.ServeContent(w, r, path, time.Now(), b)
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func (m *Main) serveSessionText(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	snapshot := m.session.Snapshot()
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

func (m *Main) serveSessionUpdates(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()
	for range sessionUpdateHandler(ctx, m.session) {
		// XXX
		var sessions []*tracks.SessionInfo
		info, err := tracks.LoadSessionInfo(m.sessionDir, string(m.session.ID))
		fatal(err)
		sessions = append(sessions, info)
		data, err := cborenc.Marshal(View{
			Sessions: sessions,
			Session:  m.session,
		})
		fatal(err)
		if err := conn.WriteMessage(websocket.BinaryMessage, data); err != nil {
			log.Println("data:", err)
			return
		}
	}
}

func sessionCommandSource(m []SessionCommandSource, sess *tracks.Session) commands.Source {
	src := &commands.DynamicSource{}
	for _, p := range m {
		src.Sources = append(src.Sources, p.CommandsSource(sess))
	}
	return src
}

func (m *Main) SessionCommandHandler(ctx context.Context, w http.ResponseWriter, r *http.Request) *commands.HTTPHandler {
	sess := m.session
	return &commands.HTTPHandler{Source: sessionCommandSource(m.SessionCommandSources, sess.Session)}
}

func (m *Main) Serve(ctx context.Context) {
	m.session = must(m.loadOrCreateSession(ctx))

	sessionHTMLHandler := serveWithBasePath(m.basePath, ui.Dir, "session.html")
	http.Handle("GET /", sessionHTMLHandler)
	http.HandleFunc("REFLECT /", func(w http.ResponseWriter, r *http.Request) {
		m.SessionCommandHandler(ctx, w, r).ServeHTTPReflect(w, r)
	})
	http.HandleFunc("POST /", func(w http.ResponseWriter, r *http.Request) {
		m.SessionCommandHandler(ctx, w, r).ServeHTTPRun(w, r)
	})

	http.HandleFunc("GET /sfu", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Print("upgrade:", err)
			return
		}
		peer, err := m.session.sfu.AddPeer(conn)
		if err != nil {
			log.Print("peer:", err)
			return
		}
		peer.HandleSignals()
	})
	http.HandleFunc("GET /data", func(w http.ResponseWriter, r *http.Request) {
		m.serveSessionUpdates(ctx, w, r)
	})
	http.HandleFunc("GET /text", func(w http.ResponseWriter, r *http.Request) {
		m.serveSessionText(ctx, w, r)
	})

	http.Handle("GET /webrtc/", http.StripPrefix("/webrtc", http.FileServer(http.FS(js.Dir))))
	http.Handle("GET /ui/", http.StripPrefix("/ui", http.FileServer(http.FS(ui.Dir))))

	log.Printf("running on http://localhost:%d ...", m.port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", m.port), nil))
}
