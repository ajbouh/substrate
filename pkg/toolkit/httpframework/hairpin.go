package httpframework

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"

	"golang.org/x/net/idna"
)

type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

type HairpinHTTPClient struct {
	Mux        *http.ServeMux
	Middleware []Middleware
	Match      func(r *http.Request) bool

	CheckRedirect func(req *http.Request, via []*http.Request) error

	Fallback HTTPClient
}

// based on http.Client
func defaultCheckRedirect(req *http.Request, via []*http.Request) error {
	if len(via) >= 10 {
		return errors.New("stopped after 10 redirects")
	}
	return nil
}

func (c *HairpinHTTPClient) Initialize() {
	if c.Fallback == nil {
		c.Fallback = http.DefaultClient
	}

	if c.CheckRedirect == nil {
		c.CheckRedirect = defaultCheckRedirect
	}
}

func (c *HairpinHTTPClient) ContributeHTTP(m *http.ServeMux) {
	if c.Mux == nil {
		c.Mux = m
	}
}

func (c *HairpinHTTPClient) Do(req *http.Request) (*http.Response, error) {
	match := c.Match(req)
	slog.Info("HairpinHTTPClient.Do()", "method", req.Method, "url", req.URL.String(), "path", req.URL.Path, "host", req.URL.Host, "match", match)
	if !match {
		return c.Fallback.Do(req)
	}

	return c.do(req)
}

func (c *HairpinHTTPClient) do(req *http.Request) (*http.Response, error) {
	var (
		reqs          []*http.Request
		resp          *http.Response
		copyHeaders   = c.makeHeadersCopier(req)
		reqBodyClosed = false // have we closed the current req.Body?

		// Redirect behavior:
		redirectMethod string
		includeBody    bool
	)

	uerr := func(err error) error {
		// the body may have been closed already by c.send()
		if !reqBodyClosed {
			closeRequestBody(req)
		}
		var urlStr string
		if resp != nil && resp.Request != nil {
			urlStr = stripPassword(resp.Request.URL)
		} else {
			urlStr = stripPassword(req.URL)
		}
		return &url.Error{
			Op:  urlErrorOp(reqs[0].Method),
			URL: urlStr,
			Err: err,
		}
	}

	for {
		// For all but the first request, create the next
		// request hop and replace req.
		if len(reqs) > 0 {
			loc := resp.Header.Get("Location")
			if loc == "" {
				// While most 3xx responses include a Location, it is not
				// required and 3xx responses without a Location have been
				// observed in the wild. See issues #17773 and #49281.
				return resp, nil
			}
			u, err := req.URL.Parse(loc)
			if err != nil {
				closeResponseBody(resp)
				return nil, uerr(fmt.Errorf("failed to parse Location header %q: %v", loc, err))
			}
			host := ""
			if req.Host != "" && req.Host != req.URL.Host {
				// If the caller specified a custom Host header and the
				// redirect location is relative, preserve the Host header
				// through the redirect. See issue #22233.
				if u, _ := url.Parse(loc); u != nil && !u.IsAbs() {
					host = req.Host
				}
			}
			ireq := reqs[0]
			req, err = http.NewRequestWithContext(ireq.Context(), redirectMethod, u.String(), nil)
			if err != nil {
				return nil, uerr(err)
			}
			req.Response = resp
			req.Host = host

			if includeBody && ireq.GetBody != nil {
				req.Body, err = ireq.GetBody()
				if err != nil {
					closeResponseBody(resp)
					return nil, uerr(err)
				}
				req.ContentLength = ireq.ContentLength
			}

			// Copy original headers before setting the Referer,
			// in case the user set Referer on their first request.
			// If they really want to override, they can do it in
			// their CheckRedirect func.
			copyHeaders(req)

			// Add the Referer header from the most recent
			// request URL to the new one, if it's not https->http:
			if ref := refererForURL(reqs[len(reqs)-1].URL, req.URL, req.Header.Get("Referer")); ref != "" {
				req.Header.Set("Referer", ref)
			}
			err = c.CheckRedirect(req, reqs)

			// Sentinel error to let users select the
			// previous response, without closing its
			// body. See Issue 10069.
			if err == http.ErrUseLastResponse {
				return resp, nil
			}

			// If we're redirected to a URL that doesn't match us, use the fallback client.
			if !c.Match(req) {
				return c.Fallback.Do(req)
			}
		}
		reqs = append(reqs, req)
		var err error
		if resp, err = c.send(req); err != nil {
			// c.send() always closes req.Body
			reqBodyClosed = true

			return nil, uerr(err)
		}

		var shouldRedirect bool
		redirectMethod, shouldRedirect, includeBody = redirectBehavior(req.Method, resp, reqs[0])
		if !shouldRedirect {
			return resp, nil
		}

		closeRequestBody(req)
	}
}

