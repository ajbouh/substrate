package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
	"golang.org/x/sync/semaphore"

	"github.com/ajbouh/substrate/images/screenshot/cookie"
)

func getInt(v url.Values, key string, defaultValue int) (int, error) {
	value := v.Get(key)
	if value == "" {
		return defaultValue, nil
	}
	return strconv.Atoi(value)
}

func getInt64(v url.Values, key string, defaultValue int64) (int64, error) {
	value := v.Get(key)
	if value == "" {
		return defaultValue, nil
	}
	return strconv.ParseInt(value, 10, 64)
}

func resolve(urlStr, resolverAddr string) (string, string, error) {
	if urlStr == "" {
		return "", "", nil
	}

	parsedURL, err := url.Parse(urlStr)
	if err != nil {
		return "", "", fmt.Errorf("invalid URL url=%s err=%v", parsedURL, err)
	}

	address := parsedURL.Hostname()

	r := &net.Resolver{
		PreferGo: true,
	}

	if resolverAddr != "" {
		r.Dial = func(ctx context.Context, network, address string) (net.Conn, error) {
			d := net.Dialer{
				Timeout: time.Millisecond * time.Duration(10000),
			}
			return d.DialContext(ctx, network, resolverAddr)
		}
	}

	ips, err := r.LookupHost(context.Background(), address)

	log.Printf("net.LookupHost %s -> %#v err=%s", address, ips, err)
	if err == nil {
		return address, ips[0], nil
	}

	return address, "", err
}

func navigateAndWaitFor(url string, eventName string) chromedp.ActionFunc {
	return func(ctx context.Context) error {
		_, _, _, err := page.Navigate(url).Do(ctx)
		if err != nil {
			return err
		}

		return waitFor(ctx, eventName)
		return nil
	}
}

