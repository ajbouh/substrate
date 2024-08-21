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

func main() {
	prefix := os.Getenv("SUBSTRATE_URL_PREFIX")
	engine.Run(
		Main{},
		&httpframework.Framework{},
		&httpframework.StripPrefix{Prefix: prefix},
		&commands.HTTPHandler{
			Debug: true,
			Route: "/",
		},
		&commands.Aggregate{},
		commands.NewStaticSource[any](
			[]commands.Entry{{
				Name: "hourly",
				Def: commands.Def{
					Description: "Get the weather forecast for next 24 hours in a given ZIP code.",
					Parameters: commands.FieldDefs{
						"zip_code": {
							Name:        "zip_code",
							Type:        "string",
							Description: "The 5-digit US ZIP code.",
						},
					},
					Returns: commands.FieldDefs{
						"forecast": {
							Name: "forecast",
							// Type:        "string",
							Description: "The forecast for the next 24 hours.",
						},
					},
				},
				Run: func(ctx context.Context, p commands.Fields) (commands.Fields, error) {
					// zip := p.String("zip")
					return commands.Fields{
						"forecast": map[string]any{
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
				},
			}},
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
