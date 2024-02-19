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

	apiHandler0 := cors.New(cors.Options{
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			// panic("CORS origin check not yet implemented")
			// TODO actually implement
			return true
		},
		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	}).Handler(newApiHandler(s))

	apiHandler := func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		apiHandler0.ServeHTTP(rw, req)
	}
	for _, method := range methods {
		router.Handle(method, "/substrate/*rest", apiHandler)
	}

	// HACK For temporary backwards compatibility.... redirect /gw/* to just /*.
	// This redirect is safe to remove after 2024-02-20. That should give everyone enough time to adjust.
	router.Handle("GET", "/gw/*rest", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		rest := p.ByName("rest")
		http.Redirect(rw, req, rest, http.StatusTemporaryRedirect)
	})

	router.Handle("GET", "/", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		http.Redirect(rw, req, "/ui/", http.StatusTemporaryRedirect)
	})

	gwRouter := httprouter.New()

	// router.Handle("GET", "/@fs/*rest", handler) // HACK for SvelteKit

	// Force trailing / so that relative paths work.
	for _, method := range methods {
		gwRouter.Handle(method, "/:viewspec", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
			viewspec := p.ByName("viewspec")
			location := "/" + viewspec + "/"
			if req.URL.RawQuery != "" {
				location += "?" + req.URL.RawQuery
			}

			http.Redirect(rw, req, location, http.StatusTemporaryRedirect)
		})
	}

	routes, handler := newLazyProxyHandler(s, apiHandler0)
	for _, route := range routes {
		for _, method := range methods {
			gwRouter.Handle(method, route, handler)
		}
	}

	router.NotFound = gwRouter

	return router
}
