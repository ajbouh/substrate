package provisioner

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/http/httputil"
	"net/url"
)

type Provisioning struct {
	Target  *url.URL
	Fresh   bool
	Cleanup func(err error)
}
type ProvisionFunc func(ctx context.Context) (*Provisioning, error)

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

	slog.Info("provisioningReverseProxy", "ttl", ttl, "url", req.URL.String())
	defer slog.Info("provisioningReverseProxy done", "ttl", ttl, "url", req.URL.String())

	provisioning, err := provision(req.Context())
	if err != nil {
		errs = append([]error{fmt.Errorf("error provisioning: %w", err)}, errs...)
		newBadGatewayHandler(errors.Join(errs...), rw)
		return
	}
	target, fresh, cleanup := provisioning.Target, provisioning.Fresh, provisioning.Cleanup

	var originalURL url.URL = *req.URL

	proxy := &httputil.ReverseProxy{
		Rewrite: func(r *httputil.ProxyRequest) {
			r.SetURL(target)
			r.Out.Host = r.In.Host
			r.Out.Header["X-Forwarded-Proto"] = r.In.Header["X-Forwarded-Proto"]
			r.Out.Header["X-Forwarded-Host"] = r.In.Header["X-Forwarded-Host"]

			if _, ok := r.In.Header["User-Agent"]; !ok {
				// explicitly disable User-Agent so it's not set to default value
				r.Out.Header.Set("User-Agent", "")
			}

			slog.Info("provisioningReverseProxy proxy.Rewrite", "ttl", ttl, "urlin", r.In.URL.String(), "urlout", r.Out.URL.String())
			defer slog.Info("provisioningReverseProxy proxy.Rewrite done", "ttl", ttl, "urlin", r.In.URL.String(), "urlout", r.Out.URL.String())

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

	slog.Info("provisioningReverseProxy proxy.ServeHTTP", "ttl", ttl, "url", req.URL.String())
	proxy.ServeHTTP(rw, req)
	slog.Info("provisioningReverseProxy proxy.ServeHTTP done", "ttl", ttl, "url", req.URL.String())
}