// waitFor blocks until eventName is received.
// Examples of events you can wait for:
//
//	init, DOMContentLoaded, firstPaint,
//	firstContentfulPaint, firstImagePaint,
//	firstMeaningfulPaintCandidate,
//	load, networkAlmostIdle, firstMeaningfulPaint, networkIdle
//
// This is not super reliable, I've already found incidental cases where
// networkIdle was sent before load. It's probably smart to see how
// puppeteer implements this exactly.
func waitFor(ctx context.Context, eventName string) error {
	ch := make(chan struct{})
	cctx, cancel := context.WithCancel(ctx)
	chromedp.ListenTarget(cctx, func(ev interface{}) {
		switch e := ev.(type) {
		case *page.EventLifecycleEvent:
			if e.Name == eventName {
				cancel()
				close(ch)
			}
		}
	})
	select {
	case <-ch:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func main() {
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("ignore-certificate-errors", "1"),
	)

	// This code can be used to hardcode address resolutions that chrome might have trouble with. Consider re-enabling it if we're using tailscale.
	// substrateOrigin, substrateOriginAddress, err := resolve(os.Getenv("INTERNAL_SUBSTRATE_HOST"), os.Getenv("SUBSTRATE_ORIGIN_RESOLVER"))
	// if err != nil {
	// 	log.Printf("invalid URL for SUBSTRATE_ORIGIN err=%v", err)
	// }
	// if substrateOriginAddress != "" && err == nil {
	// 	// Chrome fails to resolve MagicDNS names sometimes... here's some discussion:
	// 	// https://github.com/tailscale/tailscale/issues/3614
	// 	// Which links to https://bugs.chromium.org/p/chromium/issues/detail?id=530482#c52
	// 	opts = append(opts, chromedp.Flag("host-resolver-rules", fmt.Sprintf("MAP %s %s", substrateOrigin, substrateOriginAddress)))
	// }

	allocCtx, allocCancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer allocCancel()

	mu := &sync.Mutex{}

	sema := semaphore.NewWeighted(10)

	router := http.NewServeMux()
	router.Handle("/", http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		err := sema.Acquire(req.Context(), 1)
		if err != nil {
			return
		}

		defer sema.Release(1)

		// create new tabs instead of new browsers
		mu.Lock()
		ctx, ctxCancel := chromedp.NewContext(allocCtx)
		mu.Unlock()
		defer ctxCancel()

		ctx, cancel := chromedp.NewContext(
			ctx,
			// chromedp.WithDebugf(log.Printf),
		)
		defer cancel()

		log.Printf("%s %s %s", req.RemoteAddr, req.Method, req.URL.String())

		query := req.URL.Query()
		targetURL := query.Get("url")

		parsedTargetURL, err := url.Parse(targetURL)
		if err != nil {
			rw.WriteHeader(400)
			rw.Write([]byte(err.Error()))
			return
		}

		quality, err := getInt(query, "quality", 100)
		if err != nil {
			rw.WriteHeader(400)
			rw.Write([]byte(err.Error()))
			return
		}

		width, err := getInt64(query, "width", 800)
		if err != nil {
			rw.WriteHeader(400)
			rw.Write([]byte(err.Error()))
			return
		}

		height, err := getInt64(query, "height", 600)
		if err != nil {
			rw.WriteHeader(400)
			rw.Write([]byte(err.Error()))
			return
		}

		format := page.CaptureScreenshotFormatPng
		mimeType := "image/png"
		if quality != 100 {
			mimeType = "image/jpeg"
			format = page.CaptureScreenshotFormatJpeg
		}

		var buf []byte
		tasks := chromedp.Tasks{
			chromedp.EmulateReset(),
			chromedp.EmulateViewport(width, height),
		}

		// Forward cookies if they match the requested Domain and Path
		for _, c := range cookie.ReadSetCookies(req.Header) {
			cookie := c
			if cookie.Domain == "" {
				log.Printf("skipping cookie=%s because cookie.domain=%s is empty", cookie, cookie.Domain)
				continue
			}
			if !strings.HasSuffix(parsedTargetURL.Host, cookie.Domain) {
				log.Printf("skipping cookie=%s because cookie.domain=%s doesn't match url.host=%s", cookie, cookie.Domain, parsedTargetURL.Host)
				continue
			}
			if !strings.HasPrefix(parsedTargetURL.Path, cookie.Path) {
				log.Printf("skipping cookie=%s because cookie.path=%s doesn't match url.path=%s", cookie, cookie.Path, parsedTargetURL.Path)
				continue
			}

			log.Printf("forwarding cookie name=%#v value=%#v domain=%#v path=%#v httponly=%#v samesite=%#v secure=%#v", cookie.Name, cookie.Value, cookie.Domain, cookie.Path, cookie.HttpOnly, cookie.SameSite, cookie.Secure)

			tasks = append(tasks, chromedp.ActionFunc(func(ctx context.Context) error {
				expr := cdp.TimeSinceEpoch(cookie.Expires)
				return network.SetCookie(cookie.Name, cookie.Value).
					WithExpires(&expr).
					WithDomain(cookie.Domain).
					WithPath(cookie.Path).
					WithHTTPOnly(cookie.HttpOnly).
					WithSameSite(network.CookieSameSite(cookie.SameSite)).
					WithSecure(cookie.Secure).
					Do(ctx)
			}))
		}

		waitForEvent := query.Get("wait")
		if waitForEvent != "" {
			tasks = append(tasks, navigateAndWaitFor(targetURL, waitForEvent))
		} else {
			tasks = append(tasks, chromedp.Navigate(targetURL))
		}

		switch query.Get("target") {
		case "viewport", "":
			tasks = append(tasks,
				chromedp.ActionFunc(func(ctx context.Context) error {
					var err error
					buf, err = page.CaptureScreenshot().
						WithCaptureBeyondViewport(false).
						WithFormat(format).
						WithQuality(int64(quality)).
						Do(ctx)
					return err
				}))
		case "content":
			tasks = append(tasks,
				// Note: chromedp.FullScreenshot overrides the device's emulation settings. Use
				// device.Reset to reset the emulation and viewport settings.
				chromedp.FullScreenshot(&buf, quality),
			)
		default:
			rw.WriteHeader(400)
			return
		}
		resp, err := chromedp.RunResponse(ctx, tasks)
		if err != nil {
			rw.WriteHeader(500)
			rw.Write([]byte(err.Error()))
			return
		}

		rw.Header().Set("Content-Type", mimeType)

		status := resp.Status
		rw.WriteHeader(int(status))
		rw.Write(buf)
	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	binaryPath, _ := os.Executable()
	if binaryPath == "" {
		binaryPath = "server"
	}
	addr := ":" + port
	log.Printf("%s listening on %q", filepath.Base(binaryPath), addr)

	log.Fatal(http.ListenAndServe(addr, router))
}
