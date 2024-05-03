package pipeline

import (
	"context"
	"errors"
	"sync"
)

type PipelinesPatch struct {
	Pipelines map[string]*PipelinePatch `json:"pipelines"`
}

type PipelineSlotMap struct {
	mu  sync.Mutex
	ctx context.Context

	Glib *Glib

	Slots map[string]*PipelineSlot
}

func (p *PipelineSlotMap) Initialize() {
	p.Slots = map[string]*PipelineSlot{}
}

func (p *PipelineSlotMap) Serve(ctx context.Context) {
	p.ctx = ctx
}

func (p *PipelineSlotMap) Patch(patch *PipelinesPatch) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	var errs []error
	for k, v := range patch.Pipelines {
		err := p.patch(k, v)
		if err != nil {
			errs = append(errs, err)
		}
	}

	if len(errs) == 0 {
		return nil
	}

	return errors.Join(errs...)
}

func (p *PipelineSlotMap) patch(name string, patch *PipelinePatch) error {
	slot := p.Slots[name]
	if slot == nil {
		if patch == nil {
			return nil
		}
		// TODO perhaps we can pull this engine pattern out?
		slot = &PipelineSlot{
			Glib: p.Glib,
		}
		slot.Initialize()
		ctx, _ := context.WithCancelCause(p.ctx)
		go slot.Serve(ctx)
		go func() {
			// Clean up when it stops
			<-ctx.Done()
			p.mu.Lock()
			defer p.mu.Unlock()

			if p.Slots[name] == slot {
				delete(p.Slots, name)
			}
		}()

		p.Slots[name] = slot
	}

	return slot.Patch(patch)
}
