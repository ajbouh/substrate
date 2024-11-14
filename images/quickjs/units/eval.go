package units

import (
	"context"
	"encoding/json"
	"log/slog"
	"os"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"

	"github.com/buke/quickjs-go"
)

type EvalReturns struct {
	Result any `json:"result"`
}

type QuickJSInit struct {
	Qctx *quickjs.Context
}

var AddReflectorAsGlobal = notify.On(func(ctx context.Context,
	qctx *quickjs.Context,
	t *struct {
		Reflector commands.HTTPRunnerReflector
	}) {
	slog.Info("AddReflectorAsGlobal", "t", t)

	reflector := qctx.Object()
	runFunc, err := asFunction(qctx, func(url, command string, parameters commands.Fields) (commands.Fields, error) {
		// This is a bit of a hack, but we'd prefer reflector.run to operate against the "root" substrate URL if it's relative.
		// This is a better choice than the root of this service, since there really isn't much here and this is expected to be
		// invoked by other subsystems via command execution.
		if strings.HasPrefix(url, "/") {
			url = os.Getenv("INTERNAL_SUBSTRATE_ORIGIN") + url

		}
		runner, err := t.Reflector.HTTPReflectRunner(context.Background(), url)
		if err != nil {
			return nil, err
		}

		return runner.Run(ctx, command, parameters)
	})
	if err != nil {
		panic(err)
	}
	reflector.Set("run", *runFunc)

	g := qctx.Globals()
	g.Set("reflector", reflector)
})

var EvalCommand = handle.Command("eval", "Run a bit of javascript code",
	func(ctx context.Context,
		t *struct {
			Notifiers []notify.Notifier[*quickjs.Context]
		},
		args struct {
			Source string `json:"source"`

			ExecuteTimeout *uint64 `json:"execute_timeout"` // seconds
			CanBlock       *bool   `json:"can_block"`
			MaxStackSize   *uint64 `json:"max_stack_size"`
			MemoryLimit    *uint64 `json:"memory_limit"` // bytes
			GCThreshold    *uint64 `json:"gc_threshold"` // bytes

			Globals map[string]json.RawMessage `json:"globals"`

			// If set, assume source is a function that we call with the given arguments.
			Arguments []json.RawMessage `json:"arguments"`
		}) (EvalReturns, error) {
		slog.Info("eval", "args", args)

		r := EvalReturns{}

		// Create a new runtime
		rt := quickjs.NewRuntime()
		defer rt.Close()

		if args.ExecuteTimeout != nil {
			rt.SetExecuteTimeout(*args.ExecuteTimeout)
		}
		if args.CanBlock != nil {
			rt.SetCanBlock(*args.CanBlock)
		}
		if args.MaxStackSize != nil {
			rt.SetMaxStackSize(*args.MaxStackSize)
		}
		if args.MemoryLimit != nil {
			rt.SetMemoryLimit(*args.MemoryLimit)
		}
		if args.GCThreshold != nil {
			rt.SetGCThreshold(*args.GCThreshold)
		}

		// Create a new context
		qctx := rt.NewContext()
		defer qctx.Close()

		notify.Notify(ctx, t.Notifiers, qctx)

		if len(args.Globals) > 0 {
			globals := qctx.Globals()
			for k, v := range args.Globals {
				qv := qctx.ParseJSON(string(v))
				defer qv.Free()
				globals.Set(k, qv)
			}
		}

		source := args.Source
		if args.Arguments != nil {
			source = "(" + source + ")"
		}

		ret, err := qctx.Eval(source)
		if err != nil {
			return r, err
		}
		defer ret.Free()

		if ret.IsError() {
			return r, ret.Error()
		}

		if args.Arguments != nil {
			arguments := make([]quickjs.Value, len(args.Arguments))
			for i, arg := range args.Arguments {
				qv := qctx.ParseJSON(string(arg))
				defer qv.Free()
				arguments[i] = qv
			}

			null := qctx.Null()
			defer null.Free()

			ret = qctx.Invoke(ret, null, arguments...)
			defer ret.Free()
		}

		if ret.IsException() {
			return r, qctx.Exception()
		}

		s := ret.JSONStringify()

		slog.Info("eval", "source", args.Source, "ret", ret, "ret.String()", ret.String(), "ret.JSONStringify()", s, "ret.IsException()", ret.IsException(), "err", err)

		if s != "undefined" && s != "" {
			r.Result = json.RawMessage(s)
		}

		// Seems to be necessary to avoid a crash when we call rt.Close.
		rt.RunGC()

		return r, nil
	})
