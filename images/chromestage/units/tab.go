package units

import (
	"context"
	"fmt"
	"time"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"

	"github.com/chromedp/cdproto/runtime"
	"github.com/chromedp/chromedp"
	"github.com/chromedp/chromedp/kb"
)

type TabCommands struct {
	CDP *RemoteCDP

	commands.Source
}

var _ commands.Source = (*TabCommands)(nil)

type Void struct{}

type NavigateReturns struct {
	Navigated bool   `json:"navigated"`
	Lazy      bool   `json:"lazy"`
	Previous  string `json:"previous"`
	Current   string `json:"current"`
}

func (a *TabCommands) Initialize() {
	a.Source = commands.List[commands.Source](
		handle.Command(
			"navigate",
			"Visit the given `url`",
			func(ctx context.Context, t *struct{}, args struct {
				URL  string `json:"url"`
				Lazy bool   `json:"lazy"`
			}) (NavigateReturns, error) {
				url := args.URL
				var u string
				lazy := args.Lazy
				if lazy {
					err := a.CDP.Run(chromedp.Location(&u))
					if err != nil {
						return NavigateReturns{}, err
					}

					if u == url {
						return NavigateReturns{
							Navigated: false,
							Previous:  u,
							Lazy:      lazy,
							Current:   url,
						}, nil
					}
				}

				return NavigateReturns{
					Navigated: true,
					Lazy:      lazy,
					Previous:  u,
					Current:   url,
				}, a.CDP.Run(chromedp.Navigate(url))
			}),
		handle.Command(
			"reload",
			"Reload the tab's current url",
			func(ctx context.Context, t *struct{}, args struct{}) (Void, error) {
				return Void{}, a.CDP.Run(chromedp.Reload())
			}),
		handle.Command(
			"back",
			"Go to the previous page",
			func(ctx context.Context, t *struct{}, args struct{}) (Void, error) {
				return Void{}, a.CDP.Run(chromedp.NavigateBack())
			}),
		handle.Command(
			"evaluate",
			"Evaluate given javascript",
			func(ctx context.Context, t *struct{}, args struct {
				JS string `json:"js"`
			}) (map[string]any, error) {
				var result map[string]any
				return result, a.CDP.Run(chromedp.Evaluate(args.JS,
					&result,
					func(ep *runtime.EvaluateParams) *runtime.EvaluateParams {
						return ep.WithAwaitPromise(true)
					},
				))
			}),
		handle.Command(
			"scrollup",
			"Scroll up",
			func(ctx context.Context, t *struct{}, args struct{}) (Void, error) {
				return Void{}, a.CDP.Run(chromedp.KeyEvent(kb.Shift + " "))
			}),
		handle.Command(
			"scrolldown",
			"Scroll down",
			func(ctx context.Context, t *struct{}, args struct{}) (Void, error) {
				return Void{}, a.CDP.Run(chromedp.KeyEvent(" "))
			}),
		handle.Command(
			"click",
			"Click on a link with the given `text`",
			func(ctx context.Context, t *struct{}, args struct {
				Timeout  string `json:"timeout"`
				Selector string `json:"selector"`
				Text     string `json:"text"`
			}) (Void, error) {
				cdp := a.CDP
				timeout := args.Timeout
				if timeout != "" {
					dur, err := time.ParseDuration(timeout)
					if err != nil {
						return Void{}, err
					}

					cdp = cdp.WithTimeout(dur)
					defer cdp.Terminate()
				}

				selector := args.Selector
				if selector != "" {
					text := args.Text
					if text != "" {
						selector = fmt.Sprintf(`//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '%s')]`, text)
					}
				}
				// return Void{}, chromedp.Run(ctx, chromedp.Click(selector, chromedp.NodeVisible))
				return Void{}, cdp.Run(chromedp.Click(selector))
			}),
	)
}
