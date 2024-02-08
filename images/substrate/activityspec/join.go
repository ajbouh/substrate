package activityspec

import (
	"net/url"
	"strings"
)

func Join(target *url.URL, rest *url.URL) *url.URL {
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

	return &u
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