func closeResponseBody(r *http.Response) error {
	if r.Body == nil {
		return nil
	}

	return r.Body.Close()
}

func closeRequestBody(r *http.Request) error {
	if r.Body == nil {
		return nil
	}

	return r.Body.Close()
}

func (c *HairpinHTTPClient) send(req *http.Request) (*http.Response, error) {
	var h http.Handler = c.Mux
	for _, m := range c.Middleware {
		h = m.WrapHTTP(h)
	}

	if req.Body != nil {
		defer req.Body.Close()
	}

	originalReq := req.Clone(req.Context())
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	res := rec.Result()
	res.Request = originalReq
	return res, nil
}

// The methods below are from the golang stdlib

// makeHeadersCopier makes a function that copies headers from the
// initial Request, ireq. For every redirect, this function must be called
// so that it can copy headers into the upcoming Request.
func (c *HairpinHTTPClient) makeHeadersCopier(ireq *http.Request) func(*http.Request) {
	// The headers to copy are from the very initial request.
	// We use a closured callback to keep a reference to these original headers.
	var (
		ireqhdr = cloneOrMakeHeader(ireq.Header)
		// icookies map[string][]*http.Cookie
	)

	// NB(adamb) We don't have a Jar on our client
	// if c.Jar != nil && ireq.Header.Get("Cookie") != "" {
	// 	icookies = make(map[string][]*http.Cookie)
	// 	for _, c := range ireq.Cookies() {
	// 		icookies[c.Name] = append(icookies[c.Name], c)
	// 	}
	// }

	preq := ireq // The previous request
	return func(req *http.Request) {
		// If Jar is present and there was some initial cookies provided
		// via the request header, then we may need to alter the initial
		// cookies as we follow redirects since each redirect may end up
		// modifying a pre-existing cookie.
		//
		// Since cookies already set in the request header do not contain
		// information about the original domain and path, the logic below
		// assumes any new set cookies override the original cookie
		// regardless of domain or path.
		//
		// See https://golang.org/issue/17494

		// NB(adamb) We don't have a Jar on our client
		// if c.Jar != nil && icookies != nil {
		// 	var changed bool
		// 	resp := req.Response // The response that caused the upcoming redirect
		// 	for _, c := range resp.Cookies() {
		// 		if _, ok := icookies[c.Name]; ok {
		// 			delete(icookies, c.Name)
		// 			changed = true
		// 		}
		// 	}
		// 	if changed {
		// 		ireqhdr.Del("Cookie")
		// 		var ss []string
		// 		for _, cs := range icookies {
		// 			for _, c := range cs {
		// 				ss = append(ss, c.Name+"="+c.Value)
		// 			}
		// 		}
		// 		slices.Sort(ss) // Ensure deterministic headers
		// 		ireqhdr.Set("Cookie", strings.Join(ss, "; "))
		// 	}
		// }

		// Copy the initial request's Header values
		// (at least the safe ones).
		for k, vv := range ireqhdr {
			if shouldCopyHeaderOnRedirect(k, preq.URL, req.URL) {
				req.Header[k] = vv
			}
		}

		preq = req // Update previous Request with the current request
	}
}

// redirectBehavior describes what should happen when the
// client encounters a 3xx status code from the server.
func redirectBehavior(reqMethod string, resp *http.Response, ireq *http.Request) (redirectMethod string, shouldRedirect, includeBody bool) {
	switch resp.StatusCode {
	case 301, 302, 303:
		redirectMethod = reqMethod
		shouldRedirect = true
		includeBody = false

		// RFC 2616 allowed automatic redirection only with GET and
		// HEAD requests. RFC 7231 lifts this restriction, but we still
		// restrict other methods to GET to maintain compatibility.
		// See Issue 18570.
		if reqMethod != "GET" && reqMethod != "HEAD" {
			redirectMethod = "GET"
		}
	case 307, 308:
		redirectMethod = reqMethod
		shouldRedirect = true
		includeBody = true

		if ireq.GetBody == nil && outgoingLength(ireq) != 0 {
			// We had a request body, and 307/308 require
			// re-sending it, but GetBody is not defined. So just
			// return this response to the user instead of an
			// error, like we did in Go 1.7 and earlier.
			shouldRedirect = false
		}
	}
	return redirectMethod, shouldRedirect, includeBody
}

