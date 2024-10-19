package daemon

import (
	"context"
	"errors"
	"log/slog"
	"reflect"
	"runtime/debug"
	"sync"
	"sync/atomic"
	"time"
)

// Initializer is initialized before services are started. Returning
// an error will cancel the start of daemon services.
type Initializer interface {
	InitializeDaemon() error
}

// Terminator is terminated when the daemon gets a stop signal.
type Terminator interface {
	TerminateDaemon(ctx context.Context) error
}

// Service is run after the daemon is initialized.
type Service interface {
	Serve(ctx context.Context)
}

// Framework is a top-level daemon lifecycle manager runs services given to it.
type Framework struct {
	Initializers []Initializer
	Services     []Service
	Terminators  []Terminator
	Context      context.Context
	OnFinished   func()
	Log          *slog.Logger

	running    int32
	cancel     context.CancelFunc
	terminated chan bool
}

// New builds a daemon configured to run a set of services. The services
// are populated with each other if they have fields that match anything
// that was passed in.
func New(services ...Service) *Framework {
	d := &Framework{}
	d.Add(services...)
	return d
}

// Add appends Services, Initializers, Terminators to daemon
func (d *Framework) Add(services ...Service) {
	for _, s := range services {
		d.Services = append(d.Services, s)
		if i, ok := s.(Initializer); ok {
			d.Initializers = append(d.Initializers, i)
		}
		if t, ok := s.(Terminator); ok {
			d.Terminators = append(d.Terminators, t)
		}
	}
}

// Run executes the daemon lifecycle
func (d *Framework) Run(ctx context.Context) error {
	if !atomic.CompareAndSwapInt32(&d.running, 0, 1) {
		return errors.New("already running")
	}

	// call initializers
	for _, i := range d.Initializers {
		d.Log.Debug("initializing", "service", ptrName(i))
		if err := i.InitializeDaemon(); err != nil {
			return err
		}
	}

	// finish if no services
	if len(d.Services) == 0 {
		return errors.New("no services to run")
	}

	if ctx == nil {
		ctx = context.Background()
	}
	ctx, cancelFunc := context.WithCancel(ctx)
	d.Context = ctx
	d.cancel = cancelFunc
	d.terminated = make(chan bool, 1)

	// setup terminators on stop signals
	go TerminateOnSignal(d)
	go TerminateOnContextDone(d)

	var wg sync.WaitGroup
	var running sync.Map
	for _, service := range d.Services {
		running.Store(service, nil)
		wg.Add(1)
		go func(s Service) {
			defer func() {
				if r := recover(); r != nil {
					d.Log.Info("serve panic from ", "service", ptrName(s))
					d.Log.Debug("serve panic:", "r", r)
					debug.PrintStack() // Print the stack trace
				}
			}()
			defer wg.Done()
			s.Serve(d.Context)
			running.Delete(s)
		}(service)
	}

	finished := make(chan bool)
	go func() {
		wg.Wait()
		close(finished)
	}()

	select {
	case <-finished:
		<-d.terminated
	case <-d.terminated:
		<-time.After(10 * time.Millisecond)
		var waiting []string
		running.Range(func(k, v interface{}) bool {
			waiting = append(waiting, ptrName(k))
			return true
		})
		if len(waiting) > 0 {
			d.Log.Info("waiting on serve for", "services", waiting)
		}
		select {
		case <-finished:
		case <-time.After(2 * time.Second):
			var waiting []string
			running.Range(func(k, v interface{}) bool {
				waiting = append(waiting, ptrName(k))
				return true
			})
			d.Log.Info("warning: unfinished", "services", waiting)
		}
	}

	if d.OnFinished != nil {
		d.OnFinished()
	}

	return nil
}

// Terminate cancels the daemon context and calls Terminators in reverse order
func (d *Framework) Terminate() {
	if d == nil {
		// find these cases and prevent them!
		panic("daemon reference used to Terminate but daemon pointer is nil")
	}

	if !atomic.CompareAndSwapInt32(&d.running, 1, 0) {
		return
	}

	d.Log.Info("shutting down")

	if d.cancel != nil {
		d.cancel()
	}

	// hmmm..
	ctx := context.Background()

	var wg sync.WaitGroup
	for i := len(d.Terminators) - 1; i >= 0; i-- {
		wg.Add(1)
		go func(t Terminator) {
			d.Log.Debug("terminating", "service", ptrName(t))
			// TODO: timeout
			if err := t.TerminateDaemon(ctx); err != nil {
				d.Log.Info("terminate error:", "err", err)
			}
			wg.Done()
		}(d.Terminators[i])
	}
	wg.Wait()
	d.Log.Debug("finished termination")
	d.terminated <- true
}

// TerminateOnContextDone waits for the deamon's context to be canceled.
func TerminateOnContextDone(d *Framework) {
	<-d.Context.Done()
	d.Terminate()
}

func ptrName(v any) string {
	return reflect.ValueOf(v).Elem().Type().String()
}
