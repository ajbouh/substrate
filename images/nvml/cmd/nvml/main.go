package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"

	"github.com/NVIDIA/go-nvml/pkg/dl"
	"github.com/ajbouh/substrate/images/nvml"
	"github.com/ajbouh/substrate/pkg/cueloader"
	"github.com/ajbouh/substrate/pkg/exports"
	"github.com/ajbouh/substrate/pkg/httpframework"
)

type Main struct {
	Daemon *daemon.Framework
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

	announcer := &cueloader.Announcer{
		ContentType: "application/json",
		Route:       "/",
	}

	sampler := &nvml.Sampler{
		MachineID: os.Getenv("SUBSTRATE_MACHINE_ID"),
	}

	engine.Run(
		Main{},
		announcer,
		sampler,
		&httpframework.Framework{},
		&exports.PublishingSink{},
		&exports.Sampler[*nvml.Sample]{
			Interval: time.Second * 60,
			SampleFunc: func() (*nvml.Sample, error) {
				value, err := sampler.Get()
				if err != nil {
					announcer.Announce([]byte(fmt.Sprintf(`{"error": %q}`, err.Error())))
				} else {
					if b, err := json.Marshal(&value); err != nil {
						announcer.Announce([]byte(fmt.Sprintf(`{"error": %q}`, err.Error())))
					} else {
						announcer.Announce(b)
					}
				}
				return value, err
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
