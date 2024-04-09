package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/ajbouh/substrate/images/sigar"

	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"

	"github.com/ajbouh/substrate/pkg/cueloader"
	"github.com/ajbouh/substrate/pkg/exports"
	"github.com/ajbouh/substrate/pkg/httpframework"
)

type Main struct {
	listenAddr string

	Daemon *daemon.Framework
}

func main() {
	sigar.SetProcd("/hostproc")

	announcer := &cueloader.Announcer{
		ContentType: "application/json",
		Route:       "/",
	}

	engine.Run(
		Main{},
		announcer,
		&httpframework.Framework{},
		&exports.PublishingSink{},
		&exports.Sampler[*sigar.Sample]{
			Interval: time.Second * 60,
			SampleFunc: func() (*sigar.Sample, error) {
				value, err := sigar.GetSample()
				if err != nil {
					announcer.Announce([]byte(fmt.Sprintf(`{"error": %q}`, err.Error())))
				} else {
					if b, err := json.Marshal(&value); err != nil {
						announcer.Announce([]byte(fmt.Sprintf(`{"error": %q}`, err.Error())))
					} else {
						announcer.Announce(b)
					}
				}

				return value, nil
			},
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
