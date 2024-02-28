package substratehttp

import (
	"net/http"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	substratedb "github.com/ajbouh/substrate/images/substrate/db"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/pkg/cueloader"
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

type Handler struct {
	router http.Handler

	InternalSubstrateOrigin string
	User                    string

	DefsAnnouncer *cueloader.Announcer
	DB            *substratedb.DB

	CurrentDefSet    defset.CurrentDefSet
	Driver           activityspec.ProvisionDriver
	ProvisionerCache *activityspec.ProvisionerCache
}

func (h *Handler) Initialize() {
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
	}).Handler(h.newApiHandler())

	for _, method := range methods {
		router.Handle(method, "/substrate/*rest", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
			apiHandler0.ServeHTTP(rw, req)
		})
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

	for _, method := range methods {
		gwRouter.Handle(method, "/:viewspec/*rest", h.serveProxyRequest)
	}

	router.NotFound = gwRouter

	h.router = router
}

func (m *Handler) ServeHTTP(rw http.ResponseWriter, rq *http.Request) {
	m.router.ServeHTTP(rw, rq)
}
