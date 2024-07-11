package main

import (
	"context"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/ajbouh/substrate/pkg/commands"

	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"
)

type Main struct {
	prefix     string
	listenAddr string

	chromedpProxy             http.Handler
	proxiedJSONVersionHandler http.Handler

	CommandHandler *HTTPHandler

	Daemon *daemon.Framework
}

func main() {
	prefix := os.Getenv("SUBSTRATE_URL_PREFIX")

	chromedpUrl, _ := url.Parse("http://127.0.0.1:9222")

	var originURL *url.URL
	origin := "http://substrate:8080" // os.Getenv("ORIGIN")
	if origin != "" {
		var err error
		originURL, err = url.Parse(origin)
		if err != nil {
			log.Fatal(err)
		}
	}

	engine.Run(
		Main{
			listenAddr: ":" + os.Getenv("PORT"),
			prefix:     prefix,

			chromedpProxy: &httputil.ReverseProxy{
				Rewrite: func(r *httputil.ProxyRequest) {
					r.SetURL(chromedpUrl)
					r.Out.Host = "localhost"
				},
			},

			proxiedJSONVersionHandler: &proxiedJSONVersionHandler{
				OriginURL: originURL,
				Prefix:    prefix,
				Upstream:  "http://localhost:9222/json/version",
			},
		},
		&RemoteCDP{
			Endpoint: chromedpUrl.String(),
		},
		&PageCommands{
			Prefix: "page:",
		},
		&TabCommands{},
		&HTTPHandler{
			Debug: true,
		},
	)
}

func (m *Main) InitializeCLI(root *cli.Command) {
	// a workaround for an unresolved issue in toolkit-go/engine
	// for figuring out if its a CLI or a daemon program...
	root.Run = func(ctx *cli.Context, args []string) {
		if err := m.Daemon.Run(ctx); err != nil {
			log.Fatal(err)
		}
	}
}

func (m *Main) Serve(ctx context.Context) {
	mux := http.NewServeMux()
	mux.HandleFunc(m.prefix+"/vnc/ws", novncHandler)
	mux.Handle(m.prefix+"/vnc/", http.StripPrefix(m.prefix+"/vnc", http.FileServer(http.Dir("/vnc"))))

	// The chromedp package uses this URL path to complete its initial handshake.
	mux.Handle(m.prefix+"/json/version", m.proxiedJSONVersionHandler)
	mux.Handle(m.prefix+"/commands", m.CommandHandler)
	mux.Handle(m.prefix+"/", http.StripPrefix(m.prefix, m.chromedpProxy))

	log.Printf("running on http://%s ...", m.listenAddr)
	log.Fatal(http.ListenAndServe(m.listenAddr, mux))
}
