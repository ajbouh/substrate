package main

import (
	"log"
	"log/slog"
	"net/url"
	"os"

	"github.com/ajbouh/substrate/pkg/commands"
	"github.com/ajbouh/substrate/pkg/exports"
	"github.com/ajbouh/substrate/pkg/httpframework"

	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"
)

type Main struct {
	Daemon *daemon.Framework
}

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

	units := []engine.Unit{
		Main{},
		slog.Default(),
		&httpframework.Framework{},
		&commands.Aggregate{},
		&RemoteCDP{
			Endpoint: chromedpUrl.String(),
		},
	}

	units = AppendUnits[exports.Source](units,
		&InitialExports{
			OriginScheme: substrateOriginURL.Scheme,
			OriginHost:   substrateOriginURL.Host,
		},
		&ExportChromeDPFields{},
		&commands.ExportCommands{},
	)

	units = AppendUnits[httpframework.MuxContributor](units,
		&exports.Handler{},
		&NoVNCHandler{},
		&ChromeDPProxy{
			OriginURL:   originURL,
			Upstream:    chromedpUrl.String(),
			UpstreamURL: chromedpUrl,
		},
		&commands.HTTPHandler{
			Debug: true,
			Route: "/commands",
			// TODO switch to REFLECT and delete this field
			GetEnabled: true,
		},
	)

	units = AppendUnits[commands.Source](units,
		&PageCommands{},
		&commands.PrefixedSource[*PageCommands]{
			Prefix: "page:",
		},
		&TabCommands{},
		&commands.PrefixedSource[*TabCommands]{
			Prefix: "tab:",
		},
	)

	units = append(units,
		As[httpframework.Middleware](&httpframework.StripPrefix{
			Prefix: os.Getenv("SUBSTRATE_URL_PREFIX"),
		}),
		As[exports.Changed](&exports.PublishingSink{}),
	)

	engine.Run(units...)
}

func As[T any](unit T) engine.Unit {
	return unit
}

func AppendUnits[T any](acc []engine.Unit, more ...T) []engine.Unit {
	for _, u := range more {
		acc = append(acc, u)
	}
	return acc
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
