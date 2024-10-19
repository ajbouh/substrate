package main

import (
	"context"
	"os"
	"time"

	"github.com/ajbouh/substrate/images/sys"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/exports"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

func main() {
	sys.SetSysfsd("/hostsys")

	type Sample = sys.Sample
	type Sampler = sys.Sampler

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
