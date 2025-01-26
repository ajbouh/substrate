package units

import (
	"context"
	"net/url"
	"os"

	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

type VNCLinks struct {
	Scheme string
	Host   string
}

func (m *VNCLinks) QueryLinks(ctx context.Context) (links.Links, error) {
	prefix := httpframework.ContextPrefix(ctx)
	var vncURL url.URL
	vncURL.Scheme = m.Scheme
	vncURL.Host = m.Host
	vncURL.Path = prefix + "/vnc/"
	return links.Links{
		"multimedia/vnc": links.Link{
			HREF: vncURL.String(),
		},
	}, nil

}

type ChromeDPLinks struct {
	ChromeDPProxy *ChromeDPProxy
	Scheme        string
	Host          string
}

func (m *ChromeDPLinks) QueryLinks(ctx context.Context) (links.Links, error) {
	_, debugger, err := m.ChromeDPProxy.GetAndFixUpstreamJSONVersion(ctx)
	if err != nil {
		return nil, err
	}

	if m.Scheme == "https" {
		debugger.Scheme = "wss"
	} else {
		debugger.Scheme = "ws"
	}
	debugger.Host = m.Host

	prefix := httpframework.ContextPrefix(ctx)

	devtools := *debugger
	devtools.Scheme = m.Scheme
	devtools.Path = prefix + "/devtools/inspector.html"
	devtoolsQuery := url.Values{}
	if debugger.Scheme == "wss" {
		devtoolsQuery.Set("wss", debugger.String()[len(debugger.Scheme)+2:])
	} else {
		devtoolsQuery.Set("ws", debugger.String()[len(debugger.Scheme)+2:])
	}
	devtools.RawQuery = devtoolsQuery.Encode()

	return links.Links{
		"api/chromedp": links.Link{
			HREF: debugger.String(),
		},
		"debug/devtools": links.Link{
			HREF: devtools.String(),
		},
	}, nil
}

type MultimediaLinks struct{}

func (m *MultimediaLinks) QueryLinks(ctx context.Context) (links.Links, error) {
	return links.Links{
		"multimedia/rtsp_internal": links.Link{
			HREF: os.Getenv("MTX_RTSP_INTERNAL_ADDRESS_PREFIX"),
		},
		"multimedia/rtsp": links.Link{
			HREF: os.Getenv("MTX_RTSP_ADDRESS_PREFIX"),
		},
		"multimedia/embed": links.Link{
			HREF: os.Getenv("MTX_WEB_ADDRESS_PREFIX") + os.Getenv("MTX_WEB_ADDRESS_QUERY"),
		},
		"multimedia/embed_internal": links.Link{
			HREF: os.Getenv("MTX_WEB_INTERNAL_ADDRESS_PREFIX") + os.Getenv("MTX_WEB_ADDRESS_QUERY"),
		},
	}, nil
}
