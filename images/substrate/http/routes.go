package substratehttp

import (
	"log"
	"net/http"
	"net/url"
	"strings"

	substratedb "github.com/ajbouh/substrate/images/substrate/db"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
	"github.com/ajbouh/substrate/pkg/toolkit/exports"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
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
	"REFLECT",
}

type Handler struct {
	router http.Handler

	InternalSubstrateOrigin string
	User                    string

	ExportsAnnouncer *httpevents.EventStream[exports.Exports]

	DefsAnnouncer *httpevents.EventStream[*defset.DefSet]
	DB            *substratedb.DB

	DefSetLoader     notify.Loader[*defset.DefSet]
	Spawner          provisioner.Spawner
	Driver           provisioner.Driver
	ProvisionerCache *provisioner.Cache
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

	router.Handle("GET", "/favicon.ico", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		if req.Header.Get("Referer") == "" {
			log.Printf("no referer for %s request; returning 404", req.URL)
			http.Error(rw, "not found", http.StatusNotFound)
			return
		}
		referer, err := url.Parse(req.Header.Get("Referer"))
		if err != nil {
			log.Printf("malformed url referer for %s request; returning 404: %s", req.URL, err)
			http.Error(rw, "not found", http.StatusNotFound)
			return
		}
		service, _, ok := strings.Cut(referer.Path[1:], "/")
		if ok {
			location := "/" + service + req.URL.Path
			if req.URL.RawQuery != "" {
				location += "?" + req.URL.RawQuery
			}
			http.Redirect(rw, req, location, http.StatusTemporaryRedirect)
			return
		}

		log.Printf("no obvious service in referer %q for %s request; returning 404: %s", referer, req.URL, err)
		http.Error(rw, "not found", http.StatusNotFound)
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
