package main

import (
	"context"
	"os"
	"time"

	"github.com/ajbouh/substrate/images/sigar"

	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/exports"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

func main() {
	sigar.SetProcd("/hostproc")

	type Sample = sigar.Sample
	type Sampler = sigar.Sampler

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