func shouldCopyHeaderOnRedirect(headerKey string, initial, dest *url.URL) bool {
	switch http.CanonicalHeaderKey(headerKey) {
	case "Authorization", "Www-Authenticate", "Cookie", "Cookie2":
		// Permit sending auth/cookie headers from "foo.com"
		// to "sub.foo.com".

		// Note that we don't send all cookies to subdomains
		// automatically. This function is only used for
		// Cookies set explicitly on the initial outgoing
		// client request. Cookies automatically added via the
		// CookieJar mechanism continue to follow each
		// cookie's scope as set by Set-Cookie. But for
		// outgoing requests with the Cookie header set
		// directly, we don't know their scope, so we assume
		// it's for *.domain.com.

		ihost := idnaASCIIFromURL(initial)
		dhost := idnaASCIIFromURL(dest)
		return isDomainOrSubdomain(dhost, ihost)
	}
	// All other headers are copied:
	return true
}

func idnaASCIIFromURL(url *url.URL) string {
	addr := url.Hostname()
	if v, err := idnaASCII(addr); err == nil {
		addr = v
	}
	return addr
}

// outgoingLength is a copy of the unexported
// (*http.Request).outgoingLength method.
func outgoingLength(req *http.Request) int64 {
	if req.Body == nil || req.Body == http.NoBody {
		return 0
	}
	if req.ContentLength != 0 {
		return req.ContentLength
	}
	return -1
}

func idnaASCII(v string) (string, error) {
	// TODO: Consider removing this check after verifying performance is okay.
	// Right now punycode verification, length checks, context checks, and the
	// permissible character tests are all omitted. It also prevents the ToASCII
	// call from salvaging an invalid IDN, when possible. As a result it may be
	// possible to have two IDNs that appear identical to the user where the
	// ASCII-only version causes an error downstream whereas the non-ASCII
	// version does not.
	// Note that for correct ASCII IDNs ToASCII will only do considerably more
	// work, but it will not cause an allocation.

	// NB(adamb) Can't use this because it's an internal package.
	// if ascii.Is(v) {
	// 	return v, nil
	// }
	return idna.Lookup.ToASCII(v)
}

// isDomainOrSubdomain reports whether sub is a subdomain (or exact
// match) of the parent domain.
//
// Both domains must already be in canonical form.
func isDomainOrSubdomain(sub, parent string) bool {
	if sub == parent {
		return true
	}
	// If sub contains a :, it's probably an IPv6 address (and is definitely not a hostname).
	// Don't check the suffix in this case, to avoid matching the contents of a IPv6 zone.
	// For example, "::1%.www.example.com" is not a subdomain of "www.example.com".
	if strings.ContainsAny(sub, ":%") {
		return false
	}
	// If sub is "foo.example.com" and parent is "example.com",
	// that means sub must end in "."+parent.
	// Do it without allocating.
	if !strings.HasSuffix(sub, parent) {
		return false
	}
	return sub[len(sub)-len(parent)-1] == '.'
}

// refererForURL returns a referer without any authentication info or
// an empty string if lastReq scheme is https and newReq scheme is http.
// If the referer was explicitly set, then it will continue to be used.
func refererForURL(lastReq, newReq *url.URL, explicitRef string) string {
	// https://tools.ietf.org/html/rfc7231#section-5.5.2
	//   "Clients SHOULD NOT include a Referer header field in a
	//    (non-secure) HTTP request if the referring page was
	//    transferred with a secure protocol."
	if lastReq.Scheme == "https" && newReq.Scheme == "http" {
		return ""
	}
	if explicitRef != "" {
		return explicitRef
	}

	referer := lastReq.String()
	if lastReq.User != nil {
		// This is not very efficient, but is the best we can
		// do without:
		// - introducing a new method on URL
		// - creating a race condition
		// - copying the URL struct manually, which would cause
		//   maintenance problems down the line
		auth := lastReq.User.String() + "@"
		referer = strings.Replace(referer, auth, "", 1)
	}
	return referer
}

func stripPassword(u *url.URL) string {
	_, passSet := u.User.Password()
	if passSet {
		return strings.Replace(u.String(), u.User.String()+"@", u.User.Username()+":***@", 1)
	}
	return u.String()
}

// urlErrorOp returns the (*url.Error).Op value to use for the
// provided (*Request).Method value.
func urlErrorOp(method string) string {
	if method == "" {
		return "Get"
	}
	return method[:1] + strings.ToLower(method[1:])
}

// cloneOrMakeHeader invokes Header.Clone but if the
// result is nil, it'll instead make and return a non-nil Header.
//
// cloneOrMakeHeader should be an internal detail,
// but widely used packages access it using linkname.
// Notable members of the hall of shame include:
//   - github.com/searKing/golang
//
// Do not remove or change the type signature.
// See go.dev/issue/67401.
func cloneOrMakeHeader(hdr http.Header) http.Header {
	clone := hdr.Clone()
	if clone == nil {
		clone = make(http.Header)
	}
	return clone
}
