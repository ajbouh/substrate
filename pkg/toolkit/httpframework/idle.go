package httpframework

import (
	"context"
	"net"
	"net/http"
	"sync"
	"time"
)

type IdleTracker struct {
	IdleAfter time.Duration

	IdleNow func(time.Time)

	mu     sync.Mutex
	active map[net.Conn]bool
	timer  *time.Timer
}

func (t *IdleTracker) Initialize() {
	t.active = map[net.Conn]bool{}
	t.timer = time.NewTimer(t.IdleAfter)
}

func (t *IdleTracker) Serve(ctx context.Context) {
	for at := range t.done() {
		t.IdleNow(at)
	}
}

func (t *IdleTracker) ConnState(conn net.Conn, state http.ConnState) {
	t.mu.Lock()
	defer t.mu.Unlock()

	oldActive := len(t.active)
	switch state {
	case http.StateNew, http.StateActive, http.StateHijacked:
		t.active[conn] = true
		// stop the timer if we transitioned to idle
		if oldActive == 0 {
			t.timer.Stop()
		}
	case http.StateIdle, http.StateClosed:
		delete(t.active, conn)
		// Restart the timer if we've become idle
		if oldActive > 0 && len(t.active) == 0 {
			t.timer.Reset(t.IdleAfter)
		}
	}
}

func (t *IdleTracker) done() <-chan time.Time {
	return t.timer.C
}
