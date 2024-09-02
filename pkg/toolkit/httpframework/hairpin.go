package httpframework

import (
	"log/slog"
	"net/http"
	"net/http/httptest"
)

type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

type HairpinHTTPClient struct {
	Mux        *http.ServeMux
	Middleware []Middleware
	Match      func(r *http.Request) bool

	Fallback HTTPClient
}

func (c *HairpinHTTPClient) Initialize() {
	if c.Fallback == nil {
		c.Fallback = http.DefaultClient
	}
}

func (c *HairpinHTTPClient) ContributeHTTP(m *http.ServeMux) {
	if c.Mux == nil {
		c.Mux = m
	}
}

func (c *HairpinHTTPClient) Do(req *http.Request) (*http.Response, error) {
	match := c.Match(req)
	slog.Info("HairpinHTTPClient.Do()", "method", req.Method, "url", req.URL.String(), "path", req.URL.Path, "host", req.URL.Host, "match", match)
	if !match {
		return c.Fallback.Do(req)
	}

	var h http.Handler = c.Mux
	for _, m := range c.Middleware {
		h = m.WrapHTTP(h)
	}

	res := httptest.NewRecorder()
	h.ServeHTTP(res, req)
	return res.Result(), nil
}
