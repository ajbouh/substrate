package httpframework

import (
	"context"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
)

type MuxContributor interface {
	ContributeHTTP(mux *http.ServeMux)
}

type Middleware interface {
	WrapHTTP(next http.Handler) http.Handler
}

type Framework struct {
	ListenAddr string
	Listener   net.Listener

	Contributors []MuxContributor
	Middleware   []Middleware

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
	if err := f.s.Serve(f.Listener); err != nil {
		if err == http.ErrServerClosed {
			return
		}
		f.Log.Info("unexpected error while serving", "error", err)
	}
}

func (f *Framework) InitializeDaemon() error {
	if f.Log == nil {
		f.Log = slog.Default()
	}

	f.mux = http.NewServeMux()
	for _, c := range f.Contributors {
		c.ContributeHTTP(f.mux)
	}

	f.s = &http.Server{
		Handler: f,
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
