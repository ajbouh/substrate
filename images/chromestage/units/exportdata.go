package units

import (
	"context"
	"log"
	"net/url"
	"os"

	"github.com/ajbouh/substrate/pkg/toolkit/exports"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type InitialExports struct {
	ChromeDPProxy *ChromeDPProxy
	OriginScheme  string
	OriginHost    string

	ExportsChanged []notify.Notifier[exports.Changed]

	exports  map[string]any
	readyCtx context.Context
	ready    func()
}

func (m *InitialExports) Initialize() {
	m.readyCtx, m.ready = context.WithCancel(context.Background())
}

func (c *InitialExports) Exports(ctx context.Context) (any, error) {
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

	go notify.Notify(context.Background(), m.ExportsChanged, exports.Changed{})
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
		"data": map[string]any{
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
		},
	}, nil
}
