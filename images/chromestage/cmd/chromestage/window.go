package main

import (
	"context"
	"fmt"
	"os/exec"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

func WindowCommands() commands.Source {
	return commands.List(
		commands.Command(
			"resize",
			"Resize the window to the given `width` and `height`",
			func(ctx context.Context, t *struct{}, args struct {
				Width  int64 `json:"width"`
				Height int64 `json:"height"`
			}) (commands.Fields, error) {
				if err := exec.Command("xrandr", "-s", fmt.Sprintf("%dx%d", args.Width, args.Height)).Run(); err != nil {
					return nil, err
				}
				if err := exec.Command(
					"xdotool", "getwindowfocus",
					"windowsize", fmt.Sprintf("%d", args.Width), fmt.Sprintf("%d", args.Height),
				).Run(); err != nil {
					return nil, err
				}
				return nil, nil
			},
		),
	)
}
