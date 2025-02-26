package units

import (
	"context"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"

	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/cdproto/runtime"
	"github.com/chromedp/chromedp"
	"github.com/chromedp/chromedp/kb"
)

type Void struct{}

type EvaluateReturns struct {
	Result map[string]any `json:"result"`
}

type NavigateReturns struct {
	Navigated bool   `json:"navigated"`
	Lazy      bool   `json:"lazy"`
	Previous  string `json:"previous"`
	Current   string `json:"current"`
}

type RasterizeReturns struct {
	MimeType string `json:"mimeType"`
	Base64   string `json:"base64"`
}

var TabCommands = []engine.Unit{
	handle.Command(
		"navigate",
		"Visit the given `url`",
		func(ctx context.Context, t *struct {
			CDP *RemoteCDP
		}, args struct {
			URL  string `json:"url"`
			Lazy bool   `json:"lazy"`
		}) (NavigateReturns, error) {
			url := args.URL
			var u string
			lazy := args.Lazy
			if lazy {
				err := t.CDP.Run(chromedp.Location(&u))
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
			}, t.CDP.Run(chromedp.Navigate(url))
		}),
	handle.Command(
		"reload",
		"Reload the tab's current url",
		func(ctx context.Context, t *struct {
			CDP *RemoteCDP
		}, args struct{}) (Void, error) {
			return Void{}, t.CDP.Run(chromedp.Reload())
		}),
	handle.Command(
		"back",
		"Go to the previous page",
		func(ctx context.Context, t *struct {
			CDP *RemoteCDP
		}, args struct{}) (Void, error) {
			return Void{}, t.CDP.Run(chromedp.NavigateBack())
		}),
	handle.Command(
		"evaluate",
		"Evaluate given javascript",
		func(ctx context.Context, t *struct {
			CDP *RemoteCDP
		}, args struct {
			JS string `json:"js"`
		}) (EvaluateReturns, error) {
			er := EvaluateReturns{
				Result: map[string]any{},
			}
			return er, t.CDP.Run(chromedp.Evaluate(args.JS,
				&er.Result,
				func(ep *runtime.EvaluateParams) *runtime.EvaluateParams {
					return ep.WithAwaitPromise(true)
				},
			))
		}),
	handle.Command(
		"scrollup",
		"Scroll up",
		func(ctx context.Context, t *struct {
			CDP *RemoteCDP
		}, args struct{}) (Void, error) {
			return Void{}, t.CDP.Run(chromedp.KeyEvent(kb.Shift + " "))
		}),
	handle.Command(
		"scrolldown",
		"Scroll down",
		func(ctx context.Context, t *struct {
			CDP *RemoteCDP
		}, args struct{}) (Void, error) {
			return Void{}, t.CDP.Run(chromedp.KeyEvent(" "))
		}),
	handle.Command(
		"click",
		"Click on a link with the given `text`",
		func(ctx context.Context, t *struct {
			CDP *RemoteCDP
		}, args struct {
			Timeout  string `json:"timeout"`
			Selector string `json:"selector"`
			Text     string `json:"text"`
		}) (Void, error) {
			cdp := t.CDP
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
	handle.Command(
		"rasterize",
		"Save the tab as an image",
		func(ctx context.Context, t *struct {
			CDP *RemoteCDP
		}, args struct {
			Timeout      string `json:"timeout"`
			OnlyViewport bool   `json:"onlyViewport"`
			Selector     string `json:"selector"`
			Format       string `json:"format"`  // either png or jpeg
			Quality      int64  `json:"quality"` // either png or jpeg
		}) (RasterizeReturns, error) {
			cdp := t.CDP
			timeout := args.Timeout
			if timeout != "" {
				dur, err := time.ParseDuration(timeout)
				if err != nil {
					return RasterizeReturns{}, err
				}

				cdp = cdp.WithTimeout(dur)
				defer cdp.Terminate()
			}

			if args.Format == "" {
				if args.Quality == 100 {
					args.Format = "png"
				} else {
					args.Format = "jpeg"
				}
			}

			var mimeType string
			switch args.Format {
			case "png":
				mimeType = "image/png"
			case "jpeg":
				mimeType = "image/jpeg"
			}

			var buf []byte
			err := cdp.Run(
				chromedp.ActionFunc(func(ctx context.Context) error {
					var err error
					buf, err = page.CaptureScreenshot().
						WithCaptureBeyondViewport(!args.OnlyViewport).
						WithFromSurface(!args.OnlyViewport).
						WithFormat(page.CaptureScreenshotFormat(args.Format)).
						WithQuality(args.Quality).
						Do(ctx)
					return err
				}))
			if err != nil {
				return RasterizeReturns{}, err
			}

			return RasterizeReturns{
				Base64:   base64.RawStdEncoding.EncodeToString(buf),
				MimeType: mimeType,
			}, err
		},
	),
}
