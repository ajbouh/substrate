package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/ajbouh/substrate/pkg/auth"
	"github.com/ajbouh/substrate/services/substrate"
	"github.com/dghubble/gologin/v2"
	"github.com/dghubble/sessions"
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
}

func newHTTPHandler(s *substrate.Substrate) http.Handler {
	router := httprouter.New()

	gw := substrate.NewGateway()

	previewHandler := newPreviewHandler(s, gw)
	router.Handle("GET", "/preview/*rest", previewHandler)

	uiRoutes, uiHandler, allowOriginFunc := newUIHandler(s, gw)
	router.Handle("GET", "/@fs/*rest", uiHandler) // HACK for SvelteKit
	for _, uiRoute := range uiRoutes {
		for _, method := range methods {
			router.Handle(method, uiRoute, uiHandler)
		}
	}

	apiHandler0 := cors.New(cors.Options{
		AllowCredentials: true,
		AllowOriginFunc:  allowOriginFunc,
		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	}).Handler(newApiHandler(s))
	apiHandler := func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		apiHandler0.ServeHTTP(rw, req)
	}
	for _, method := range methods {
		router.Handle(method, "/api/*rest", apiHandler)
	}

	proxyRoutes, lazyProxyHandler := newLazyProxyHandler(s, gw, apiHandler0)
	for _, route := range proxyRoutes {
		for _, method := range methods {
			router.Handle(method, route, lazyProxyHandler)
		}
	}

	// router.Handle("GET", "/", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
	// 	http.Redirect(rw, req, "/ui/", http.StatusTemporaryRedirect)
	// })

	githubRedirectURL := s.Origin + "/auth/github/callback"
	fmt.Printf("Origin=%s\n", githubRedirectURL)

	return (&auth.Auth{
		GithubClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		GithubClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		GithubRedirectURL:  githubRedirectURL,

		SessionName: "substrate-github-app",
		SessionStore: sessions.NewCookieStore[string](
			sessions.DefaultCookieConfig,
			// sessions.DebugCookieConfig,
			[]byte(mustGetenv("SESSION_SECRET")),
			nil,
		),
		// state param cookies require HTTPS by default; disable for localhost development
		// StateConfig: gologin.DebugOnlyCookieConfig,
		StateConfig: gologin.CookieConfig{
			Name:     "gologin-temporary-cookie",
			Path:     "/",
			MaxAge:   600, // 10 min
			HTTPOnly: true,
			Secure:   true, // HTTPS only
			SameSite: http.SameSiteLaxMode,
		},

		DefaultLoginRedirect:  "/ui/",
		DefaultLogoutRedirect: "/auth/github/login",
	}).Protect(router)

}
