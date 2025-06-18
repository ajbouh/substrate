package reactionquickjs

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"github.com/ajbouh/substrate/images/events/store/reaction"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
	"github.com/buke/quickjs-go"
)

type api struct {
	step      *reaction.Step
	makePause func(ctx context.Context, err error) *reaction.Pause

	setOrigin func(o *quickjs.Value, t event.ID)
}

func (api *api) now(qctx *quickjs.Context, this *quickjs.Value, args []*quickjs.Value) *quickjs.Value {
	now, err := api.step.Now()
	if err != nil {
		return qctx.ThrowError(err)
	}

	return qctx.NewString(now.String())
}

func (api *api) id(qctx *quickjs.Context, this *quickjs.Value, args []*quickjs.Value) *quickjs.Value {
	id, err := api.step.ID()
	if err != nil {
		return qctx.ThrowError(err)
	}

	return qctx.NewString(id.String())
}

func (api *api) write(qctx *quickjs.Context, this *quickjs.Value, args []*quickjs.Value) *quickjs.Value {
	// const [...records] = args
	var arg *quickjs.Value
	if len(args) >= 1 {
		arg = args[0]
	}
	err := api.step.Write(arg)
	if err != nil {
		return qctx.ThrowError(err)
	}
	return qctx.NewUndefined()
}

func (api *api) log(qctx *quickjs.Context, this *quickjs.Value, args []*quickjs.Value) *quickjs.Value {
	logArgs := make([]any, len(args))
	for i, arg := range args {
		logArgs[i] = arg
	}
	api.step.Log(logArgs...)
	return qctx.NewUndefined()
}

func (api *api) fingerprint(qctx *quickjs.Context, this *quickjs.Value, args []*quickjs.Value) *quickjs.Value {
	fingerprint, err := api.step.Fingerprint(api.step.Context())
	if err != nil {
		return qctx.ThrowError(err)
	}
	return qctx.ParseJSON(fingerprint.String())
}

func (api *api) query(qctx *quickjs.Context, this *quickjs.Value, args []*quickjs.Value) *quickjs.Value {
	if len(args) == 0 || args[0].IsUndefined() {
		return qctx.ThrowError(errors.New("query requires an argument"))
	}

	qsValue := args[0]
	if !qsValue.IsObject() {
		return qctx.ThrowError(fmt.Errorf("query expects an Object, got a %s", typeofValue(qsValue)))
	}

	var qsOptions reaction.JSONStringify
	if len(args) >= 2 && !args[1].IsUndefined() {
		qsOptions = args[1]
	} else {
		qsOptions = reaction.JSONString("{}")
	}

	matchesValue, now, rc, err := api.step.Query(api.step.Context(), qsValue, qsOptions)
	if err != nil {
		return qctx.ThrowError(err)
	}

	if rc == nil {
		result := qctx.ParseJSON(string(matchesValue))
		api.setOrigin(result, now)
		return result
	}

	pause := api.makePause(context.Background(), err)
	pause.ResumptionConditions = *rc

	// this cancels the step context and prevents future writes or logs from being saved.
	// it also interrupts infinite loops if the reaction tries to trap our error and continue running.
	api.step.Pause(pause)
	return qctx.ThrowError(pause)
}

func (api *api) abort(qctx *quickjs.Context, this *quickjs.Value, args []*quickjs.Value) *quickjs.Value {
	var err error
	if len(args) >= 1 {
		arg := args[0]
		switch {
		case arg.IsException():
			err = arg.ToError()
		case arg.IsString():
			err = errors.New(arg.ToString())
		default:
			err = errors.New("aborted with malformed reason")
		}
	}
	if err == nil {
		err = errors.New("aborted without reason")
	}

	pause := api.makePause(context.Background(), err)
	api.step.Pause(pause)
	return qctx.ThrowError(pause)
}

func (api *api) defineObject(qctx *quickjs.Context) *quickjs.Value {
	apiObj := qctx.NewObject()
	apiObj.Set("id", qctx.NewFunction(api.id))
	apiObj.Set("now", qctx.NewFunction(api.now))
	apiObj.Set("log", qctx.NewFunction(api.log))
	apiObj.Set("write", qctx.NewFunction(api.write))
	apiObj.Set("abort", qctx.NewFunction(api.abort))
	apiObj.Set("fingerprint", qctx.NewFunction(api.fingerprint))
	apiObj.Set("query", qctx.NewFunction(api.query))

	finish := qctx.Eval(`(function() {
		const rxn = this;
		const originSymbol = Symbol("origin");
		rxn._originSymbol = originSymbol; // for debugging
		rxn._setOrigin = (v, o) => { v[originSymbol] = o };
		rxn.origin = (v) => v[originSymbol];
		rxn.become = function(fields) {
			globalThis.reactionnext = fields
		};
		rxn.prev = function() {
			const id = rxn.id()
			const results = rxn.query({me: {basis_criteria: {where: {id: [{compare: "=", value: id}]}}}}, {peek: true})
			if (!results.me?.length) {
				throw new Error("reaction: internal error: could not find id " + id)
			}
			const {me: [{fields: prev}]} = results
			return prev
		};
		rxn.when = function(qs, options) {
			if (typeof qs === 'undefined') {
				throw new Error("when requires an argument")
			}
			const now = rxn.now();
			if (Object.keys(qs).length > 0) {
				reactionthis.reaction.when = {query: qs, after: now};
			}
			const prev = rxn.prev();
			const after = prev?.reaction?.when?.after;
			if (after) {
				options = options ? {...options, after} : {after}
			}
			const results = rxn.query(qs, options);
			return results;
		};
	})`)
	defer finish.Free()
	finish.Execute(apiObj).Free()

	setOrigin := apiObj.Get("_setOrigin")
	// todo should really just pass in the fully-formed origin.
	api.setOrigin = func(v *quickjs.Value, t event.ID) {
		qctx := v.Context()
		originValue := qctx.NewObject()
		originValue.Set("time", qctx.NewString(t.String()))
		slog.Info("setting origin", "origin", originValue.JSONStringify())
		setOrigin.Execute(apiObj, v, originValue).Free()
	}
	return apiObj
}
