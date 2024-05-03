package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ajbouh/substrate/images/renkon/dist"
	"github.com/ajbouh/substrate/pkg/httpframework"

	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"
)

func main() {
	engine.Run(
		Main{},
		&httpframework.Framework{},
		&httpframework.StripPrefix{
			Prefix: os.Getenv("SUBSTRATE_URL_PREFIX"),
		},
		httpframework.Route{
			Route:   "/",
			Handler: http.StripPrefix("/", http.FileServer(http.FS(dist.Dir))),
		},
	)
}

type Main struct {
	Daemon *daemon.Framework
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
