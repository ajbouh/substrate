package httpframework

import (
	"log/slog"
	"net/http"
	"time"
)

type RequestLogger struct {
	Log *slog.Logger
}

func (l *RequestLogger) WrapHTTP(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		l.Log.Info("request", "remoteaddr", r.RemoteAddr, "method", r.Method, "url", r.URL.String(), "dur", time.Since(start))
	})
}
