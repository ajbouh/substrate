package main

import (
	"chromestage/commands"
	"context"
	"log"
	"net/http"
	"time"

	"github.com/chromedp/chromedp"
)

type RemoteCDP struct {
	Endpoint string

	cdpContext context.Context

	finish func()
}

func (a *RemoteCDP) CDPContext() context.Context {
	return a.cdpContext
}

func (a *RemoteCDP) Run(actions ...chromedp.Action) error {
	return chromedp.Run(a.cdpContext, actions...)
}

func (a *RemoteCDP) WithTimeout(d time.Duration) *RemoteCDP {
	ctx, cancel := context.WithTimeout(a.cdpContext, d)
	return &RemoteCDP{
		cdpContext: ctx,
		finish:     cancel,
	}
}

func (a *RemoteCDP) Initialize() {
	log.Printf("RemoteCDP Initialize")
	if a.cdpContext == nil {
		ctx := context.Background()
		ctx, _ = chromedp.NewRemoteAllocator(ctx, a.Endpoint)
		a.cdpContext, a.finish = chromedp.NewContext(ctx)
	}
}

func (a *RemoteCDP) Terminate() {
	a.finish()
}

// TODO GET if accepts text/event-stream, stream update events
// func acceptsTextEventStream(r *http.Request) bool {
// 	availableMediaTypes := []contenttype.MediaType{
// 		contenttype.NewMediaType("text/plain"), // A dummy value so matching doesn't assume text/event-stream
// 		contenttype.NewMediaType("text/event-stream"),
// 	}
// 	if accepted, _, err := contenttype.GetAcceptableMediaType(r, availableMediaTypes); err == nil && accepted.Type == "text" && accepted.Subtype == "event-stream" {
// 		return true
// 	}
// 	return false
// }

type HTTPHandler struct {
	CommandHTTPHandler *commands.HTTPHandler
	Debug              bool
}

func (c *HTTPHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// GET returns commands (with meta header including url, update timestamp, revision id)
	// POST runs a command (accepts meta header including url, update timestamp, revision id; errors on meta mismatch)
	switch {
	case r.Method == http.MethodGet:
		c.CommandHTTPHandler.ServeHTTPReflect(w, r)
	case r.Method == http.MethodPost:
		c.CommandHTTPHandler.ServeHTTPRun(w, r)
	default:
		http.Error(w, `{"error": "method must be GET or POST"}`, http.StatusMethodNotAllowed)
	}
}
