package auth

import (
	"context"
	"log"
	"net/http"
	"net/url"

	"github.com/julienschmidt/httprouter"

	"github.com/dghubble/gologin/v2"
	"github.com/dghubble/gologin/v2/github"
	"github.com/dghubble/sessions"
	"golang.org/x/oauth2"
	githubOAuth2 "golang.org/x/oauth2/github"
)

const (
	sessionUserKey  = "githubID"
	sessionUsername = "githubUsername"
)

type Auth struct {
	GithubClientID     string
	GithubClientSecret string
	GithubRedirectURL  string

	SessionName  string
	SessionStore sessions.Store[string]
	StateConfig  gologin.CookieConfig

	DefaultLoginRedirect  string
	DefaultLogoutRedirect string
}

type User struct {
	// GithubID       string
	GithubUsername string
}

var userContextKey = struct{}{}

func withUser(ctx context.Context, user *User) context.Context {
	return context.WithValue(ctx, userContextKey, user)
}

func UserFromContext(ctx context.Context) (*User, bool) {
	// HACK hardcode this
	return &User{
		GithubUsername: "nobody",
	}, true


	v := ctx.Value(userContextKey)
	if v != nil {
		user, ok := v.(*User)
		if ok {
			return user, true
		}
	}

	return nil, false
}

func (a *Auth) Protect(upstream http.Handler) http.Handler {
	router := httprouter.New()
	router.RedirectTrailingSlash = false
	router.HandleMethodNotAllowed = false
	router.RedirectFixedPath = false

	issueSession := http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		ctx := req.Context()
		githubUser, err := github.UserFromContext(ctx)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		session := a.SessionStore.New(a.SessionName)
		// session.Set(sessionUserKey, *githubUser.ID)
		session.Set(sessionUsername, *githubUser.Login)
		if err := session.Save(w); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// TODO read original redirect parameter
		http.Redirect(w, req, a.DefaultLoginRedirect, http.StatusFound)
	})

	oauth2Config := &oauth2.Config{
		ClientID:     a.GithubClientID,
		ClientSecret: a.GithubClientSecret,
		RedirectURL:  a.GithubRedirectURL,
		Endpoint:     githubOAuth2.Endpoint,
	}
	router.Handle("GET", "/auth/github/login", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		log.Printf("oauth2Config=%#v", oauth2Config)
		github.StateHandler(a.StateConfig, github.LoginHandler(oauth2Config, nil)).ServeHTTP(rw, req)
	})
	router.Handle("GET", "/auth/github/callback", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		github.StateHandler(a.StateConfig, github.CallbackHandler(oauth2Config, issueSession, nil)).ServeHTTP(rw, req)
	})
	router.Handle("POST", "/auth/logout", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		a.SessionStore.Destroy(rw, a.SessionName)
		http.Redirect(rw, req, a.DefaultLogoutRedirect, http.StatusFound)
	})

	router.NotFound = http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		log.Printf("%s %s %s", req.RemoteAddr, req.Method, req.URL.Path)

		cookie := req.Header.Get("Cookie")
		log.Printf("cookie=%s", cookie)

		session, err := a.SessionStore.Get(req, a.SessionName)
		if err != nil {
			log.Printf("%s %s %s err=%s", req.RemoteAddr, req.Method, req.URL.Path, err)
			redirect, _ := url.Parse("/auth/github/login")
			redirectQuery := redirect.Query()
			redirectQuery.Add("redirect", req.URL.Path)
			redirect.RawQuery = redirectQuery.Encode()

			// If we're going to redirect, we must be careful to set content-type ahead of time, otherwise golang sends a 406 if accept doesn't accept text/html
			accept := req.Header.Get("Accept")
			if accept != "" {
				rw.Header().Set("Content-Type", accept)
			}

			log.Printf("accept=%s", accept)

			http.Redirect(rw, req, redirect.String(), http.StatusTemporaryRedirect)
			return
		}

		req = req.WithContext(withUser(req.Context(), &User{
			// GithubID:       session.Get(sessionUserKey),
			GithubUsername: session.Get(sessionUsername),
		}))

		upstream.ServeHTTP(rw, req)
	})

	return router
}
