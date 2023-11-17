package blackboard

import (
	"context"
	"log"
	"sync"
	"time"

	"cuelang.org/go/cue"
)

type Blackboard struct {
	mu *sync.RWMutex

	cueCtx *cue.Context

	offers map[uint64]*Offer

	counter uint64
}

type Input struct {
	Source string
	Value  any
}

type Refinement func(ctx context.Context, match cue.Value) (cue.Value, error)

type Offer struct {
	Ctx            context.Context
	SelectorValue  cue.Value
	SelectorSource string
	SelectorEvent  Event
	Refinement     Refinement
}

type Event struct {
	Name  string
	Start time.Time
	Dur   time.Duration
}

func newEvent(name string, start time.Time, end time.Time) *Event {
	return &Event{
		Name:  name,
		Start: start,
		Dur:   end.Sub(start),
	}
}

type Match struct {
	Offer Offer

	Events []Event

	RawInputValue  cue.Value
	RawInputSource string

	Match cue.Value

	Output cue.Value

	Result cue.Value

	Error error
}

func New(cueCtx *cue.Context) *Blackboard {
	b := &Blackboard{
		cueCtx: cueCtx,
		mu:     &sync.RWMutex{},
		offers: map[uint64]*Offer{},
	}
	log.Printf("blackboard.New %#v\n", b)

	return b
}

func (b *Blackboard) Offer(ctx context.Context, selector Input, refinement Refinement) {
	var selectorValue cue.Value
	selectorStart := time.Now()
	if selector.Source != "" {
		selectorValue = b.cueCtx.CompileString(selector.Source)
	} else {
		log.Printf("Offer b.cueCtx %#v %#v", b.cueCtx, selector)
		selectorValue = b.cueCtx.Encode(selector.Value, cue.NilIsAny(false))
	}
	selectorEvent := newEvent("selector", selectorStart, time.Now())

	b.mu.Lock()
	defer b.mu.Unlock()

	o := &Offer{
		Ctx:            ctx,
		SelectorSource: selector.Source,
		SelectorValue:  selectorValue,
		SelectorEvent:  *selectorEvent,
		Refinement:     refinement,
	}
	key := b.counter
	b.counter++
	b.offers[key] = o

	go func() {
		<-ctx.Done()

		b.mu.Lock()
		defer b.mu.Unlock()

		delete(b.offers, key)
	}()
}

func (b *Blackboard) Len() int {
	b.mu.Lock()
	defer b.mu.Unlock()
	return len(b.offers)
}

func (b *Blackboard) Stream(ctx context.Context, input Input, cb func(*Match) bool, refinement Refinement) {
	log.Printf("bb stream start")
	defer func() {
		log.Printf("bb stream done")
	}()
	b.mu.Lock()
	defer b.mu.Unlock()

	inputStart := time.Now()
	var inputValue cue.Value
	if input.Value == nil {
		log.Printf("b.cueCtx.CompileString(input.Source)")
		inputValue = b.cueCtx.CompileString(input.Source)
		log.Printf("-> b.cueCtx.CompileString(input.Source)")
	} else {
		log.Printf("b.cueCtx.Encode(input.Value, cue.NilIsAny(false))")
		inputValue = b.cueCtx.Encode(input.Value, cue.NilIsAny(false))
		log.Printf("-> b.cueCtx.Encode(input.Value, cue.NilIsAny(false))")
	}
	rawInputEvent := newEvent("rawinput", inputStart, time.Now())

	// ch := make(chan *Match, len(b.offers))
	// wg := &sync.WaitGroup{}
	for _, offer := range b.offers {
		o := offer
		// wg.Add(1)

		// Run every match in parallel
		// go
		// func(o Offer) {
		// defer wg.Done()
		start := time.Now()

		m := &Match{
			Offer:          *o,
			RawInputValue:  inputValue,
			RawInputSource: input.Source,
			Events:         make([]Event, 6),
		}
		m.Events = append(m.Events, o.SelectorEvent, *rawInputEvent)
		log.Printf("o.SelectorValue.Unify(inputValue)")
		m.Match = o.SelectorValue.Unify(inputValue)

		m.Events = append(m.Events, *newEvent("match", start, time.Now()))
		log.Printf("m.Match.Validate()")
		m.Error = m.Match.Validate()

		start = time.Now()
		if m.Error == nil {
			log.Printf("o.Refinement")
			output, err := o.Refinement(ctx, m.Match)
			log.Printf("o.Refinement done")
			m.Events = append(m.Events, *newEvent("output", start, time.Now()))
			m.Output = output
			m.Error = err
		}

		if m.Error == nil && refinement != nil {
			log.Printf("refinement")
			output, err := refinement(ctx, m.Output)
			log.Printf("refinement done")
			m.Events = append(m.Events, *newEvent("output", start, time.Now()))
			m.Output = output
			m.Error = err
		}

		if m.Error == nil {
			start = time.Now()
			m.Result = m.Match.Unify(m.Output)
			m.Events = append(m.Events, *newEvent("result", start, time.Now()))
			m.Error = m.Result.Validate()
		}
		log.Printf("events %#v", m.Events)
		// ch <- m
		if !cb(m) {
			break
		}
		// }(*offer)
	}
	// go func() {
	// 	defer close(ch)
	// 	wg.Wait()
	// }()

	// return ch
}

func (b *Blackboard) Call(ctx context.Context, input Input, refinement Refinement) (*Match, bool) {
	matches := []Match{}
	var match *Match

	b.Stream(ctx, input, func(m *Match) bool {
		matches = append(matches, *m)
		if m.Error == nil {
			match = m
			return false
		} else {
			log.Printf("blackboard call error: %s", m.Error)
		}

		return true
	}, refinement)

	// for m := range ch {
	// 	matches = append(matches, *m)
	// 	if m.Error == nil {
	// 		match = m
	// 		break
	// 	} else {
	// 		log.Printf("blackboard call error: %s", m.Error)
	// 	}
	// }

	// go func() {
	// 	for m := range ch {
	// 		// todo log these
	// 		matches = append(matches, *m)
	// 	}
	// }()

	if match != nil {
		// log.Printf("blackboard call matched %#v", match)
		return match, true
	}

	// log.Printf("blackboard call unmatched %#v", matches)
	return nil, false
}
