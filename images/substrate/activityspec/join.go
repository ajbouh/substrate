package activityspec

import (
	"net/http"
	"net/url"
	"strings"
)

func MakeJoiner(target *url.URL, token *string) AuthenticatedURLJoinerFunc {
	return func(rest *url.URL, mode ProvisionerAuthenticationMode) (*url.URL, http.Header) {
		var u url.URL
		if rest != nil {
			u = *rest
			targetQuery := target.RawQuery
			u.Scheme = target.Scheme
			u.Host = target.Host
			u.Path, u.RawPath = joinURLPath(target, &u)
			if targetQuery == "" || u.RawQuery == "" {
				u.RawQuery = targetQuery + u.RawQuery
			} else {
				u.RawQuery = targetQuery + "&" + u.RawQuery
			}
		} else {
			u = *target
		}

		if token == nil {
			return &u, nil
		}

		switch mode {
		case ProvisionerCookieAuthenticationMode:
			var redirect url.URL
			redirect = u
			redirect.Host = ""
			redirect.Scheme = ""
			redirect.User = nil
			return &url.URL{
				Scheme:     u.Scheme,
				User:       u.User,
				Host:       u.Host,
				Path:       "/_plane_auth",
				RawPath:    "",
				OmitHost:   u.OmitHost,
				ForceQuery: false,
				RawQuery:   "token=" + *token + "&redirect=" + url.QueryEscape(redirect.String()),
				Fragment:   u.Fragment,
			}, nil
		case ProvisionerHeaderAuthenticationMode:
			fallthrough
		default:
			h := http.Header{
				"Authorization": []string{"Bearer " + *token},
			}
			return &u, h
		}
	}
}

// From go stdlib
func singleJoiningSlash(a, b string) string {
	aslash := strings.HasSuffix(a, "/")
	bslash := strings.HasPrefix(b, "/")
	switch {
	case aslash && bslash:
		return a + b[1:]
	case !aslash && !bslash:
		return a + "/" + b
	}
	return a + b
}

// From go stdlib
func joinURLPath(a, b *url.URL) (path, rawpath string) {
	if a.RawPath == "" && b.RawPath == "" {
		return singleJoiningSlash(a.Path, b.Path), ""
	}
	// Same as singleJoiningSlash, but uses EscapedPath to determine
	// whether a slash should be added
	apath := a.EscapedPath()
	bpath := b.EscapedPath()

	aslash := strings.HasSuffix(apath, "/")
	bslash := strings.HasPrefix(bpath, "/")

	switch {
	case aslash && bslash:
		return a.Path + b.Path[1:], apath + bpath[1:]
	case !aslash && !bslash:
		return a.Path + "/" + b.Path, apath + "/" + bpath
	}
	return a.Path + b.Path, apath + bpath
}
