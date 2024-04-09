package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/ajbouh/substrate/images/sigar"

	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"

	"github.com/ajbouh/substrate/pkg/cueloader"
)

type Main struct {
	listenAddr string

	Daemon *daemon.Framework
}

func main() {
	sigar.SetProcd("/hostproc")

	engine.Run(
		Main{
			listenAddr: ":" + os.Getenv("PORT"),
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

func doSample(announcer *cueloader.Announcer) {
	sample, err := sigar.GetSample()
	if err != nil {
		announcer.Announce([]byte(fmt.Sprintf(`{"error": %q}`, err.Error())))
		return
	}

	if b, err := json.Marshal(&sample); err != nil {
		announcer.Announce([]byte(fmt.Sprintf(`{"error": %q}`, err.Error())))
	} else {
		announcer.Announce(b)
	}

}

func poll(announcer *cueloader.Announcer, ctx context.Context, interval time.Duration) {
	doSample(announcer)

	tick := time.Tick(interval)

	for {
		select {
		case <-ctx.Done():
			return
		case <-tick:
			doSample(announcer)
		}
	}
}

func (m *Main) Serve(ctx context.Context) {
	announcer := cueloader.NewAnnouncer("application/json")

	go poll(announcer, context.Background(), time.Second*60)

	log.Printf("running on http://%s ...", m.listenAddr)
	log.Fatal(http.ListenAndServe(m.listenAddr, announcer))
}
