package pipeline

import (
	"context"
	"log"

	"github.com/go-gst/go-glib/glib"
	"github.com/go-gst/go-gst/gst"
)

type Glib struct {
	MainLoop *glib.MainLoop

	readyCh <-chan struct{}
}

func (p *Glib) Ready() <-chan struct{} {
	return p.readyCh
}

func (p *Glib) Initialize() {
	ctx, ready := context.WithCancel(context.Background())
	p.readyCh = ctx.Done()

	log.Printf("Glib.Initialize()")
	// Initialize GStreamer with the arguments passed to the program. Gstreamer
	// and the bindings will automatically pop off any handled arguments leaving
	// nothing but a pipeline string (unless other invalid args are present).
	gst.Init(nil)

	// Create a main loop. This is only required when utilizing signals via the bindings.
	// In this example, the AddWatch on the pipeline bus requires iterating on the main loop.
	p.MainLoop = glib.NewMainLoop(glib.MainContextDefault(), false)

	glib.IdleAdd(func() {
		defer ready()
		log.Printf("Glib ready")
	})
}

func (p *Glib) Serve(ctx context.Context) {
	log.Printf("Glib.Serve()")
	defer log.Printf("Glib.Serve() done")
	p.MainLoop.Run()
}
