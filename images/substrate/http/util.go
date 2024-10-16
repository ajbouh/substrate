package substratehttp

import (
	"net/http"
	"strings"

	"github.com/ajbouh/substrate/images/substrate/httputil"
)

func stringPtr(s string) *string {
	return &s
}

func handle[T any](mux *http.ServeMux, route string, f func(req *http.Request) (T, int, error)) {
	mux.Handle(route, http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		jsonrw := httputil.NewJSONResponseWriter(rw)
		jsonrw(f(req))
	}))
}

func urlPathEscape(s string) string {
	return strings.ReplaceAll(s, "/", "%2F")
}
