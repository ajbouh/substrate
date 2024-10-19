package main

import (
	"log"
	"net/url"
	"os"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

func main() {

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

	substrateOriginURL, err := url.Parse(os.Getenv("SUBSTRATE_ORIGIN"))
	if err != nil {
		log.Fatalf("could not parse substrate origin: %#v", err)
	}

	engine.Run(
		&service.Service{},
		&RemoteCDP{
			Endpoint: chromedpUrl.String(),
		},
		&InitialExports{
			OriginScheme: substrateOriginURL.Scheme,
			OriginHost:   substrateOriginURL.Host,
		},
		&ExportChromeDPFields{},
		&NoVNCHandler{},
		&ChromeDPProxy{
			OriginURL:   originURL,
			Upstream:    chromedpUrl.String(),
			UpstreamURL: chromedpUrl,
		},
		&PageCommands{},
		&commands.PrefixedSource[*PageCommands]{
			Prefix: "page:",
		},
		&TabCommands{},
		&commands.PrefixedSource[*TabCommands]{
			Prefix: "tab:",
		},
		commands.Prefixed("window:", WindowCommands()),
	)
}
