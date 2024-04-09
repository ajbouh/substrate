package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"sort"
	"strconv"
	"sync"
	"text/template"
	"time"

	"github.com/ajbouh/substrate/images/bridge2/assistant"
	"github.com/ajbouh/substrate/images/bridge2/assistant/tools"
	"github.com/ajbouh/substrate/images/bridge2/diarize"
	"github.com/ajbouh/substrate/images/bridge2/tracks"
	"github.com/ajbouh/substrate/images/bridge2/transcribe"
	"github.com/ajbouh/substrate/images/bridge2/translate"
	"github.com/ajbouh/substrate/images/bridge2/ui"
	"github.com/ajbouh/substrate/images/bridge2/vad"
	"github.com/ajbouh/substrate/images/bridge2/webrtc/js"
	"github.com/ajbouh/substrate/images/bridge2/webrtc/local"
	"github.com/ajbouh/substrate/images/bridge2/webrtc/sfu"
	"github.com/ajbouh/substrate/images/bridge2/webrtc/trackstreamer"
	"github.com/ajbouh/substrate/images/bridge2/workingset"
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
			return sessionCommandSource(a.SessionCommandSources, sess).AsDynamicSource(context.Background())
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

	sessions map[string]*Session
	format   beep.Format
	basePath string
	port     int

	sessionDir string

	Daemon *daemon.Framework

	mu sync.Mutex
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
	for _, sess := range m.sessions {
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
	filename := fmt.Sprintf("%s/%s/session", m.sessionDir, sess.ID)
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
	dir := filepath.Join(m.sessionDir, string(sess.ID), scope)
	err := os.MkdirAll(dir, 0744)
	fatal(err)
	return dir
}

func (m *Main) SavedSessions() (info []*tracks.SessionInfo, err error) {
	root := m.sessionDir
	dir, err := os.ReadDir(root)
	if err != nil {
		return nil, err
	}
	for _, fi := range dir {
		if fi.IsDir() {
			log.Printf("reading session %s", fi.Name())
			sess, err := tracks.LoadSessionInfo(root, fi.Name())
			if err != nil {
				log.Printf("error reading session %s: %s", fi.Name(), err)
				continue
			}
			info = append(info, sess)
		}
	}
	sort.Slice(info, func(i, j int) bool {
		return info[i].Start.After(info[j].Start)
	})
	return
}

