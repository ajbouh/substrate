package httpframework

import (
	"context"
	"crypto/tls"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
)

type MuxContributor interface {
	ContributeHTTP(ctx context.Context, mux *http.ServeMux)
}

type Middleware interface {
	WrapHTTP(next http.Handler) http.Handler
}

type ConnState interface {
	HTTPConnState(net.Conn, http.ConnState)
}

type TLSConfig interface {
	FrameworkTLSConfig() (*tls.Config, error)
}

type Framework struct {
	ListenAddr string
	Listener   net.Listener

	Contributors []MuxContributor
	Middleware   []Middleware

	ConnState []ConnState
	TLSConfig TLSConfig

	Log *slog.Logger

	s   *http.Server
	mux *http.ServeMux
}

func (f *Framework) Addr() net.Addr {
	return f.Listener.Addr()
}

func FmtListenAddr(host, port string) string {
	if host == "" {
		host = "0.0.0.0"
	}
	if port == "" {
		port = "0"
	}
	return fmt.Sprintf("%s:%s", host, port)
}

func (f *Framework) Serve(ctx context.Context) {
	f.Log.Info("http at", "url", "http://"+f.Addr().String())

	if f.s.BaseContext == nil {
		f.s.BaseContext = func(l net.Listener) context.Context {
			return ctx
		}
	}

	if f.s.TLSConfig == nil {
		if err := f.s.Serve(f.Listener); err != nil {
			if err == http.ErrServerClosed {
				return
			}
			f.Log.Info("unexpected error while serving", "error", err)
		}
	} else {
		if err := f.s.ServeTLS(f.Listener, "", ""); err != nil {
			if err == http.ErrServerClosed {
				return
			}
			f.Log.Info("unexpected error while serving with tls", "error", err)
		}
	}
}

func (f *Framework) InitializeDaemon() error {
	ctx := context.Background()
	for _, m := range f.Middleware {
		if wrap, ok := m.(interface {
			WithContext(ctx context.Context) context.Context
		}); ok {
			ctx = wrap.WithContext(ctx)
		}
	}

	f.mux = http.NewServeMux()
	for _, c := range f.Contributors {
		f.Log.Info("adding handlers", "contributortype", fmt.Sprintf("%T", c), "contributor", c)
		c.ContributeHTTP(ctx, f.mux)
	}

	f.s = &http.Server{
		Handler: f,
		ConnState: func(c net.Conn, cs http.ConnState) {
			for _, fn := range f.ConnState {
				fn.HTTPConnState(c, cs)
			}
		},
	}

	if f.TLSConfig != nil {
		cfg, err := f.TLSConfig.FrameworkTLSConfig()
		if err != nil {
			return err
		}
		f.s.TLSConfig = cfg
	}

	if f.Listener == nil {
		if f.ListenAddr == "" {
			f.ListenAddr = FmtListenAddr(os.Getenv("HOST"), os.Getenv("PORT"))
		}

		var err error
		f.Listener, err = net.Listen("tcp", f.ListenAddr)
		if err != nil {
			return err
		}
	}

	return nil
}

func (f *Framework) TerminateDaemon(ctx context.Context) error {
	return f.s.Shutdown(ctx)
}

func (f *Framework) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var h http.Handler
	h = f.mux
	for _, m := range f.Middleware {
		h = m.WrapHTTP(h)
	}
	h.ServeHTTP(w, r)
}
