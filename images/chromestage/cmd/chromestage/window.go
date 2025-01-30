package main

import (
	"context"
	"fmt"
	"os/exec"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
)

func WindowCommands() commands.Source {
	return commands.List(
		handle.Command(
			"resize",
			"Resize the window to the given `width` and `height`",
			func(ctx context.Context, t *struct{}, args struct {
				Width  int64 `json:"width"`
				Height int64 `json:"height"`
			}) (struct{}, error) {
				if err := exec.Command("xrandr", "-s", fmt.Sprintf("%dx%d", args.Width, args.Height)).Run(); err != nil {
					return struct{}{}, err
				}
				if err := exec.Command(
					"xdotool", "getwindowfocus",
					"windowsize", fmt.Sprintf("%d", args.Width), fmt.Sprintf("%d", args.Height),
				).Run(); err != nil {
					return struct{}{}, err
				}
				return struct{}{}, nil
			},
		),
	)
}
