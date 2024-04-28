package main

import (
	"chromestage/commands"
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/chromedp/cdproto/runtime"
	"github.com/chromedp/chromedp"
)

// Sources commands based on the page currently loaded in the tab
type PageCommands struct {
	CDP    *RemoteCDP
	Prefix string
}

var _ commands.Source = (*PageCommands)(nil)

func (c *PageCommands) Reflect(ctx context.Context) (commands.DefIndex, error) {
	page := commands.DefIndex{}
	err := c.CDP.Run(
		chromedp.Evaluate(`window?.substrate?.r0?.commands?.index`, &page),
	)
	if err != nil {
		return nil, err
	}

	ci := commands.DefIndex{}
	for name, def := range page {
		ci[c.Prefix+name] = def
	}
	return ci, nil
}

func (c *PageCommands) Run(ctx context.Context, name string, p commands.Fields) (commands.Fields, error) {
	if !strings.HasPrefix(name, "page:") {
		return nil, commands.ErrNoSuchCommand
	}

	name = strings.TrimPrefix(name, "page:")

	b, err := json.Marshal(p)
	if err != nil {
		return nil, err
	}

	var result commands.Fields
	err = c.CDP.Run(
		chromedp.Evaluate(fmt.Sprintf(`window.substrate.r0.commands.run(%q,%s)`, name, string(b)),
			&result,
			func(ep *runtime.EvaluateParams) *runtime.EvaluateParams {
				return ep.WithAwaitPromise(true)
			},
		),
	)
	return result, err
}
