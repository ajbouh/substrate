package httpframework

import (
	"context"
	"net/http"
)

type Route struct {
	Route   string
	Routes  []string
	Handler http.Handler
}

func (c *Route) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	if c.Route != "" {
		mux.Handle(c.Route, c.Handler)
	}

	for _, route := range c.Routes {
		mux.Handle(route, c.Handler)
	}
}
