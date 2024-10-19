package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/NVIDIA/go-nvml/pkg/dl"
	"github.com/ajbouh/substrate/images/nvml"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/exports"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

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

	type Sample = nvml.Sample
	type Sampler = nvml.Sampler

	engine.Run(
		&service.Service{
			ExportsRoute: "/",
		},
		&Sampler{
			MachineID: os.Getenv("SUBSTRATE_MACHINE_ID"),
		},
		&notify.Ticker[*Sample]{
			Interval: time.Second * 60,
		},
		notify.On(func(
			ctx context.Context,
			e notify.Tick[*Sample],
			t *struct {
				ExportsChanged []notify.Notifier[exports.Changed]
			},
		) {
			notify.Notify(ctx, t.ExportsChanged, exports.Changed{})
		}),
	)
}
