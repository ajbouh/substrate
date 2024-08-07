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
	"github.com/ajbouh/substrate/images/substrate/httputil"
)

func (h *Handler) serveProxyRequest(rw http.ResponseWriter, req *http.Request) {
	// log.Printf("Handler serveProxyRequest %#v", h)
	// log.Printf("%s %s %s", req.RemoteAddr, req.Method, req.URL.String())
	start := time.Now()
	defer func() {
		slog.Info("request", "remoteaddr", req.RemoteAddr, "method", req.Method, "url", req.URL.String(), "dur", time.Since(start))
	}()

	viewspec := req.PathValue("viewspec")
	rest := req.PathValue("rest")

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

	// Redirect to spec without ()s.
	if activityspec.IsLegacyServiceSpawnRequestFormat(viewspec) {
		views, path, err := activityspec.ParseLegacyServiceSpawnRequest(viewspec, false, "/"+viewspec)
		if err != nil {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, err)
			return
		}
		modern := views.CanonicalFormat
		http.RedirectHandler("/"+modern+path+rest, http.StatusFound).ServeHTTP(rw, req)
		return
	}

	views, path, err := activityspec.ParseServiceSpawnRequest(viewspec, false, "/"+viewspec)
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
		concrete, err = defSet.IsConcrete(views)
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
		http.RedirectHandler("/"+concretized+path+rest, http.StatusFound).ServeHTTP(rw, req)
		return
	}

	h.ProvisionerCache.ServeProxiedHTTP(views, rw, req)
}
