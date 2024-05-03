package pipeline

import (
	"context"
	"fmt"
	"log"
	"sync"

	"github.com/go-gst/go-gst/gst"
)

type PipelinePatch struct {
	Definition *string `json:"definition,omitempty"`
	State      *string `json:"state,omitempty"`
}

type PipelineSlot struct {
	Glib *Glib

	mu sync.Mutex

	ctx     context.Context
	current *Pipeline
}

func (p *PipelineSlot) Patch(patch *PipelinePatch) error {
	if patch == nil {
		return p.Terminate()
	}

	if patch.Definition != nil {
		err := p.MaybeSetDefinition(*patch.Definition)
		if err != nil {
			return err
		}
	}

	if patch.State != nil {
		// if current status of Slot is different, update it
		state, err := StateFromString(*patch.State)
		if err != nil {
			return err
		}
		err = p.MaybeSetState(state)
		if err != nil {
			return err
		}
	}

	return nil
}

func (p *PipelineSlot) Initialize() {
}

func (p *PipelineSlot) Serve(ctx context.Context) {
	p.ctx = ctx
}

func (p *PipelineSlot) terminate() error {
	existing := p.current

	log.Printf("stopping current pipeline...")
	err := existing.SetState(gst.StateNull)
	if err != nil {
		// exit early, deferring our error value
		return err
	}
	log.Printf("waiting for current pipeline to stop...")
	<-existing.Done()

	return nil
}

func (p *PipelineSlot) Terminate() error {
	<-p.Glib.Ready()

	p.mu.Lock()
	defer p.mu.Unlock()

	return p.terminate()
}

func (p *PipelineSlot) MaybeSetDefinition(definition string) error {
	<-p.Glib.Ready()

	log.Printf("MaybeSetDefinition enter %s", definition)
	defer log.Printf("MaybeSetDefinition done")
	p.mu.Lock()
	defer p.mu.Unlock()

	if p.current != nil {
		existing := p.current
		if existing.Definition() == definition {
			log.Printf("MaybeSetDefinition noop")
			return nil
		}

		p.terminate()
	}

	log.Printf("new pipeline from definition... %s", definition)
	pipeline, err := NewPipelineFromDefinition(definition)
	if err != nil {
		return err
	}

	pipeline.Initialize()
	defer log.Printf("MaybeSetDefinition go serve")
	go pipeline.Serve(p.ctx)

	p.current = pipeline

	return nil
}

func (p *PipelineSlot) MaybeSetState(state gst.State) error {
	<-p.Glib.Ready()

	log.Printf("MaybeSetState enter")
	defer log.Printf("MaybeSetState done")
	p.mu.Lock()
	defer p.mu.Unlock()

	if p.current == nil {
		return fmt.Errorf("no active pipeline")
	}

	var err error
	p.current.Do(func(pipeline *gst.Pipeline) {
		current := pipeline.GetCurrentState()
		log.Printf("MaybeSetState current %#v", current)
		if current != state {
			// Start the pipeline
			log.Printf("MaybeSetState set to %#v", state)
			err = p.current.SetState(state)
		}
	})
	return err
}

func (p *PipelineSlot) Definition() (string, bool) {
	p.mu.Lock()
	defer p.mu.Unlock()

	if p.current == nil {
		return "", false
	}

	return p.current.Definition(), true
}

func (p *PipelineSlot) GetState() (string, bool) {
	<-p.Glib.Ready()

	log.Printf("GetState enter")
	defer log.Printf("GetState done")

	p.mu.Lock()
	defer p.mu.Unlock()

	if p.current == nil {
		return "", false
	}

	var state gst.State
	p.current.Do(func(pipeline *gst.Pipeline) {
		state = pipeline.GetCurrentState()
	})
	return StateAsString(state), true
}
