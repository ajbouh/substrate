package httpframework

import (
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
	if !c.Match(req) {
		return c.Fallback.Do(req)
	}

	h, _ := c.Mux.Handler(req)
	for _, m := range c.Middleware {
		h = m.WrapHTTP(h)
	}

	res := httptest.NewRecorder()
	h.ServeHTTP(res, req)
	return res.Result(), nil
}
