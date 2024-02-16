# chromestage

Programmable Chrome instance with VNC and FLV streaming.

## Build
```
docker build -t chromestage .
```

### Run
```
docker run -it --rm -p 8000:8000 chromestage
```
Port 8000 serves CDP for controlling Chrome as well as a web-based VNC viewer at `/vnc` and a direct WebSocket to VNC endpoint at `/vnc/ws`. The VNC password is `chromestage`.

### Example CDP program
```go
package main

import (
	"context"
	"log"
	"time"

	"github.com/chromedp/chromedp"
)

func main() {
	allocatorCtx, cancel := chromedp.NewRemoteAllocator(context.Background(), "ws://localhost:8000/")
	defer cancel()

	ctx, cancel := chromedp.NewContext(allocatorCtx)
	defer cancel()

	err := chromedp.Run(ctx,
		chromedp.Navigate("http://example.com"),
	)
	if err != nil {
		log.Fatal(err)
	}
	<-time.After(3 * time.Second)
}

```

## Streaming
By providing an rtmp endpoint as an argument when running the container, audio and video of the Chrome instance will be streamed to the endpoint via ffmpeg. 

This can be converted to an HLS server for AppleTV/Chromecast with:
https://github.com/gwuhaolin/livego

This could be built-in, but HLS comes with a 5-15s delay that makes it unusable for realtime interaction. Alternatively, we're looking at using WebRTC to stream to a page AppleTV/Chromecast can load.

## Misc
Control AppleTV programmatically with:
https://github.com/postlund/pyatv


