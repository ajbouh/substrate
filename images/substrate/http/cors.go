package substratehttp

import (
	"net/http"

	"github.com/rs/cors"
)

type CORSMiddleware struct {
	Options cors.Options
}

func (m *CORSMiddleware) WrapHTTP(next http.Handler) http.Handler {
	return cors.New(m.Options).Handler(next)
}
