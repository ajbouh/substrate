package substratehttp

import (
	"net/http"

	"github.com/ajbouh/substrate/images/substrate/substrate"
	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
)

type AllowOriginFunc func(origin string) bool

var methods []string = []string{
	"GET",
	"DELETE",
	"PUT",
	"PATCH",
	"POST",
	"HEAD",
	"OPTIONS",
}

func NewHTTPHandler(s *substrate.Substrate) http.Handler {
	router := httprouter.New()

	routes, handler, allowOriginFunc := newUIHandler(s)
	router.Handle("GET", "/@fs/*rest", handler) // HACK for SvelteKit
	for _, uiRoute := range routes {
		for _, method := range methods {
			router.Handle(method, uiRoute, handler)
		}
	}

	apiHandler0 := cors.New(cors.Options{
		AllowCredentials: true,
		AllowOriginFunc:  allowOriginFunc,
		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	}).Handler(newApiHandler(s))
	apiHandler := func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		apiHandler0.ServeHTTP(rw, req)
	}
	for _, method := range methods {
		router.Handle(method, "/api/*rest", apiHandler)
	}

	// Force trailing / so that relative paths work.
	for _, method := range methods {
		router.Handle(method, "/gw/:viewspec", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
			viewspec := p.ByName("viewspec")
			http.Redirect(rw, req, "/gw/"+viewspec+"/", http.StatusTemporaryRedirect)
		})
	}

	routes, handler = newLazyProxyHandler(s, apiHandler0)
	for _, route := range routes {
		for _, method := range methods {
			router.Handle(method, route, handler)
		}
	}

	routes, handler = newBlackboardHandler(s)
	for _, route := range routes {
		for _, method := range methods {
			router.Handle(method, route, handler)
		}
	}

	router.Handle("GET", "/", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		http.Redirect(rw, req, "/ui/", http.StatusTemporaryRedirect)
	})

	return router
}
