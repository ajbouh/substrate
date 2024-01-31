package substratehttp

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/julienschmidt/httprouter"

	"github.com/ajbouh/substrate/pkg/activityspec"
	"github.com/ajbouh/substrate/pkg/auth"
	"github.com/ajbouh/substrate/pkg/httputil"
	"github.com/ajbouh/substrate/pkg/substrate"
)

func newLazyProxyHandler(sub *substrate.Substrate, api http.Handler) ([]string, func(rw http.ResponseWriter, req *http.Request, p httprouter.Params)) {
	return []string{"/gw/:viewspec/*rest"}, func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		log.Printf("%s %s %s", req.RemoteAddr, req.Method, req.URL.String())

		viewspec := p.ByName("viewspec")
		if viewspec == "substrate" {
			api.ServeHTTP(rw, req)
			return
		}

		user, ok := auth.UserFromContext(req.Context())
		if !ok {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, fmt.Errorf("user not available in context"))
			return
		}

		rest := p.ByName("rest")

		cookies := req.Cookies()
		req.Header.Del("Cookie")

		// TODO check entitlements and only put cookies back if we *must*
		for _, cookie := range cookies {
			if cookie.Domain == "" { // constrain cookie to the given host
				cookie.Domain = req.Host
			}

			s := cookie.String()
			fmt.Printf("keeping cookie: %s\n", s)
			req.Header.Add("Set-Cookie", s)
		}
		fmt.Printf("req.header: %#v", req.Header)

		// Strip prefix
		req.Host = ""
		req.URL.Path = "/" + strings.TrimPrefix(rest, "/")
		if sub.Origin != "" {
			req.URL.RawQuery = strings.ReplaceAll(req.URL.RawQuery, "$origin", url.QueryEscape(sub.Origin))
			req.URL.Path = strings.ReplaceAll(req.URL.Path, "$origin", url.PathEscape(sub.Origin))
		}
		req.URL.RawPath = ""

		views, err := activityspec.ParseActivitySpecRequest(viewspec, false)
		if err != nil {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, err)
			return
		}

		views.User = user.GithubUsername
		views.ServiceSpawnRequest.User = user.GithubUsername
		sub.ProvisionerCache.ProvisionReverseProxy(&views.ServiceSpawnRequest).ServeHTTP(rw, req)
	}
}
