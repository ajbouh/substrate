package calls

import (
	"context"
	"encoding/json"
	"log/slog"
	"reflect"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

type CommandCall[In, Out any] struct {
	DefRunner commands.DefRunner
	URL       string
	Command   string
}

func (cr *CommandCall[In, Out]) Call(ctx context.Context, params In) (*Out, error) {
	return CallDef[Out, In](ctx, cr.DefRunner, cr.URL, cr.Command, params)
}

func convertViaJSON[Out, In any](input In) (Out, error) {
	var out Out
	if !commands.HasJSONFields(reflect.TypeFor[In](), false) || !commands.HasJSONFields(reflect.TypeFor[Out](), false) {
		return out, nil
	}
	b, err := json.Marshal(input)
	if err != nil {
		return out, err
	}
	err = json.Unmarshal(b, &out)
	return out, err
}

func Cap(cap string, data commands.Fields) *commands.Msg {
	return &commands.Msg{
		Cap:  &cap,
		Data: data,
	}
}

func CallDef[Out, In any](ctx context.Context, runner commands.DefRunner, url, command string, params In) (*Out, error) {
	paramFields, err := convertViaJSON[commands.Fields](params)
	if err != nil {
		return nil, err
	}

	resultFields, err := runner.RunDef(ctx, Cap(
		"reflect", commands.Fields{
			"url":        url,
			"name":       command,
			"parameters": paramFields,
		}),
		nil,
	)
	if err != nil {
		return nil, err
	}
	returns, err := commands.Get[commands.Fields](resultFields, "returns")
	if err != nil {
		return nil, err
	}
	out, err := convertViaJSON[Out](returns)
	slog.InfoContext(ctx, "CallDef", "out", out, "err", err, "resultFields", resultFields)
	if err != nil {
		return nil, err
	}
	return &out, nil
}
