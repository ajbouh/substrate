package substratehttp

import (
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/images/substrate/httputil"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type ProxyHandler struct {
	InternalSubstrateOrigin string
	User                    string

	SpaceViewResolver activityspec.SpaceViewResolver
	DefSetLoader      notify.Loader[*defset.DefSet]
	ProvisionerCache  *provisioner.Cache
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
	mux.Handle("/{viewspec}/{rest...}", h)
}

func (h *ProxyHandler) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	// log.Printf("Handler serveProxyRequest %#v", h)
	// log.Printf("%s %s %s", req.RemoteAddr, req.Method, req.URL.String())
	start := time.Now()

	viewspec := req.PathValue("viewspec")
	rest := req.PathValue("rest")

	defer func() {
		slog.Info("request", "remoteaddr", req.RemoteAddr, "method", req.Method, "url", req.URL.String(), "viewspec", viewspec, "rest", rest, "dur", time.Since(start))
	}()

	cookies := req.Cookies()
	req.Header.Del("Cookie")

	// TODO check entitlements and only put cookies back if we *must*
	for _, cookie := range cookies {
		// if cookie.Domain == "" { // constrain cookie to the given host
		// 	cookie.Domain = req.Host
		// }

		s := cookie.String()
		log.Printf("keeping cookie: %s\n", s)
		req.Header.Add("Set-Cookie", s)
	}
	// fmt.Printf("req.header: %#v", req.Header)

	// Strip prefix
	req.Host = ""
	req.URL.Path = "/" + strings.TrimPrefix(rest, "/")
	if h.InternalSubstrateOrigin != "" {
		req.URL.RawQuery = strings.ReplaceAll(req.URL.RawQuery, "$origin", url.QueryEscape(h.InternalSubstrateOrigin))
		req.URL.Path = strings.ReplaceAll(req.URL.Path, "$origin", h.InternalSubstrateOrigin)
	}
	req.URL.RawPath = ""

	views, err := activityspec.ParseServiceSpawnRequest(viewspec, false, "/"+urlPathEscape(viewspec))
	if err != nil {
		jsonrw := httputil.NewJSONResponseWriter(rw)
		jsonrw(nil, http.StatusBadRequest, err)
		return
	}
	views.User = h.User

	defSet := h.DefSetLoader.Load()
	seemsConcrete := views.SeemsConcrete
	concrete := seemsConcrete
	if seemsConcrete {
		concrete, err = defSet.IsConcrete(h.SpaceViewResolver, views)
		if err != nil {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, err)
			return
		}
	}
	if !concrete {
		entry, err := h.ProvisionerCache.Ensure(req.Context(), views)
		if err != nil {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusInternalServerError, err)
			return
		}

		gen := entry.Generation()
		ssr := gen.ServiceSpawnResponse()
		if ssr == nil {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusInternalServerError, fmt.Errorf("gone before resolution"))
			return
		}

		concretized, _ := ssr.ServiceSpawnResolution.Format()
		http.RedirectHandler("/"+concretized+"/"+rest, http.StatusFound).ServeHTTP(rw, req)
		return
	}

	h.ProvisionerCache.ServeProxiedHTTP(views, rw, req)
}
