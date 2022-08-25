package substrate

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"sync"
)

// lazily boot machine
// - service
// - initial data

// Buffer incoming request.
// Hash, look up instance.
// If we have an instance:
// - proxy traffic to it
// - if instance is gone or something goes wrong, pretend we never had one
// If we don't have one, start one and remember it.

type ProvisionerAuthenticationMode string

const ProvisionerHeaderAuthenticationMode ProvisionerAuthenticationMode = "header"
const ProvisionerCookieAuthenticationMode ProvisionerAuthenticationMode = "cookie"

type AuthenticatedURLJoinerFunc func(u *url.URL, mode ProvisionerAuthenticationMode) (*url.URL, http.Header)

type ProvisionFunc func(context.Context) (AuthenticatedURLJoinerFunc, bool, func(error), error)

type doomedReadCloser struct {
	r   io.Reader
	err error
}

func (d *doomedReadCloser) Close() error {
	return nil
}

func (d *doomedReadCloser) Read(b []byte) (int, error) {
	n, err := d.r.Read(b)
	if errors.Is(err, io.EOF) {
		return n, d.err
	}

	return n, nil
}

func newBadGatewayHandler(err error) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		if err != nil {
			fmt.Printf("err=%s\n", err)
		}
		rw.WriteHeader(http.StatusBadGateway)
	})
}

func provisioningRedirector(
	provision ProvisionFunc,
	redirector func(targetFunc AuthenticatedURLJoinerFunc) (int, string, error),
) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		targetFunc, fresh, cleanup, err := provision(req.Context())
		if err != nil {
			newBadGatewayHandler(err).ServeHTTP(rw, req)
			return
		}

		// TODO if !fresh issue a HEAD request to check that it's still valid.
		_ = fresh
		_ = cleanup

		status, location, err := redirector(targetFunc)
		if err != nil {
			newBadGatewayHandler(err).ServeHTTP(rw, req)
			return
		}

		rw.Header().Set("Location", location)
		rw.WriteHeader(status)
	})
}

func provisioningReverseProxy(
	provision ProvisionFunc,
	ttl int,
	errs []error,
) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		if ttl <= 0 {
			errs = append([]error{errors.New("ttl ≤ 0")}, errs...)
			newBadGatewayHandler(join(errs...)).ServeHTTP(rw, req)
			return
		}

		targetFunc, fresh, cleanup, err := provision(req.Context())
		if err != nil {
			errs = append([]error{err}, errs...)
			newBadGatewayHandler(join(errs...)).ServeHTTP(rw, req)
			return
		}

		var originalURL url.URL = *req.URL

		proxy := &httputil.ReverseProxy{
			// Director must be a function which modifies the request into a new request to be sent
			// using Transport. Its response is then copied back to the original client unmodified.
			// Director must not access the provided Request after returning.
			Director: func(req *http.Request) {
				var targetHeader http.Header
				req.URL, targetHeader = targetFunc(req.URL, ProvisionerHeaderAuthenticationMode)

				for k, v := range targetHeader {
					req.Header[k] = v
				}

				if _, ok := req.Header["User-Agent"]; !ok {
					// explicitly disable User-Agent so it's not set to default value
					req.Header.Set("User-Agent", "")
				}

				if req.GetBody == nil {
					// Copy req.Body so we can replay it if needed!
					if req.Body == nil {
						req.GetBody = func() (io.ReadCloser, error) {
							return nil, nil
						}
					} else {
						b, err := ioutil.ReadAll(req.Body)
						req.GetBody = func() (io.ReadCloser, error) {
							if err != nil {
								return &doomedReadCloser{bytes.NewReader(b), err}, nil
							} else {
								return ioutil.NopCloser(bytes.NewReader(b)), nil
							}
						}
					}
				}
				req.Body, err = req.GetBody()
				if err != nil {
					req.Body = &doomedReadCloser{bytes.NewReader([]byte{}), err}
				}

				log.Printf("%s %s %s -> %s", req.RemoteAddr, req.Method, originalURL.String(), req.URL.String())
			},

			// If ModifyResponse returns an error, ErrorHandler is called with its error value. If ErrorHandler is nil, its default
			// implementation is used.
			ModifyResponse: func(res *http.Response) error {
				// If we see a 503, log it and return an error.
				if res.StatusCode == 503 {
					fmt.Printf("bad upstream status=%d target=%s url=%s fresh=%#v response=%#v\n", res.StatusCode, targetFunc, req.URL, fresh, res)
					return fmt.Errorf("bad upstream status=%d", res.StatusCode)
				}

				return nil
			},

			// ErrorHandler is an optional function that handles errors reaching the backend or errors from ModifyResponse.
			// If nil, the default is to log the provided error and return a 502 Status Bad Gateway response.
			ErrorHandler: func(rw http.ResponseWriter, req *http.Request, err error) {
				ttlDecrement := 1
				switch {
				case errors.Is(err, context.Canceled):
					return
				case errors.Is(err, io.EOF):
					ttlDecrement = 0
				default:
					// Something's gone wrong. Give up on our current backend.
					cleanup(err)
				}

				// Reset the URL for the request
				req.Host = ""
				req.URL = &originalURL

				nextTTL := ttl - ttlDecrement
				if fresh {
					// If we just allocated, then no more tries.
					nextTTL = 0
				}

				// Provision a new one and use it.
				provisioningReverseProxy(
					provision,
					nextTTL,
					append([]error{err}, errs...),
				).ServeHTTP(rw, req)
			},
		}
		proxy.ServeHTTP(rw, req)
	})
}

type Gateway struct {
	mu           *sync.Mutex
	provisioners map[string]ProvisionFunc
}

func NewGateway() *Gateway {
	return &Gateway{
		mu:           &sync.Mutex{},
		provisioners: map[string]ProvisionFunc{},
	}
}

func (r *Gateway) ProvisionReverseProxy(cacheKey string, makeProvisioner func() ProvisionFunc) http.Handler {
	r.mu.Lock()
	defer r.mu.Unlock()

	fn := r.provisioners[cacheKey]
	if fn == nil {
		fn = makeProvisioner()
		r.provisioners[cacheKey] = fn
	}

	return provisioningReverseProxy(fn, 2, nil)
}

func (r *Gateway) ProvisionRedirector(cacheKey string, makeProvisioner func() ProvisionFunc, redirector func(targetFunc AuthenticatedURLJoinerFunc) (int, string, error)) http.Handler {
	r.mu.Lock()
	defer r.mu.Unlock()

	fn := r.provisioners[cacheKey]
	if fn == nil {
		fn = makeProvisioner()
		r.provisioners[cacheKey] = fn
	}

	return provisioningRedirector(fn, redirector)
}
