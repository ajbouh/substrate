package units

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"sync"

	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
)

type PinnedInstances struct {
	InternalSubstrateOrigin string

	ctx  context.Context
	mu   sync.Mutex
	pins map[string]func(err error)
}

func (l *PinnedInstances) Initialize() {
	l.pins = map[string]func(err error){}
}

func (l *PinnedInstances) Serve(ctx context.Context) {
	l.ctx = ctx
}

func (l *PinnedInstances) Refresh(defSet *defset.DefSet) {
	slog.Info("PinnedInstances.Refresh() ...")
	defer slog.Info("PinnedInstances.Refresh() done")

	// copy forward, delete whatever's left in stale
	stale := l.pins
	pins := map[string]func(err error){}
	type freshPin struct {
		ctx    context.Context
		cancel func(err error)
	}
	fresh := map[string]freshPin{}

	l.mu.Lock()
	err := EachInstance(defSet, func(serviceName, instanceName string, instanceValue *struct {
		Pinned bool `json:"pinned"`
	}) {
		cancel := l.pins[instanceName]
		if instanceValue.Pinned {
			if cancel == nil {
				var ctx context.Context
				// TODO should this be l.ctx?
				ctx, cancel = context.WithCancelCause(context.Background())
				fresh[instanceName] = freshPin{ctx: ctx, cancel: cancel}
				go func() {
					<-ctx.Done()
					// TODO show this as an error if it is one.
					slog.Info("pinned service instance connection gone", "instanceName", instanceName, "err", ctx.Err())
				}()
			} else {
				// if it's still pinned, it's not stale!
				slog.Info("pinned service instance still here", "instanceName", instanceName)
				delete(stale, instanceName)
			}
			pins[instanceName] = cancel
		}
	})
	if err != nil {
		slog.Info("error looking for pinned services", "err", err)
	} else {
		// remember pins and cancel stales
		l.pins = pins
		for instanceName, cancel := range stale {
			slog.Info("cancelling now-unpinned service instance", "instanceName", instanceName)
			cancel(fmt.Errorf("unpinned"))
		}
	}
	l.mu.Unlock()

	for instanceName, p := range fresh {
		go func() {
			url := l.InternalSubstrateOrigin + "/" + instanceName + "/"
			slog.Info("connecting to now-pinned service instance", "instanceName", instanceName, "url", url)
			req, err := http.NewRequestWithContext(p.ctx, "GET", url, nil)
			if err != nil {
				slog.Info("cancelling pinned context", "err", err)
				p.cancel(err)
				return
			}

			slog.Info("reading stream events", "instanceName", instanceName, "url", url)
			err = httpevents.ReadStreamEvents(http.DefaultClient, req, func(event *httpevents.Event) error {
				slog.Info("saw stream event", "instanceName", instanceName)
				return nil
			})
			slog.Info("cancelling pinned context", "err", err)
			p.cancel(err)
		}()
	}
}
