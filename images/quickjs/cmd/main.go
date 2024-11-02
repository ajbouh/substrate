package main

import (
	"context"
	"encoding/json"
	"log/slog"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/service"

	"github.com/buke/quickjs-go"
)

type EvalReturns struct {
	Value any `json:"value"`
}

func main() {
	engine.Run(
		&service.Service{
			ExportsRoute: "/",
		},
		commands.Command("eval", "Run a bit of javascript code",
			func(ctx context.Context,
				t *struct{},
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
				defer rt.Close()

				// Create a new context
				qctx := rt.NewContext()
				defer qctx.Close()

				if len(args.Globals) > 0 {
					globals := qctx.Globals()
					for k, v := range args.Globals {
						qv := qctx.ParseJSON(string(v))
						globals.Set(k, qv)
					}
				}

				ret, err := qctx.Eval(args.Source)
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
						arguments[i] = qv
					}

					ret = qctx.Invoke(ret, qctx.Null(), arguments...)
				}

				s := ret.JSONStringify()
				slog.Info("eval", "source", args.Source, "ret", ret, "ret.String()", ret.String(), "ret.JSONStringify()", s)

				if s != "undefined" && s != "" {
					r.Value = json.RawMessage(s)
				}
				return r, nil
			}),
	)
}
