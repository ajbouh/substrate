package reactionquickjs

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"strconv"

	"github.com/ajbouh/substrate/images/events/store/reaction"
	"github.com/ajbouh/substrate/images/events/store/reaction/timing"

	"github.com/buke/quickjs-go"
)

type Freer interface {
	Free()
}

type Stepper struct {
	qctx *quickjs.Context
	qrt  *quickjs.Runtime

	fn     *quickjs.Value
	this   *quickjs.Value
	apiObj *quickjs.Value

	api *api

	timings []timing.Timing

	freeList     []Freer
	freeListDesc []string
}

func errFieldsFor(err error) json.RawMessage {
	if err == nil {
		return nil
	}

	var qjsErr *quickjs.Error
	if errors.As(err, &qjsErr) {
		if qjsErr.JSONString != "{}" {
			return json.RawMessage(qjsErr.JSONString)
		}

		errMap := map[string]any{
			"message": qjsErr.Message,
		}
		if qjsErr.Name != "" {
			errMap["name"] = qjsErr.Name
		}
		if qjsErr.Cause != "" {
			errMap["cause"] = qjsErr.Cause
		}
		if qjsErr.Stack != "" {
			errMap["stack"] = qjsErr.Stack
		}
		errFields, _ := json.Marshal(errMap)
		return errFields
	}
	return json.RawMessage(`{"message":` + strconv.Quote(err.Error()) + `}`)
}

func (s *Stepper) makePause(ctx context.Context, err error) *reaction.Pause {
	var p *reaction.Pause
	if errors.As(err, &p) {
		return p
	}

	if errors.Is(err, context.Canceled) {
		if cause := context.Cause(ctx); cause != nil {
			err = cause
			if errors.As(err, &p) {
				return p
			}
		}
	}

	next := s.qctx.Globals().Get("reactionnext")
	defer next.Free()
	var fieldsJSON string
	if !next.IsUndefined() {
		fieldsJSON = next.JSONStringify()
	} else {
		fieldsJSON = s.this.JSONStringify()
	}

	slog.Info("Stepper.makePause", "err", err, "fields", string(fieldsJSON))

	var rawFields json.RawMessage
	if fieldsJSON[0] != '{' {
		// todo consider saving fieldsJSON in the error
		err = errors.Join(err, fmt.Errorf("this.fields must be an Object"))
	} else {
		rawFields = json.RawMessage(fieldsJSON)
	}

	return &reaction.Pause{
		RawFields: rawFields,
		ErrFields: errFieldsFor(err),
		Err:       err,
	}
}

func NewStepper(r *reaction.Reaction) (s *Stepper) {
	var qctx *quickjs.Context
	timings := timing.Timings{}
	newRuntime := timings.Start("newRuntime")
	rt := quickjs.NewRuntime()
	newRuntime.EndNow()

	freeList := []Freer{}
	freeListDesc := []string{}

	rt.SetCanBlock(false)

	opts := r.RuntimeOptions
	// rt.SetModuleImport(true)
	if opts.MaxStackSize != nil {
		rt.SetMaxStackSize(*opts.MaxStackSize)
	}
	if opts.MemoryLimit != nil {
		rt.SetMemoryLimit(*opts.MemoryLimit)
	}
	if opts.GCThreshold != nil {
		rt.SetGCThreshold(*opts.GCThreshold)
	}

	newContext := timings.Start("newContext")
	qctx = rt.NewContext()
	newContext.EndNow()

	setGlobals := timings.Start("setGlobals")
	globals := qctx.Globals()
	// defer globals.Free()
	if len(opts.Globals) > 0 {
		for k, v := range opts.Globals {
			qv := qctx.ParseJSON(string(v))
			globals.Set(k, qv)
		}
	}
	setGlobals.EndNow()

	parseThis := *timing.Start("parseThis")
	this := qctx.ParseJSON(string(r.RawFields))
	globals.Set("reactionthis", this)

	// must clear reaction.when at the start to avoid infinite loops
	if this.Has("reaction") {
		reaction := this.Get("reaction")
		if reaction.Has("when") {
			reaction.Delete("when")
		}
		reaction.Free()
	}

	// freeList = append(freeList, this)
	// freeListDesc = append(freeListDesc, "this")

	parseThis.EndNow()

	api := &api{}
	defineAPI := timings.Start("defineAPI")
	apiObj := api.defineObject(qctx)
	// freeList = append(freeList, apiObj)
	// freeListDesc = append(freeListDesc, "apiObj")
	globals.Set("rxn", apiObj)
	defineAPI.EndNow()

	eval := timings.Start("eval")
	fnVal := qctx.Eval(r.Source,
		// quickjs.EvalFlagModule(true),
		quickjs.EvalAwait(true),
		quickjs.EvalFlagStrict(true),
	)

	freeList = append(freeList, fnVal)
	freeListDesc = append(freeListDesc, "fnVal")
	eval.EndNow()

	s = &Stepper{
		qrt:  rt,
		qctx: qctx,

		timings: timings.Timings,

		freeList:     freeList,
		freeListDesc: freeListDesc,

		fn:     fnVal,
		this:   this,
		apiObj: apiObj,

		api: api,
	}
	api.makePause = s.makePause
	return s
}

func (s *Stepper) Close() {
	for i := len(s.freeList) - 1; i >= 0; i-- {
		freer := s.freeList[i]
		slog.Info("freeing", "obj", freer, "desc", s.freeListDesc[i])
		freer.Free()
	}
	if s.qctx != nil {
		s.qctx.Close()
	}
	// s.qrt.RunGC()
	slog.Info("closing runtime", "rt", s.qrt)
	// s.qrt.Close()
}

func (s *Stepper) Run(step *reaction.Step) *reaction.Pause {
	// improve json representation of timings before we enable
	// step.AppendTimings(s.timings...)

	ctx := step.Context()

	if s.qctx.HasException() {
		return s.makePause(ctx, s.qctx.Exception())
	}

	if !s.fn.IsFunction() {
		return s.makePause(ctx, fmt.Errorf("reaction: source does not provide a function, got %s", typeofValue(s.fn)))
	}

	// NB this interrupt eventually, not *immediately*
	s.qrt.SetInterruptHandler(func() int {
		if ctx.Err() != nil {
			return 1
		}
		return 0
	})

	// wire in the current step.
	s.api.step = step

	value := s.fn.Execute(s.this, s.apiObj)

	// should we always do this? or only if we get a promise back?
	s.qctx.Loop()

	slog.Info("Executed", "value", value, "err", value.ToError(), "type", typeofValue(value))

	// if we're already cancelled, return immediately
	if err := ctx.Err(); err != nil {
		value.Free()
		return s.makePause(ctx, err)
	}

	if s.qctx.HasException() {
		value.Free()
		return s.makePause(ctx, s.qctx.Exception())
	}

	if value.IsPromise() {
		defer value.Free()
		if value.PromiseState() == quickjs.PromisePending {
			return s.makePause(ctx, errors.New("return value is an unresolvable promise"))
		}
	} else {
		defer value.Free()
	}

	// use makePause to serialize this
	pause := s.makePause(ctx, nil)
	pause.Done = true
	return pause
}
