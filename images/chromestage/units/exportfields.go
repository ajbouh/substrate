package units

import (
	"context"
	"log"

	"github.com/ajbouh/substrate/pkg/toolkit/exports"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/chromedp/cdproto/runtime"
	"github.com/chromedp/chromedp"
)

type ExportChromeDPFields struct {
	exports        map[string]any
	ExportsChanged []notify.Notifier[exports.Changed]
	CDP            *RemoteCDP
}

func (c *ExportChromeDPFields) Initialize() {
	c.exports = map[string]any{}
}

func (c *ExportChromeDPFields) Exports(ctx context.Context) (any, error) {
	return c.exports, nil
}

func (c *ExportChromeDPFields) Refresh() {
	log.Printf("ExportChromeDPFields.Refresh() ...")
	defer log.Printf("ExportChromeDPFields.Refresh() ... done")
	var result map[string]any
	err := c.CDP.Run(
		chromedp.Evaluate((`
(function() {
	const metas = document.querySelectorAll('meta[name]')
	return {
		url: document.location.href,
		title: document.title,
		screen: {
			availHeight: screen.availHeight,
			availLeft: screen.availLeft,
			availTop: screen.availTop,
			availWidth: screen.availWidth,
			colorDepth: screen.colorDepth,
			height: screen.height,
			isExtended: screen.isExtended,
			pixelDepth: screen.pixelDepth,
			width: screen.width,
			orientation: {
				angle: screen.orientation.angle,
				type: screen.orientation.type,
			},
		},
		body: {
			scrollWidth: document.body.scrollWidth,
			scrollHeight: document.body.scrollHeight,
			clientWidth: document.body.clientWidth,
			clientHeight: document.body.clientHeight,
			offsetWidth: document.body.offsetWidth,
			offsetHeight: document.body.offsetHeight,
		},
		meta: Object.fromEntries(Array.from(metas, meta => [
			meta.getAttribute('name') || meta.getAttribute('property'),
			meta.getAttribute('content'),
		])),
	}
})()
`),
			&result,
			func(ep *runtime.EvaluateParams) *runtime.EvaluateParams {
				return ep.WithAwaitPromise(true)
			},
		),
	)

	log.Printf("ExportChromeDPFields.Refresh() ... result=%#v err=%#v", result, err)

	if err == nil {
		c.exports = map[string]any{"data": result}
	} else {
		log.Printf("error getting chromedp fields from document to export: %#v", err)
		c.exports = map[string]any{}
	}

	go notify.Notify(context.Background(), c.ExportsChanged, exports.Changed{})
}
