package substratehttp

import (
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/julienschmidt/httprouter"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/httputil"
)

func (h *Handler) serveProxyRequest(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
	log.Printf("Handler serveProxyRequest %#v", h)
	log.Printf("%s %s %s", req.RemoteAddr, req.Method, req.URL.String())

	viewspec := p.ByName("viewspec")
	rest := p.ByName("rest")

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
		modern, _ := views.Format()
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

	defSet := h.CurrentDefSet.CurrentDefSet()
	_, seemsConcrete := views.Format()
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
		serviceSpawnResponse, err := defSet.SpawnService(req.Context(), h.Driver, views)
		if err != nil {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusInternalServerError, err)
			return
		}

		concretized, _ := serviceSpawnResponse.ServiceSpawnResolution.Format()
		http.RedirectHandler("/"+concretized+path+rest, http.StatusFound).ServeHTTP(rw, req)
		return
	}

	h.ProvisionerCache.ProvisionReverseProxy(views).ServeHTTP(rw, req)
}
