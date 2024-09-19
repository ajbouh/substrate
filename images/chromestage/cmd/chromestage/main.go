package main

import (
	"context"
	"log"
	"net/url"
	"os"

	"github.com/ajbouh/substrate/images/chromestage/units"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
	"github.com/chromedp/cdproto/page"
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
		&units.RemoteCDP{
			Endpoint: chromedpUrl.String(),
		},
		&units.InitialExports{
			OriginScheme: substrateOriginURL.Scheme,
			OriginHost:   substrateOriginURL.Host,
		},
		&units.ExportChromeDPFields{},
		&units.NoVNCHandler{},
		&units.ChromeDPProxy{
			OriginURL:   originURL,
			Upstream:    chromedpUrl.String(),
			UpstreamURL: chromedpUrl,
		},
		&units.PageCommands{},
		&commands.PrefixedSource[*units.PageCommands]{
			Prefix: "page:",
		},
		&units.TabCommands{},
		&commands.PrefixedSource[*units.TabCommands]{
			Prefix: "tab:",
		},
		commands.Prefixed("window:", WindowCommands()),

		notify.On(
			func(ctx context.Context,
				c *units.ExportChromeDPFields,
				e *page.EventLifecycleEvent) {
				// ev.FrameID
				// ev.LoaderID
				// ev.Name
				// ev.Timestamp
				switch e.Name {
				case "DOMContentLoaded":
					go c.Refresh()
				}
				log.Printf("event: %#v", e)
			}),
	)
}
