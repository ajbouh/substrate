package main

import (
	"context"
	"log"
	"net/url"
	"os"

	"github.com/ajbouh/substrate/pkg/exports"
	"github.com/ajbouh/substrate/pkg/httpframework"
	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/cdproto/runtime"
	"github.com/chromedp/chromedp"
)

type InitialExports struct {
	ChromeDPProxy *ChromeDPProxy
	OriginScheme  string
	OriginHost    string

	ExportsChanged []exports.Changed

	exports  map[string]any
	readyCtx context.Context
	ready    func()
}

func (m *InitialExports) Initialize() {
	m.readyCtx, m.ready = context.WithCancel(context.Background())
}

func (c *InitialExports) Exports(ctx context.Context) (map[string]any, error) {
	<-c.readyCtx.Done()
	return c.exports, nil
}

func (m *InitialExports) Serve(ctx context.Context) {
	exp, err := m.InitialExports(ctx, m.OriginScheme, m.OriginHost)
	if err != nil {
		log.Fatalf("error computing initial exports: %#v", err)
	}

	m.exports = exp
	m.ready()

	go exports.NotifyChanged(m.ExportsChanged)
}

func (m *InitialExports) InitialExports(ctx context.Context, scheme, host string) (map[string]any, error) {
	_, debugger, err := m.ChromeDPProxy.GetAndFixUpstreamJSONVersion(ctx)
	if err != nil {
		return nil, err
	}

	if scheme == "https" {
		debugger.Scheme = "wss"
	} else {
		debugger.Scheme = "ws"
	}
	debugger.Host = host

	prefix := httpframework.ContextPrefix(ctx)

	devtools := *debugger
	devtools.Scheme = scheme
	devtools.Path = prefix + "/devtools/inspector.html"
	devtoolsQuery := url.Values{}
	if debugger.Scheme == "wss" {
		devtoolsQuery.Set("wss", debugger.String()[len(debugger.Scheme)+2:])
	} else {
		devtoolsQuery.Set("ws", debugger.String()[len(debugger.Scheme)+2:])
	}
	devtools.RawQuery = devtoolsQuery.Encode()

	var vncURL url.URL
	vncURL.Scheme = scheme
	vncURL.Host = host
	vncURL.Path = prefix + "/vnc"

	return map[string]any{
		"multimedia": map[string]string{
			"vnc":            vncURL.String(),
			"rtsp_internal":  os.Getenv("MTX_RTSP_INTERNAL_ADDRESS_PREFIX"),
			"rtsp":           os.Getenv("MTX_RTSP_ADDRESS_PREFIX"),
			"embed":          os.Getenv("MTX_WEB_ADDRESS_PREFIX") + os.Getenv("MTX_WEB_ADDRESS_QUERY"),
			"embed_internal": os.Getenv("MTX_WEB_INTERNAL_ADDRESS_PREFIX") + os.Getenv("MTX_WEB_ADDRESS_QUERY"),
		},
		"api": map[string]string{
			"chromedp": debugger.String(),
		},
		"debug": map[string]string{
			"devtools": devtools.String(),
		},
	}, nil
}

type ExportChromeDPFields struct {
	exports        map[string]any
	ExportsChanged []exports.Changed
	CDP            *RemoteCDP
}

func (c *ExportChromeDPFields) Exports(ctx context.Context) (map[string]any, error) {
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
		meta: Object.fromEntries(Array.from(metas, meta => [meta.getAttribute('name'), meta.getAttribute('content')])),
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
		c.exports = result
	} else {
		log.Printf("error getting chromedp fields from document to export: %#v", err)
		c.exports = map[string]any{}
	}

	go exports.NotifyChanged(c.ExportsChanged)
}

func (c *ExportChromeDPFields) Serve(ctx context.Context) {
	// document.querySelector("meta[property='og:image']").getAttribute("content");

	c.CDP.ListenTarget(ctx, func(ev interface{}) {
		switch ev := ev.(type) {
		case *page.EventFrameResized:
			log.Printf("event: %#v", ev)
		case *page.EventLifecycleEvent:
			// ev.FrameID
			// ev.LoaderID
			// ev.Name
			// ev.Timestamp
			switch ev.Name {
			case "DOMContentLoaded":
				go c.Refresh()
			}
			log.Printf("event: %#v", ev)
		case *page.EventLoadEventFired:
			// ev.Timestamp
			log.Printf("event: %#v", ev)
		case *page.EventFrameNavigated:
			// ev.Frame.ParentID
			// ev.Frame.URL
			log.Printf("event: %#v", ev)
		}
	})
}
