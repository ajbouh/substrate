package router

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type Emitters struct {
	CapturedSample chan<- *CapturedSample
	CapturedAudio  chan<- *CapturedAudio
	Transcription  chan<- *Transcription
}

type Listeners struct {
	DraftDocument  chan<- Document
	FinalDocument  chan<- Document
	CapturedAudio  chan<- *CapturedAudio
	CapturedSample chan<- *CapturedSample
	Status         chan<- *Status
}

type MiddlewareFunc func(ctx context.Context, emit Emitters) (Listeners, error)

type Router struct {
	ctx       context.Context
	ctxCancel context.CancelFunc

	capturedAudio  chan *CapturedAudio
	capturedSample chan *CapturedSample
	transcription  chan *Transcription

	emitters Emitters

	middlewares []MiddlewareFunc

	mu        sync.RWMutex
	started   bool
	listeners []Listeners
}

func New(parentCtx context.Context) *Router {
	capturedAudio := make(chan *CapturedAudio, 100)
	capturedSample := make(chan *CapturedSample, 100)
	transcription := make(chan *Transcription, 100)

	ctx, ctxCancel := context.WithCancel(parentCtx)

	return &Router{
		ctx:       ctx,
		ctxCancel: ctxCancel,

		capturedAudio:  capturedAudio,
		capturedSample: capturedSample,
		transcription:  transcription,

		emitters: Emitters{
			CapturedAudio:  capturedAudio,
			CapturedSample: capturedSample,
			Transcription:  transcription,
		},
	}
}

func (r *Router) InstallMiddleware(middlewares ...MiddlewareFunc) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	for _, start := range middlewares {
		var err error
		fmt.Printf("adding middleware: %#v...\n", start)
		listener, err := start(r.ctx, r.emitters)
		if err != nil {
			// TODO cleanup what we've started!!
			return err
		}

		r.listeners = append(r.listeners, listener)
		r.middlewares = append(r.middlewares, start)

		fmt.Printf("added middleware: %#v -> %#v.\n", start, listener)
	}

	return nil
}

func (r *Router) visitListeners(fn func(Listeners)) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	for _, l := range r.listeners {
		fn(l)
	}
}

func (r *Router) Start() error {
	fmt.Printf("starting router...\n")
	defer fmt.Printf("started router.\n")

	r.mu.Lock()
	if r.started {
		r.mu.Unlock()
		return fmt.Errorf("already started")
	}
	r.started = true
	r.mu.Unlock()

	// Run capturedAudio repeater
	go func() {
		count := 0
		interval := 1
		for o := range r.capturedAudio {
			count++
			fmt.Printf("capturedaudio count=%d", count)
			r.visitListeners(func(l Listeners) {
				if l.CapturedAudio != nil {
					if count % interval == 0 {
						fmt.Printf("capturedaudio count=%d listener=%#v\n", count, l.CapturedAudio)
					}
					l.CapturedAudio <- o
				}
			})
		}
	}()

	// Run capturedSample repeater
	go func() {
		count := 0
		interval := 10
		for o := range r.capturedSample {
			count++
			fmt.Printf("capturedsample count=%d", count)
			r.visitListeners(func(l Listeners) {
				if l.CapturedSample != nil {
					if count % interval == 0 {
						fmt.Printf("capturedsample count=%d listener=%#v\n", count, l.CapturedSample)
					}
					l.CapturedSample <- o
				}
			})
		}
	}()

	// Run transcription repeater
	go func() {
		// This is kind of a hack and doesn't really make sense as a way to shut down...
		defer r.ctxCancel()

		document := Document{
			StartedAt: time.Now().Unix(),
		}

		for o := range r.transcription {
			document.Update(o)

			draft := *document.Clone()
			r.visitListeners(func(l Listeners) {
				if l.DraftDocument != nil {
					l.DraftDocument <- draft
				}
			})

			if o.Final {
				final := *document.CloneFinal()
				r.visitListeners(func(l Listeners) {
					if l.FinalDocument != nil {
						l.FinalDocument <- final
					}
				})
			}
		}
	}()

	return nil
}

func (r *Router) WaitForDone() {
	<-r.ctx.Done()
}
