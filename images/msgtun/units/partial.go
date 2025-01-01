package units

import (
	"context"
	"fmt"

	"tractor.dev/toolkit-go/duplex/rpc"
)

// accept registration on a websocket with a specific struct ...
type PartialPeerCall struct {
	Selector string `json:"selector,omitempty"`
	Args     any    `json:"args,omitempty"`
}

func (c *PartialPeerCall) renderArgs(args any) (any, error) {
	if c == nil {
		return args, nil
	}
	if c.Args == nil {
		return args, nil
	}
	if args == nil {
		return c.Args, nil
	}

	templateSlice, ok := c.Args.([]any)
	if !ok {
		return nil, fmt.Errorf("template must be a []any, but was %T", c.Args)
	}

	argsSlice, ok := args.([]any)
	if !ok {
		return nil, fmt.Errorf("args must be a []any, but was %T", args)
	}

	// for now just prepend the template to the args. in the future consider doing something fancier.
	r := make([]any, 0, len(templateSlice)+len(argsSlice))
	r = append(r, templateSlice...)
	r = append(r, argsSlice...)
	return r, nil
}

func (c *PartialPeerCall) Call(ctx context.Context, caller rpc.Caller, args any, reply ...any) (*rpc.Response, error) {
	args, err := c.renderArgs(args)
	if err != nil {
		return nil, err
	}

	return caller.Call(ctx, c.Selector, args, reply...)
}
