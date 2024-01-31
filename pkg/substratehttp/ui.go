package substratehttp

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/julienschmidt/httprouter"

	"github.com/ajbouh/substrate/pkg/activityspec"
	"github.com/ajbouh/substrate/pkg/auth"
	"github.com/ajbouh/substrate/pkg/substrate"
)

func newUIHandler(sub *substrate.Substrate) ([]string, func(rw http.ResponseWriter, req *http.Request, p httprouter.Params), AllowOriginFunc) {
	var allowOriginFunc AllowOriginFunc
	var upstream http.Handler
	externalUIHandler := os.Getenv("EXTERNAL_UI_HANDLER")
	if externalUIHandler != "" {
		externalUIHandlerTarget, err := url.Parse(externalUIHandler)
		if err != nil {
			log.Fatalf("invalid EXTERNAL_UI_HANDLER %q: %s", externalUIHandler, err)
		}
		upstream = httputil.NewSingleHostReverseProxy(externalUIHandlerTarget)
		allowOriginFunc = func(origin string) bool {
			return origin == "http://"+externalUIHandlerTarget.Host
		}
	} else {

		upstream = http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
			sub.ProvisionReverseProxy(&activityspec.ServiceSpawnRequest{ServiceName: "ui"}).ServeHTTP(rw, req)
		})
		allowOriginFunc = func(origin string) bool {
			// panic("CORS origin check for UI backends not yet implemented")
			// TODO actually implement
			return true
		}
	}

	return []string{"/ui", "/ui/*rest"},
		func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
			log.Printf("%s %s %s", req.RemoteAddr, req.Method, req.URL.String())

			// We are keeping the leading /ui for simplicity...
			req.Host = ""
			if user, ok := auth.UserFromContext(req.Context()); ok {
				req.Header.Set("Substrate-Github-Username", user.GithubUsername)
			}
			upstream.ServeHTTP(rw, req)
		}, allowOriginFunc
}
