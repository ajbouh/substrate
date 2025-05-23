package units

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"sync"
	"time"

	"github.com/chromedp/chromedp"
)

type RemoteCDP struct {
	Endpoint string

	mu         *sync.Mutex
	cdpContext context.Context

	finish func()
}

func (a *RemoteCDP) Run(actions ...chromedp.Action) error {
	log.Printf("RemoteCDP.Run(...) %#v", actions)
	defer log.Printf("RemoteCDP.Run(...) Done; %#v", actions)

	a.mu.Lock()
	defer a.mu.Unlock()
	return chromedp.Run(a.cdpContext, actions...)
}

func (a *RemoteCDP) ListenTarget(ctx context.Context, fn func(ev interface{})) {
	a.mu.Lock()
	defer a.mu.Unlock()
	childCtx, cancel := context.WithCancel(a.cdpContext)
	go func() {
		defer cancel()
		<-ctx.Done()
	}()
	chromedp.ListenTarget(childCtx, fn)

}

func (a *RemoteCDP) WithTimeout(d time.Duration) *RemoteCDP {
	a.mu.Lock()
	defer a.mu.Unlock()
	ctx, cancel := context.WithTimeout(a.cdpContext, d)
	return &RemoteCDP{
		mu:         a.mu,
		cdpContext: ctx,
		finish:     cancel,
	}
}

func (a *RemoteCDP) Initialize() {
	if a.mu == nil {
		a.mu = &sync.Mutex{}
	}
	if a.cdpContext == nil {
		ctx := context.Background()

		upstream, err := url.Parse(a.Endpoint + "/json/version/")
		if err != nil {
			panic(fmt.Errorf("error parsing upstream url for /json/version: %w", err))
		}

		err = waitForReady(ctx, upstream.String(), tcpHTTPGetJSONFunc(upstream), time.Millisecond*100, 10*time.Second, 100)
		if err != nil {
			panic(fmt.Errorf("error waiting for %s to be ready: %w", upstream.String(), err))
		}

		ctx, _ = chromedp.NewRemoteAllocator(ctx, a.Endpoint)
		a.cdpContext, a.finish = chromedp.NewContext(ctx)
	}
}

func (a *RemoteCDP) Terminate() {
	a.mu.Lock()
	defer a.mu.Unlock()
	a.finish()
}
