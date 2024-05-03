package pipeline

import (
	"context"
	"fmt"
	"log"

	"github.com/go-gst/go-glib/glib"
	"github.com/go-gst/go-gst/gst"
)

type Pipeline struct {
	definition string
	pipeline   *gst.Pipeline

	context context.Context
	watch   func(msg *gst.Message) bool
}

func NewPipelineFromDefinition(definition string) (*Pipeline, error) {
	pipeline, err := gst.NewPipelineFromString(definition)
	if err != nil {
		return nil, err
	}

	return &Pipeline{
		definition: definition,
		pipeline:   pipeline,
	}, nil
}

func StateFromString(s string) (gst.State, error) {
	switch s {
	case "void": // no pending state.
		return gst.VoidPending, nil
	case "null": // the NULL state or initial state of an element.
		return gst.StateNull, nil
	case "ready": // the element is ready to go to PAUSED.
		return gst.StateReady, nil
	case "paused": // the element is PAUSED, it is ready to accept and process data. Sink elements however only accept one buffer and then block.
		return gst.StatePaused, nil
	case "playing": // the element is PLAYING, the GstClock is running and the data is flowing.
		return gst.StatePlaying, nil
	}

	return gst.VoidPending, fmt.Errorf("not a valid gstreamer state: %s", s)
}

func StateAsString(s gst.State) string {
	switch s {
	case gst.VoidPending:
		return "void"
	case gst.StateNull:
		return "null"
	case gst.StateReady:
		return "ready"
	case gst.StatePaused:
		return "paused"
	case gst.StatePlaying:
		return "playing"
	}

	return ""
}

func (p *Pipeline) Done() <-chan struct{} {
	return p.context.Done()
}

func (p *Pipeline) Initialize() {
}

func (p *Pipeline) Serve(ctx context.Context) {
	log.Printf("Pipeline.Serve")
	defer log.Printf("Pipeline.Serve done")

	var cancel func(err error)
	p.context, cancel = context.WithCancelCause(ctx)
	p.watch = func(msg *gst.Message) bool {
		log.Printf("msg %#v %s; %s", p, msg.Type(), msg)

		switch msg.Type() {
		case gst.MessageStateChanged:
			old, new := msg.ParseStateChanged()
			log.Printf("state changed %s -> %s", old, new)
			if new == gst.StateNull {
				log.Println("DONE")
				cancel(nil)
			}
		case gst.MessageEOS: // When end-of-stream is received flush the pipeling and stop the main loop
			p.pipeline.BlockSetState(gst.StateNull)
		case gst.MessageError: // Error messages are always fatal
			err := msg.ParseError()
			log.Println("ERROR:", err.Error())
			if debug := err.DebugString(); debug != "" {
				log.Println("DEBUG:", debug)
			}
			cancel(err)
		default:
			// All messages implement a Stringer. However, this is
			// typically an expensive thing to do and should be avoided.
			log.Println(msg)
		}
		return true
	}

	go func() {
		<-p.context.Done()
		log.Printf("Pipeline removewatch ...")
		defer log.Printf("Pipeline removewatch done")
		p.pipeline.GetPipelineBus().RemoveWatch()
	}()

	// Add a message handler to the pipeline bus, printing interesting information to the console.
	log.Printf("Pipeline add watch ...")
	defer log.Printf("Pipeline add watch done")
	if ok := p.pipeline.GetPipelineBus().AddWatch(p.watch); !ok {
		log.Fatalf("could not add watch for pipeline")
	}
}

func (p *Pipeline) SetState(state gst.State) error {
	log.Printf("SetState %s", state)
	defer log.Printf("SetState %s done", state)
	return p.pipeline.SetState(state)
}

func (p *Pipeline) Definition() string {
	return p.definition
}

func (p *Pipeline) Do(cb func(pipeline *gst.Pipeline)) {
	ch := make(chan struct{})
	glib.IdleAdd(func() {
		defer close(ch)
		cb(p.pipeline)
	})
	<-ch
}
