package httpframework

import (
	"context"
	"net/http"
	"net/url"
	"strings"
)

type MiddlewareFuncAdapter func(next http.Handler) http.Handler

func (f MiddlewareFuncAdapter) WrapHTTP(next http.Handler) http.Handler {
	return f(next)
}

type contextKey string

var prefixKey = contextKey("prefix")

func ContextPrefix(ctx context.Context) string {
	v, ok := ctx.Value(prefixKey).(string)
	if ok {
		return v
	}
	return ""
}

// StripPrefix returns a handler that serves HTTP requests by removing the
// given prefix from the request URL's Path (and RawPath if set) and invoking
// the handler h. StripPrefix handles a request for a path that doesn't begin
// with prefix by replying with an HTTP 404 not found error. The prefix must
// match exactly: if the prefix in the request contains escaped characters
// the reply is also an HTTP 404 not found error.
type StripPrefix struct {
	Prefix string
}

func WithPrefix(ctx context.Context, prefix string) context.Context {
	if prefix == "" {
		return ctx
	}

	return context.WithValue(ctx, prefixKey, prefix)
}

func (m *StripPrefix) WithContext(ctx context.Context) context.Context {
	return WithPrefix(ctx, m.Prefix)
}

func (m *StripPrefix) WrapHTTP(next http.Handler) http.Handler {
	if m.Prefix == "" {
		return next
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		p := strings.TrimPrefix(r.URL.Path, m.Prefix)
		rp := strings.TrimPrefix(r.URL.RawPath, m.Prefix)
		if len(p) < len(r.URL.Path) && (r.URL.RawPath == "" || len(rp) < len(r.URL.RawPath)) {
			r2 := new(http.Request)
			*r2 = *r.WithContext(context.WithValue(r.Context(), prefixKey, m.Prefix))
			r2.URL = new(url.URL)
			*r2.URL = *r.URL
			r2.URL.Path = p
			r2.URL.RawPath = rp
			next.ServeHTTP(w, r2)
		} else {
			http.NotFound(w, r)
		}
	})
}
