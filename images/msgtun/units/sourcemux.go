package units

import (
	"context"
	"log/slog"
	"net/http"
	"sync"

	"golang.org/x/net/websocket"
	"tractor.dev/toolkit-go/duplex/codec"
	"tractor.dev/toolkit-go/duplex/fn"
	"tractor.dev/toolkit-go/duplex/mux"
	"tractor.dev/toolkit-go/duplex/rpc"
	"tractor.dev/toolkit-go/duplex/talk"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/links"

	"github.com/oklog/ulid/v2"
)

// SourceMux accepts incoming websocket connections and re-announces commands available in them
// for discovery and use. Each registered websocket gets its own ID and is available as a "link" from the
// top level.
type SourceMux struct {
	Sources map[string]*DuplexSource
	mu      sync.Mutex

	Debug bool

	prefix string
}

var _ commands.Source = (*SourceMux)(nil)
var _ handle.HTTPResourceReflect = (*SourceMux)(nil)
var _ RegisterV1 = (*SourceMux)(nil)
var _ httpframework.MuxContributor = (*SourceMux)(nil)
var _ links.Querier = (*SourceMux)(nil)

func (h *SourceMux) lookup(id string) (commands.Source, bool) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if h.Sources == nil {
		return nil, false
	}

	r, ok := h.Sources[id]
	return r, ok
}

func (h *SourceMux) set(id string, r *DuplexSource) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if h.Sources == nil {
		h.Sources = map[string]*DuplexSource{}
	}

	h.Sources[id] = r
}

func (s *SourceMux) RegisterV1(r rpc.Responder, call *rpc.Call) {
	var rreq RegistrationV1Request
	err := call.Receive(&rreq)
	if err != nil {
		slog.Info("SourceMux.RegisterV1 Receive error", "err", err)
		return
	}

	id := rreq.ID
	if id == "" {
		id = "id-" + ulid.Make().String()
	}

	slog.Info("SourceMux.RegisterV1", "rreq", rreq)

	rres := RegistrationV1Response{
		ID:  id,
		URL: s.prefix + "/id/" + id,
	}
	s.set(id, &DuplexSource{
		RegistrationV1Response: rres,
		RegistrationV1Request:  rreq,
		Caller:                 call.Caller,
	})

	err = r.Return(&rres)
	if err != nil {
		slog.Info("SourceMux.RegisterV1 Return error", "err", err)
		return
	}
}

func (h *SourceMux) GetHTTPResourceReflectPath() string {
	return "/id/{id}"
}

func (h *SourceMux) GetHTTPPattern() string {
	return "POST /id/{id}"
}

func (h *SourceMux) GetHTTPHandler() http.Handler {
	return handle.RunnerHandler(h.Debug, &commands.DynamicRunner{
		Runners: func(ctx context.Context) []commands.Runner {
			return []commands.Runner{h}
		},
	})

}

func (h *SourceMux) Reflect(ctx context.Context) (commands.DefIndex, error) {
	pv := handle.ContextPathValuer(ctx)
	id := pv.PathValue("id")
	if id == "" {
		return nil, commands.ErrReflectNotSupported
	}

	s, ok := h.lookup(id)
	if !ok {
		return nil, commands.ErrReflectNotSupported
	}

	def, err := s.Reflect(ctx)
	if err != nil {
		return nil, err
	}

	def = commands.TranformDefIndex(ctx, def, handle.EnsureHTTPBasis("POST", "/id/"+id))
	return def, nil
}

func (h *SourceMux) Run(ctx context.Context, name string, p commands.Fields) (commands.Fields, error) {
	pv := handle.ContextPathValuer(ctx)
	id := pv.PathValue("id")
	if id == "" {
		return nil, commands.ErrNoSuchCommand
	}

	s, ok := h.lookup(id)
	if !ok {
		return nil, commands.ErrNoSuchCommand
	}

	return s.Run(ctx, name, p)
}

func (h *SourceMux) QueryLinks(ctx context.Context) (links.Links, error) {
	h.mu.Lock()
	defer h.mu.Unlock()

	l := links.Links{}
	for id, source := range h.Sources {
		l[id] = links.Link{
			Rel:  "tunnel",
			HREF: source.RegistrationV1Response.URL,
		}
	}
	return l, nil
}

func (h *SourceMux) ContributeHTTP(ctx context.Context, mx *http.ServeMux) {
	h.prefix = httpframework.ContextPrefix(ctx)

	mx.Handle("/ws", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		wsh := websocket.Handler(func(conn *websocket.Conn) {
			conn.PayloadType = websocket.BinaryFrame
			sess := mux.New(conn)
			defer sess.Close()

			peer := talk.NewPeer(sess, codec.CBORCodec{})
			peer.Handle("tun/", fn.HandlerFrom[RegisterV1](h))
			peer.Respond()
		})

		slog.Info("wsh pre", "req", r)
		defer slog.Info("wsh done", "req", r)
		wsh.ServeHTTP(w, r)
	}))
}
