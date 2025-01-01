package units

import (
	"context"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"tractor.dev/toolkit-go/duplex/rpc"
)

type DuplexSource struct {
	RegistrationV1Response RegistrationV1Response
	RegistrationV1Request  RegistrationV1Request
	Caller                 rpc.Caller
}

var _ commands.Source = (*DuplexSource)(nil)

func (d *DuplexSource) Reflect(ctx context.Context) (commands.DefIndex, error) {
	index := commands.DefIndex{}
	_, err := d.RegistrationV1Request.ReflectMethod.Call(ctx, d.Caller, nil, &index)
	if err != nil {
		return nil, err
	}

	return index, nil
}

func (d *DuplexSource) Run(ctx context.Context, name string, p commands.Fields) (commands.Fields, error) {
	returns := commands.Fields{}
	_, err := d.RegistrationV1Request.RunMethod.Call(ctx, d.Caller, []any{name, p}, &returns)
	if err != nil {
		return nil, err
	}

	return returns, nil
}
