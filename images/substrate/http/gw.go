package substratehttp

import (
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/ajbouh/substrate/images/substrate/provisioner"
)

type ProxyHandler struct {
	ProvisionerCache *provisioner.Cache
}

func (h *ProxyHandler) ContributeHTTP(mux *http.ServeMux) {
	// Use the referer to decide how to proxy requests for /favicon.ico
	mux.Handle("GET /favicon.ico", http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
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

	mux.Handle("GET /{$}", http.RedirectHandler("/ui/", http.StatusTemporaryRedirect))
	mux.Handle("/{viewspec}/{rest...}", h.ProvisionerCache)
}
