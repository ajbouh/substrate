package units

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"

	"github.com/chromedp/cdproto/runtime"
	"github.com/chromedp/chromedp"
)

// Sources commands based on the page currently loaded in the tab
type PageCommands struct {
	CDP *RemoteCDP
}

var _ commands.Source = (*PageCommands)(nil)

func (c *PageCommands) Reflect(ctx context.Context) (commands.DefIndex, error) {
	page := commands.DefIndex{}
	err := c.CDP.Run(
		chromedp.Evaluate(
			`window?.substrate?.r0?.commands?.index`,
			&page,
			func(ep *runtime.EvaluateParams) *runtime.EvaluateParams {
				return ep.WithAwaitPromise(true)
			},
		),
	)

	return page, err
}

func (c *PageCommands) Run(ctx context.Context, name string, p commands.Fields) (commands.Fields, error) {
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
