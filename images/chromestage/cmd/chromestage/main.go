package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func main() {
	chromedpUrl, _ := url.Parse("http://localhost:9222")
	chromedpProxy := &httputil.ReverseProxy{
		Rewrite: func(r *httputil.ProxyRequest) {
			r.SetURL(chromedpUrl)
			r.Out.Host = "localhost"

			log.Printf("OKOKOKOKOK %s %s %s -> %s", r.In.RemoteAddr, r.In.Method, r.In.URL.String(), r.Out.URL.String())
		},
	}

	prefix := os.Getenv("SUBSTRATE_URL_PREFIX")
	fmt.Println("prefix", prefix)

	var originURL *url.URL
	origin := "http://substrate:8080" // os.Getenv("ORIGIN")
	if origin != "" {
		var err error
		originURL, err = url.Parse(origin)
		if err != nil {
			log.Fatal(err)
		}
	}

	http.HandleFunc(prefix+"/vnc/ws", novncHandler)
	http.Handle(prefix+"/vnc/", http.StripPrefix(prefix+"/vnc", http.FileServer(http.Dir("/vnc"))))
	http.Handle(prefix+"/json/version", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// {
		// 	"Browser": "Chrome/121.0.6167.184",
		// 	"Protocol-Version": "1.3",
		// 	"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
		// 	"V8-Version": "12.1.285.28",
		// 	"WebKit-Version": "537.36 (@057a8ae7deb3374d0f1b04b36304d236f0136188)",
		// 	"webSocketDebuggerUrl": "ws://localhost/devtools/browser/6887bfde-da25-456d-9d47-81107f108312"
		// }

		res, err := http.Get("http://localhost:9222/json/version")
		if err != nil {
			w.WriteHeader(500)
			w.Write([]byte(fmt.Sprintf("error getting upstream /json/version: %s", err)))
			return
		}

		defer res.Body.Close()
		b, err := io.ReadAll(res.Body)
		if err != nil {
			w.WriteHeader(500)
			w.Write([]byte(fmt.Sprintf("error reading body from upstream /json/version: %s", err)))
			return
		}

		version := map[string]string{}
		if err := json.Unmarshal(b, &version); err != nil {
			w.WriteHeader(500)
			w.Write([]byte(fmt.Sprintf("error parsing upstream body from /json/version: %s; %s", err, string(b))))
			return
		}

		// fix webSocketDebuggerUrl
		webSocketDebuggerUrl := version["webSocketDebuggerUrl"]
		if webSocketDebuggerUrl != "" && originURL != nil {
			u, err := url.Parse(webSocketDebuggerUrl)
			if err != nil {
				w.WriteHeader(500)
				w.Write([]byte(fmt.Sprintf("error parsing webSocketDebuggerUrl %q: %s", webSocketDebuggerUrl, err)))
				return
			}

			u.Host = originURL.Host
			u.Path = prefix + u.Path

			version["webSocketDebuggerUrl"] = u.String()
		}

		b, err = json.Marshal(version)
		if err != nil {
			w.WriteHeader(500)
			w.Write([]byte(fmt.Sprintf("error generating JSON for %#v: %s", version, err)))
			return
		}

		w.Write(b)
	}))
	http.Handle(prefix+"/", http.StripPrefix(prefix, chromedpProxy))

	fmt.Println("Server started at :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
