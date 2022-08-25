package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/julienschmidt/httprouter"

	"github.com/ajbouh/substrate/pkg/auth"
	"github.com/ajbouh/substrate/services/substrate"
)

func newUIHandler(sub *substrate.Substrate, gw *substrate.Gateway) ([]string, func(rw http.ResponseWriter, req *http.Request, p httprouter.Params), AllowOriginFunc) {
	var allowOriginFunc AllowOriginFunc
	var upstream http.Handler
	externalUIHandler := os.Getenv("EXTERNAL_UI_HANDLER")
	if externalUIHandler != "" {
		externalUIHandlerTarget, err := url.Parse(externalUIHandler)
		if err != nil {
			log.Fatalf("invalid EXTERNAL_UI_HANDLER %q: %w", externalUIHandler, err)
		}
		upstream = httputil.NewSingleHostReverseProxy(externalUIHandlerTarget)
		allowOriginFunc = func(origin string) bool {
			return origin == "http://"+externalUIHandlerTarget.Host
		}
	} else {

		uiLens := "ui"

		cacheKey := uiLens
		upstream = http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
			gw.ProvisionReverseProxy(cacheKey, func() substrate.ProvisionFunc {
				return sub.MakeProvisioner(func(fmt string, values ...any) {
					log.Printf(fmt+" cacheKey=%s", append(values, cacheKey)...)
				}, &substrate.SpawnRequest{
					ActivitySpec: substrate.ActivitySpecRequest{
						LensName: uiLens,
					},
				})
			}).ServeHTTP(rw, req)
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
