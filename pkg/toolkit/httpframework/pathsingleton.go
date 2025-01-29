package httpframework

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
)

type ResolveError struct {
	Handler http.Handler
}

func (e *ResolveError) Error() string {
	return fmt.Sprintf("ResolveError: %T: %#v", e.Handler, e.Handler)
}

var bespokeCacheMissHandler = contextKey("bespoke-cache-miss-handler")

func WithBespokeCacheMissHandler(ctx context.Context, handler http.Handler) context.Context {
	return context.WithValue(ctx, bespokeCacheMissHandler, handler)
}

func BespokeCacheMissHandler(ctx context.Context) http.Handler {
	value := ctx.Value(bespokeCacheMissHandler)
	if value == nil {
		return nil
	}
	handler, _ := value.(http.Handler)
	return handler
}

type PathSingletonMux[H http.Handler] struct {
	entries *OnceMap[H]

	ctx context.Context

	RequestKey func(r *http.Request) (string, context.Context, error)
	KeyHandler func(ctx context.Context, k string) (H, error)

	Log *slog.Logger
}

func (r *PathSingletonMux[H]) Initialize() {
	r.entries = NewOnceMap[H]()
}

func (r *PathSingletonMux[H]) Serve(ctx context.Context) {
	r.ctx = ctx
}

func (r *PathSingletonMux[H]) Size() int {
	return r.entries.Size()
}

func (r *PathSingletonMux[H]) Range(f func(k string, h H) bool) {
	r.entries.Range(f)
}

func (r *PathSingletonMux[H]) Peek(k string) H {
	v, _ := r.entries.Load(k)
	return v
}

func (r *PathSingletonMux[H]) Remove(k string) H {
	h, _ := r.entries.LoadAndDelete(k)
	return h
}

func (r *PathSingletonMux[H]) TryStore(k string, h H) (H, bool) {
	return r.entries.LoadOrStore(k, h)
}

func (r *PathSingletonMux[H]) Load(ctx context.Context, k string) (H, error) {
	return r.entries.LoadOrCompute(k, func() (H, error) {
		bespoke := BespokeCacheMissHandler(ctx)
		if bespoke != nil {
			return *new(H), &ResolveError{
				Handler: bespoke,
			}
		}
		return r.KeyHandler(ctx, k)
	})
}

func (r *PathSingletonMux[H]) ServeHTTP(w http.ResponseWriter, rq *http.Request) {
	var h H
	k, ctx, err := r.RequestKey(rq)
	if err == nil {
		h, err = r.Load(ctx, k)
	}

	if err != nil {
		var pe = new(ResolveError)
		if errors.As(err, &pe) {
			pe.Handler.ServeHTTP(w, rq)
			return
		}

		http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusBadRequest)
		return
	}

	h.ServeHTTP(w, rq)
}
