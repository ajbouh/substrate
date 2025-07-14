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
		logreq := r
		if origreq := ContextOriginalRequest(r.Context()); origreq != nil {
			logreq = origreq
		}
		start := time.Now()
		next.ServeHTTP(w, r)
		l.Log.Info("request", "remoteaddr", logreq.RemoteAddr, "method", logreq.Method, "url", logreq.URL.String(), "dur", time.Since(start))
	})
}
