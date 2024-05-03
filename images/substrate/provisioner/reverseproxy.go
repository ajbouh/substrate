package provisioner

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

type ProvisionFunc func(ctx context.Context) (*url.URL, bool, func(err error), error)

func provisioningReverseProxy(
	provision ProvisionFunc,
	ttl int,
	errs []error,
	rw http.ResponseWriter,
	req *http.Request,
) {
	if ttl <= 0 {
		errs = append([]error{errors.New("ttl ≤ 0")}, errs...)
		newBadGatewayHandler(errors.Join(errs...), rw)
		return
	}

	target, fresh, cleanup, err := provision(req.Context())
	if err != nil {
		errs = append([]error{fmt.Errorf("error provisioning: %w", err)}, errs...)
		newBadGatewayHandler(errors.Join(errs...), rw)
		return
	}

	var originalURL url.URL = *req.URL

	proxy := &httputil.ReverseProxy{
		Rewrite: func(r *httputil.ProxyRequest) {
			r.SetURL(target)
			r.Out.Host = r.In.Host

			if _, ok := r.In.Header["User-Agent"]; !ok {
				// explicitly disable User-Agent so it's not set to default value
				r.Out.Header.Set("User-Agent", "")
			}

			log.Printf("%s %s %s -> %s", r.In.RemoteAddr, r.In.Method, originalURL.String(), r.Out.URL.String())
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
				append([]error{fmt.Errorf("unexpected error: %w", err)}, errs...),
				rw,
				req,
			)
		},
	}
	proxy.ServeHTTP(rw, req)
}
