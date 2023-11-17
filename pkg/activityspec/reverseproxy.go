package activityspec

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
)

func provisioningReverseProxy(
	provision ProvisionFunc,
	ttl int,
	errs []error,
) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		if ttl <= 0 {
			errs = append([]error{errors.New("ttl ≤ 0")}, errs...)
			newBadGatewayHandler(errors.Join(errs...)).ServeHTTP(rw, req)
			return
		}

		targetFunc, fresh, cleanup, err := provision(req.Context())
		if err != nil {
			errs = append([]error{err}, errs...)
			newBadGatewayHandler(errors.Join(errs...)).ServeHTTP(rw, req)
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
					fmt.Printf("bad upstream status=%d target=%#v url=%s fresh=%#v response=%#v\n", res.StatusCode, targetFunc, req.URL, fresh, res)
					return fmt.Errorf("bad upstream status=%d", res.StatusCode)
				}

				return nil
			},

			// ErrorHandler is an optional function that handles errors reaching the backend or errors from ModifyResponse.
			// If nil, the default is to log the provided error and return a 502 Status Bad ProvisionerCache response.
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

func (r *ProvisionerCache) ProvisionReverseProxy(asr *ServiceSpawnRequest) http.Handler {
	cacheKey, concrete := asr.Format()
	if !concrete {
		return newDoomedHandler(http.StatusBadRequest, fmt.Errorf("viewspec must be concrete"))
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	fn := r.provisionerFuncs[cacheKey]
	if fn == nil {
		fn = r.makeProvisionFunc(asr)
		r.provisionerFuncs[cacheKey] = fn
	}

	return provisioningReverseProxy(fn, 2, nil)
}
