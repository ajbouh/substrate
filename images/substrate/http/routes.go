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
	"github.com/rs/cors"
)

type AllowOriginFunc func(origin string) bool

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
	router := http.NewServeMux()
	router.Handle("/substrate/{rest...}", cors.New(cors.Options{
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			// panic("CORS origin check not yet implemented")
			// TODO actually implement
			return true
		},
		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	}).Handler(h.newApiHandler()))

	// Use the referer to decide how to proxy requests for /favicon.ico
	router.Handle("GET /favicon.ico", http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
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
	}))

	router.Handle("GET /{$}", http.RedirectHandler("/ui/", http.StatusTemporaryRedirect))
	router.Handle("/{viewspec}/{rest...}", http.HandlerFunc(h.serveProxyRequest))

	h.router = router
}

func (m *Handler) ServeHTTP(rw http.ResponseWriter, rq *http.Request) {
	m.router.ServeHTTP(rw, rq)
}
