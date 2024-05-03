package main

import (
	"context"
	"fmt"
	"time"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"

	"github.com/chromedp/cdproto/runtime"
	"github.com/chromedp/chromedp"
	"github.com/chromedp/chromedp/kb"
)

type TabCommands struct {
	CDP *RemoteCDP

	commands.Source
}

var _ commands.Source = (*TabCommands)(nil)

func (a *TabCommands) Initialize() {
	a.Source = commands.NewStaticSource[TabCommands](
		[]commands.Entry{
			{
				Name: "navigate",
				Def: commands.Def{
					Description: "Visit the given `url`",
					Parameters: commands.FieldDefs{
						"url": commands.FieldDef{
							Type: "string",
						},
						"lazy": commands.FieldDef{
							Type: "boolean",
						},
					},
				},
				Run: func(_ context.Context, p commands.Fields) (commands.Fields, error) {
					url := p.String("url")
					var u string
					lazy := p.Bool("lazy")
					if lazy {
						err := a.CDP.Run(chromedp.Location(&u))
						if err != nil {
							return nil, err
						}

						if u == url {
							return commands.Fields{
								"navigated": false,
								"previous":  u,
								"lazy":      lazy,
								"current":   url,
							}, nil
						}
					}

					return commands.Fields{
						"navigated": true,
						"lazy":      lazy,
						"previous":  u,
						"current":   url,
					}, a.CDP.Run(chromedp.Navigate(url))
				},
			},
			{
				Name: "reload",
				Def: commands.Def{
					Description: "Reload the tab's current url",
				},
				Run: func(_ context.Context, p commands.Fields) (commands.Fields, error) {
					return nil, a.CDP.Run(chromedp.Reload())
				},
			},
			{
				Name: "back",
				Def: commands.Def{
					Description: "Go to the previous page",
				},
				Run: func(_ context.Context, p commands.Fields) (commands.Fields, error) {
					return nil, a.CDP.Run(chromedp.NavigateBack())
				},
			},
			{
				Name: "evaluate",
				Def: commands.Def{
					Description: "Evaluate given javascript",
				},
				Run: func(_ context.Context, p commands.Fields) (commands.Fields, error) {
					var result commands.Fields
					return result, a.CDP.Run(chromedp.Evaluate(p.String("js"),
						&result,
						func(ep *runtime.EvaluateParams) *runtime.EvaluateParams {
							return ep.WithAwaitPromise(true)
						},
					),
					)
				},
			},
			{
				Name: "scrollup",
				Def: commands.Def{
					Description: "Scroll up",
				},
				Run: func(_ context.Context, p commands.Fields) (commands.Fields, error) {
					return nil, a.CDP.Run(chromedp.KeyEvent(kb.Shift + " "))
				},
			},
			{
				Name: "scrolldown",
				Def: commands.Def{
					Description: "Scroll down",
				},
				Run: func(_ context.Context, p commands.Fields) (commands.Fields, error) {
					return nil, a.CDP.Run(chromedp.KeyEvent(" "))
				},
			},
			{
				Name: "click",
				Def: commands.Def{
					Description: "Click on a link with the given `text`",
				},
				Run: func(_ context.Context, p commands.Fields) (commands.Fields, error) {
					cdp := a.CDP
					timeout := p.String("timeout")
					if timeout != "" {
						dur, err := time.ParseDuration(timeout)
						if err != nil {
							return nil, err
						}

						cdp = cdp.WithTimeout(dur)
						defer cdp.Terminate()
					}

					selector := p.String("selector")
					if selector != "" {
						text := p.String("text")
						if text != "" {
							selector = fmt.Sprintf(`//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '%s')]`, text)
						}
					}
					// return nil, chromedp.Run(ctx, chromedp.Click(selector, chromedp.NodeVisible))
					return nil, cdp.Run(chromedp.Click(selector))
				},
			},
		})
}
