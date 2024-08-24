package main

import (
	"context"
	"log"
	"os"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"
)

type HourlyReturns struct {
	Forecast map[string]any `json:"forecast" desc:"The forecast for the next 24 hours."`
}

func main() {
	prefix := os.Getenv("SUBSTRATE_URL_PREFIX")
	engine.Run(
		Main{},
		&httpframework.Framework{},
		&httpframework.StripPrefix{Prefix: prefix},
		&commands.HTTPSourceHandler{
			Debug: true,
			Route: "/",
		},
		&commands.Aggregate{},
		commands.List(
			commands.Command(
				"hourly",
				"Get the weather forecast for next 24 hours in a given ZIP code.",
				func(ctx context.Context, t *struct{}, args struct {
					ZipCode string `json:"zip_code" desc:"The 5-digit US ZIP code."`
				}) (HourlyReturns, error) {
					return HourlyReturns{
						Forecast: map[string]any{
							"current": map[string]any{
								"time":           "2022-01-01T15:00",
								"temperature_2m": 2.4,
								"wind_speed_10m": 11.9,
							},
							"hourly": map[string]any{
								"time":                 []string{"2022-07-01T00:00", "2022-07-01T01:00"},
								"wind_speed_10m":       []float32{3.16, 3.02, 3.3, 3.14, 3.2, 2.95},
								"temperature_2m":       []float32{13.7, 13.3, 12.8, 12.3, 11.8},
								"relative_humidity_2m": []float32{82, 83, 86, 85, 88, 88, 84, 76},
							},
						},
					}, nil
				}),
		),
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
