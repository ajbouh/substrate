package substratehttp

import (
	"net/http"
	"log"

	"github.com/julienschmidt/httprouter"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/auth"
	"github.com/ajbouh/substrate/images/substrate/substrate"
)

func newUIHandler(sub *substrate.Substrate) ([]string, func(rw http.ResponseWriter, req *http.Request, p httprouter.Params), AllowOriginFunc) {
	var allowOriginFunc AllowOriginFunc
	var upstream http.Handler

	upstream = http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		sub.ProvisionerCache.ProvisionReverseProxy(&activityspec.ServiceSpawnRequest{
			ServiceName: "ui",
			URLPrefix: "/ui/",
		}).ServeHTTP(rw, req)
	})
	allowOriginFunc = func(origin string) bool {
		// panic("CORS origin check for UI backends not yet implemented")
		// TODO actually implement
		return true
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