func (m *Main) StartSession(sess *Session) {
	var err error
	sess.peer, err = local.NewPeer(fmt.Sprintf("ws://localhost:%d/sessions/%s/sfu", m.port, sess.ID)) // FIX: hardcoded host
	fatal(err)
	sess.peer.OnTrack(func(track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
		sessTrack := sess.NewTrack(m.format)

		log.Printf("got track %s %s", track.ID(), track.Kind())
		if track.Kind() != webrtc.RTPCodecTypeAudio {
			return
		}
		ogg, err := oggwriter.New(fmt.Sprintf("%s/%s/track-%s.ogg", m.sessionDir, sess.ID, track.ID()), uint32(m.format.SampleRate.N(time.Second)), uint16(m.format.NumChannels))
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

func timeoutUpdateCh(in <-chan struct{}, timeout time.Duration) <-chan struct{} {
	out := make(chan struct{})
	go func() {
		out <- struct{}{} // trigger initial update
		for {
			select {
			case <-time.After(timeout):
				out <- struct{}{}
			case _, ok := <-in:
				if !ok {
					close(out)
					return
				}
				out <- struct{}{}
			}
		}
	}()
	return out
}

func (m *Main) loadSession(ctx context.Context, id string) (*Session, error) {
	m.mu.Lock()
	sess := m.sessions[id]
	m.mu.Unlock()
	if sess != nil {
		log.Println("found session in cache", id)
		return sess, nil
	}
	log.Println("loading session from disk", id)
	trackSess, err := tracks.LoadSession(m.sessionDir, id)
	if err != nil {
		// TODO handle not found error
		return nil, err
	}
	sess = m.addSession(ctx, trackSess)
	return sess, nil
}

func (m *Main) addSession(ctx context.Context, trackSess *tracks.Session) *Session {
	m.mu.Lock()
	defer m.mu.Unlock()
	if sess := m.sessions[string(trackSess.ID)]; sess != nil {
		return sess
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
	m.sessions[string(sess.ID)] = sess
	fatal(os.MkdirAll(fmt.Sprintf("%s/%s", m.sessionDir, sess.ID), 0744))
	go m.StartSession(sess)
	return sess
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

func (m *Main) serveSessionText(ctx context.Context, w http.ResponseWriter, r *http.Request, sess *Session) {
	snapshot := sess.Snapshot()
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

func (m *Main) serveSessionUpdates(ctx context.Context, w http.ResponseWriter, r *http.Request, sess *Session) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()
	// by default, send updates until the context is cancelled
	updateCh := ctx.Done()
	if sess != nil {
		// with an active session, send updates when new events arrive
		updateCh = sessionUpdateHandler(ctx, sess)
	}
	// refresh the list of sessions periodically
	updateCh = timeoutUpdateCh(updateCh, 10*time.Second)
	for range updateCh {
		names, err := m.SavedSessions()
		fatal(err)
		data, err := cborenc.Marshal(View{
			Sessions: names,
			Session:  sess,
		})
		fatal(err)
		if err := conn.WriteMessage(websocket.BinaryMessage, data); err != nil {
			log.Println("data:", err)
			return
		}
	}
}

func (m *Main) loadRequestSession(ctx context.Context, w http.ResponseWriter, r *http.Request) *Session {
	sessID := r.PathValue("sessID")
	if sessID == "" {
		http.Error(w, "not found", http.StatusNotFound)
		panic(http.ErrAbortHandler)
	}
	sess, err := m.loadSession(ctx, sessID)
	if err != nil {
		// TODO different error if we failed to load vs not found
		log.Printf("error loading session %s: %s", sessID, err)
		http.Error(w, "not found", http.StatusNotFound)
		panic(http.ErrAbortHandler)
	}
	return sess
}

func sessionCommandSource(m []SessionCommandSource, sess *tracks.Session) *commands.Aggregate {
	src := &commands.Aggregate{}
	for _, p := range m {
		src.Sources = append(src.Sources, p.CommandsSource(sess))
	}
	return src
}

func (m *Main) SessionCommandHandler(ctx context.Context, w http.ResponseWriter, r *http.Request) *commands.HTTPHandler {
	sess := m.loadRequestSession(ctx, w, r)
	return &commands.HTTPHandler{Aggregate: sessionCommandSource(m.SessionCommandSources, sess.Session)}
}

func (m *Main) Serve(ctx context.Context) {
	m.sessions = make(map[string]*Session)

	// TODO change the client so we can make this a POST instead
	http.HandleFunc("GET /sessions/new", func(w http.ResponseWriter, r *http.Request) {
		sess := m.addSession(ctx, tracks.NewSession())
		http.Redirect(w, r, path.Join(m.basePath, "sessions", string(sess.ID)), http.StatusFound)
	})

	sessionHTMLHandler := serveWithBasePath(m.basePath, ui.Dir, "session.html")
	http.Handle("GET /sessions/{$}", sessionHTMLHandler)
	http.Handle("GET /sessions/{sessID}", sessionHTMLHandler)
	http.HandleFunc("REFLECT /sessions/{sessID}", func(w http.ResponseWriter, r *http.Request) {
		m.SessionCommandHandler(ctx, w, r).ServeHTTPReflect(w, r)
	})
	http.HandleFunc("POST /sessions/{sessID}", func(w http.ResponseWriter, r *http.Request) {
		m.SessionCommandHandler(ctx, w, r).ServeHTTPRun(w, r)
	})

	http.HandleFunc("GET /sessions/data", func(w http.ResponseWriter, r *http.Request) {
		m.serveSessionUpdates(ctx, w, r, nil)
	})
	http.HandleFunc("GET /sessions/{sessID}/sfu", func(w http.ResponseWriter, r *http.Request) {
		sess := m.loadRequestSession(ctx, w, r)
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Print("upgrade:", err)
			return
		}
		peer, err := sess.sfu.AddPeer(conn)
		if err != nil {
			log.Print("peer:", err)
			return
		}
		peer.HandleSignals()
	})
	http.HandleFunc("GET /sessions/{sessID}/data", func(w http.ResponseWriter, r *http.Request) {
		sess := m.loadRequestSession(ctx, w, r)
		m.serveSessionUpdates(ctx, w, r, sess)
	})
	http.HandleFunc("GET /sessions/{sessID}/text", func(w http.ResponseWriter, r *http.Request) {
		sess := m.loadRequestSession(ctx, w, r)
		m.serveSessionText(ctx, w, r, sess)
	})

	http.Handle("GET /webrtc/", http.StripPrefix("/webrtc", http.FileServer(http.FS(js.Dir))))
	http.Handle("GET /ui/", http.StripPrefix("/ui", http.FileServer(http.FS(ui.Dir))))
	// We need the trailing slash in order to go directly to the /sessions/
	// handler without an extra redirect, but path.Join strips it by default.
	http.Handle("GET /{$}", http.RedirectHandler(path.Join(m.basePath, "sessions")+"/", http.StatusFound))

	log.Printf("running on http://localhost:%d ...", m.port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", m.port), nil))
}
