package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"

	"github.com/NVIDIA/go-nvml/pkg/dl"
	"github.com/ajbouh/substrate/images/nvml"
	"github.com/ajbouh/substrate/pkg/cueloader"
)

type Main struct {
	listenAddr string

	Daemon *daemon.Framework

	Sampler *nvml.Sampler
}

func testLoad() {
	l := dl.New("libnvidia-ml.so.1", dl.RTLD_LAZY|dl.RTLD_GLOBAL)

	err := l.Open()
	if err == nil {
		defer l.Close()
	}

	fmt.Printf("testLoad: %s\n", err)
}

func main() {
	testLoad()

	engine.Run(
		Main{
			listenAddr: ":" + os.Getenv("PORT"),
		},
		&nvml.Sampler{},
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

func (m *Main) doSample(announcer *cueloader.Announcer) {
	if sample, err := m.Sampler.Get(); err != nil {
		announcer.Announce([]byte(fmt.Sprintf(`{"error": %q}`, err.Error())))
	} else {
		if b, err := json.Marshal(&sample); err != nil {
			announcer.Announce([]byte(fmt.Sprintf(`{"error": %q}`, err.Error())))
		} else {
			announcer.Announce(b)
		}
	}

}

func (m *Main) poll(announcer *cueloader.Announcer, ctx context.Context, interval time.Duration) {
	m.doSample(announcer)

	tick := time.Tick(interval)

	for {
		select {
		case <-ctx.Done():
			return
		case <-tick:
			m.doSample(announcer)
		}
	}
}

func (m *Main) Serve(ctx context.Context) {
	announcer := cueloader.NewAnnouncer("application/json")

	go m.poll(announcer, context.Background(), time.Second*60)

	log.Printf("running on http://%s ...", m.listenAddr)
	log.Fatal(http.ListenAndServe(m.listenAddr, announcer))
}
