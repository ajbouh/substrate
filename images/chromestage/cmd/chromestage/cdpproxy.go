package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"time"

	"github.com/ajbouh/substrate/pkg/httpframework"
)

type ChromeDPProxy struct {
	Upstream    string
	UpstreamURL *url.URL
	OriginURL   *url.URL

	reverseProxy http.Handler
}

func (h *ChromeDPProxy) Initialize() {
	h.reverseProxy = &httputil.ReverseProxy{
		Rewrite: func(r *httputil.ProxyRequest) {
			r.SetURL(h.UpstreamURL)
			r.Out.Host = "localhost"
		},
	}
}

func (h *ChromeDPProxy) ContributeHTTP(mux *http.ServeMux) {
	mux.Handle("/json/version/", http.HandlerFunc(h.ServeHTTPUpstreamJSONVersion))
	mux.Handle("/json/version", http.HandlerFunc(h.ServeHTTPUpstreamJSONVersion))
	mux.Handle("/", h.reverseProxy)
}

func (h *ChromeDPProxy) ServeHTTPUpstreamJSONVersion(w http.ResponseWriter, r *http.Request) {
	version, _, err := h.GetAndFixUpstreamJSONVersion(r.Context())
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(err.Error()))
	}

	b, err := json.Marshal(version)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte(fmt.Sprintf("error generating JSON for %#v: %s", version, err)))
		return
	}

	w.Write(b)
}

func tcpTryFunc(host string, port string) func() (bool, error) {
	return func() (bool, error) {
		conn, err := net.Dial("tcp", fmt.Sprintf("%s:%s", host, port))
		if err != nil {
			dnsError := &net.DNSError{}
			if errors.As(err, &dnsError) && dnsError.IsNotFound {
				return false, fmt.Errorf("gave up waiting for the container to be ready, since it seems to be gone: %w", err)
			}
			return true, err
		}
		conn.Close()
		return false, nil
	}
}

func tcpHTTPGetJSONFunc(url *url.URL) func() (bool, error) {
	tcpTry := tcpTryFunc(url.Hostname(), url.Port())

	return func() (bool, error) {
		retry, err := tcpTry()
		if err != nil {
			return retry, err
		}
		res, err := http.Get(url.String())
		if err != nil {
			return true, err
		}

		defer res.Body.Close()
		b, err := io.ReadAll(res.Body)

		if res.StatusCode != http.StatusOK {
			body := "body=" + string(b)
			if err != nil {
				body = "error reading body: " + err.Error()
			}
			return true, fmt.Errorf("non-200 status from %s: %d %s; %s", url.String(), res.StatusCode, res.Status, body)
		}

		version := map[string]string{}
		if err := json.Unmarshal(b, &version); err != nil {
			body := "body=" + string(b)
			return true, fmt.Errorf("error parsing upstream body from %s: %w; %s", url.String(), err, body)
		}

		return false, nil
	}
}
func waitForReady(ctx context.Context, desc string, try func() (bool, error), tickDelay, timeout time.Duration, maxAttempts int) error {
	timeoutAfter := time.After(timeout)
	tick := time.Tick(tickDelay)
	attempts := 0
	for {
		if maxAttempts >= 0 && attempts >= maxAttempts {
			log.Printf("waitForReady gave up on desc=%s attempts=%d maxAttempts=%d", desc, attempts, maxAttempts)
			return fmt.Errorf("no more attempts allowed to check if container is ready")
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-timeoutAfter:
			log.Printf("waitForReady timed out desc=%s attempts=%d maxAttempts=%d", desc, attempts, maxAttempts)
			return fmt.Errorf("timed out waiting for the container to be ready")
		case <-tick:
			log.Printf("waitForReady try desc=%s attempts=%d maxAttempts=%d", desc, attempts, maxAttempts)
			retry, err := try()
			attempts++
			if retry {
				log.Printf("waitForReady err desc=%s attempts=%d maxAttempts=%d err=%s", desc, attempts, maxAttempts, err)
				continue
			}

			if err != nil {
				return fmt.Errorf("gave up waiting for the container to be ready, since it seems to be gone: %w", err)
			}

			log.Printf("waitForReady success for desc=%s attempts=%d maxAttempts=%d", desc, attempts, maxAttempts)
			return nil
		}
	}

}

func (h *ChromeDPProxy) getUpstreamJSONVersion(ctx context.Context, upstream *url.URL) (map[string]string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, upstream.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("error getting %s: %w", upstream.String(), err)
	}

	res, resErr := http.DefaultClient.Do(req)
	if resErr != nil {
		return nil, fmt.Errorf("error getting %s: %w", upstream.String(), err)
	}

	defer res.Body.Close()
	b, err := io.ReadAll(res.Body)

	if res.StatusCode != http.StatusOK {
		body := "body=" + string(b)
		if err != nil {
			body = "error reading body: " + err.Error()
		}
		return nil, fmt.Errorf("non-200 status from %s: %d %s; %s", upstream.String(), res.StatusCode, res.Status, body)
	}

	if err != nil {
		return nil, fmt.Errorf("error reading body from %s: %w", upstream.String(), err)
	}

	version := map[string]string{}
	if err := json.Unmarshal(b, &version); err != nil {
		body := "body=" + string(b)
		return nil, fmt.Errorf("error parsing upstream body from %s: %w; %s", upstream.String(), err, body)
	}

	return version, err
}
func (h *ChromeDPProxy) GetAndFixUpstreamJSONVersion(ctx context.Context) (map[string]string, *url.URL, error) {
	// {
	// 	"Browser": "Chrome/121.0.6167.184",
	// 	"Protocol-Version": "1.3",
	// 	"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
	// 	"V8-Version": "12.1.285.28",
	// 	"WebKit-Version": "537.36 (@057a8ae7deb3374d0f1b04b36304d236f0136188)",
	// 	"webSocketDebuggerUrl": "ws://localhost/devtools/browser/6887bfde-da25-456d-9d47-81107f108312"
	// }

	upstream, err := url.Parse(h.Upstream + "/json/version/")
	if err != nil {
		return nil, nil, fmt.Errorf("error parsing upstream url for /json/version: %w", err)
	}

	err = waitForReady(ctx, upstream.String(), tcpHTTPGetJSONFunc(upstream), time.Millisecond*100, 10*time.Second, 100)
	if err != nil {
		return nil, nil, fmt.Errorf("error waiting for %s to be ready: %w", upstream.String(), err)
	}

	version, err := h.getUpstreamJSONVersion(ctx, upstream)
	if err != nil {
		return nil, nil, err
	}

	// fix webSocketDebuggerUrl
	webSocketDebuggerUrl := version["webSocketDebuggerUrl"]
	var u *url.URL
	if webSocketDebuggerUrl != "" && h.OriginURL != nil {
		u, err = url.Parse(webSocketDebuggerUrl)
		if err != nil {
			return nil, nil, fmt.Errorf("error parsing webSocketDebuggerUrl %q: %w", webSocketDebuggerUrl, err)
		}

		u.Host = h.OriginURL.Host
		prefix := httpframework.ContextPrefix(ctx)
		u.Path = prefix + u.Path

		version["webSocketDebuggerUrl"] = u.String()
	}

	return version, u, nil
}
