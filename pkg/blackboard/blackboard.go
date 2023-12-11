package blackboard

import (
	"context"
	"log"
	"sync"
	"time"

	"cuelang.org/go/cue"
)

type Blackboard struct {
	cueMu *sync.Mutex
	modMu *sync.RWMutex

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
		cueMu:  &sync.Mutex{},
		modMu:  &sync.RWMutex{},

		offers: map[uint64]*Offer{},
	}
	log.Printf("blackboard.New %#v\n", b)

	return b
}

func (b *Blackboard) unify(o1, o2 cue.Value) cue.Value {
	b.cueMu.Lock()
	defer b.cueMu.Unlock()

	return o1.Unify(o2)
}

func (b *Blackboard) validate(o cue.Value, opts ...cue.Option) error {
	b.cueMu.Lock()
	defer b.cueMu.Unlock()

	return o.Validate(opts...)
}

func (b *Blackboard) compileString(s string, opts ...cue.BuildOption) cue.Value {
	b.cueMu.Lock()
	defer b.cueMu.Unlock()

	return b.cueCtx.CompileString(s, opts...)
}

func (b *Blackboard) encode(o any, opts ...cue.EncodeOption) cue.Value {
	b.cueMu.Lock()
	defer b.cueMu.Unlock()

	return b.cueCtx.Encode(o, opts...)
}

func (b *Blackboard) Offer(ctx context.Context, selector Input, refinement Refinement) {
	var selectorValue cue.Value
	selectorStart := time.Now()
	if selector.Source != "" {
		selectorValue = b.compileString(selector.Source)
	} else {
		log.Printf("Offer b.cueCtx %#v %#v", b.cueCtx, selector)
		selectorValue = b.encode(selector.Value, cue.NilIsAny(false))
	}
	selectorEvent := newEvent("selector", selectorStart, time.Now())

	b.modMu.Lock()
	defer b.modMu.Unlock()

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

		b.modMu.Lock()
		defer b.modMu.Unlock()

		delete(b.offers, key)
	}()
}

func (b *Blackboard) Len() int {
	b.modMu.RLock()
	defer b.modMu.RUnlock()
	return len(b.offers)
}

func (b *Blackboard) Stream(ctx context.Context, input Input, cb func(*Match) bool, refinement Refinement) {
	log.Printf("bb stream start")
	defer func() {
		log.Printf("bb stream done")
	}()
	b.modMu.RLock()
	defer b.modMu.RUnlock()

	inputStart := time.Now()
	var inputValue cue.Value
	if input.Value == nil {
		log.Printf("b.compileString(input.Source)")
		inputValue = b.compileString(input.Source)
		log.Printf("-> b.compileString(input.Source)")
	} else {
		log.Printf("b.encode(input.Value, cue.NilIsAny(false))")
		inputValue = b.encode(input.Value, cue.NilIsAny(false))
		log.Printf("-> b.encode(input.Value, cue.NilIsAny(false))")
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
		log.Printf("b.unify(o.SelectorValue, inputValue)")
		m.Match = b.unify(o.SelectorValue, inputValue)

		m.Events = append(m.Events, *newEvent("match", start, time.Now()))
		log.Printf("b.validate(m.Match)")
		m.Error = b.validate(m.Match)

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
			m.Result = b.unify(m.Match, m.Output)
			m.Events = append(m.Events, *newEvent("result", start, time.Now()))
			m.Error = b.validate(m.Result)
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
