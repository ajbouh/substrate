package units

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/chromedp/cdproto/page"
)

type PageEvents struct {
	CDP *RemoteCDP

	EventFrameResized   []notify.Notifier[*page.EventFrameResized]
	EventLifecycleEvent []notify.Notifier[*page.EventLifecycleEvent]
	EventLoadEventFired []notify.Notifier[*page.EventLoadEventFired]
	EventFrameNavigated []notify.Notifier[*page.EventFrameNavigated]
}

func (c *PageEvents) Serve(ctx context.Context) {
	c.CDP.ListenTarget(ctx, func(ev interface{}) {
		switch ev := ev.(type) {
		case *page.EventFrameResized:
			notify.Notify(ctx, c.EventFrameResized, ev)
		case *page.EventLifecycleEvent:
			notify.Notify(ctx, c.EventLifecycleEvent, ev)
			// ev.FrameID
			// ev.LoaderID
			// ev.Name
			// ev.Timestamp
			// switch ev.Name {
			// case "DOMContentLoaded":
			// 	go c.Refresh()
			// }
			// log.Printf("event: %#v", ev)
		case *page.EventLoadEventFired:
			notify.Notify(ctx, c.EventLoadEventFired, ev)
			// ev.Timestamp
		case *page.EventFrameNavigated:
			notify.Notify(ctx, c.EventFrameNavigated, ev)
			// ev.Frame.ParentID
			// ev.Frame.URL
		}
	})
}
