package main

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

type HourlyReturns struct {
	Forecast map[string]any `json:"forecast" desc:"The forecast for the next 24 hours."`
}

func main() {
	engine.Run(
		&service.Service{},
		commands.List(
			handle.Command(
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
