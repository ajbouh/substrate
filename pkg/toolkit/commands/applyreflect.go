package commands

import (
	"context"
)

type ReflectCapability struct {
	Client       HTTPClient
	DefTransform DefTransformFunc
}

var _ Capability = (*ReflectCapability)(nil)

func (a *ReflectCapability) CapabilityName() string {
	return "reflect"
}

func (a *ReflectCapability) Apply(ctx context.Context, m Fields) (*Msg, Fields, error) {
	url, err := Get[string](m, "url")
	if err != nil {
		return nil, nil, err
	}

	name, err := Get[string](m, "name")
	if err != nil {
		return nil, nil, err
	}

	parameters, err := Get[Fields](m, "parameters")
	if err != nil {
		return nil, nil, err
	}

	di, err := ReflectURL(ctx, a.Client, url)
	if err != nil {
		return nil, nil, err
	}

	if a.DefTransform != nil {
		di = TranformDefIndex(ctx, di, a.DefTransform)
	}

	def, ok := di[name]
	if !ok {
		return nil, nil, ErrNoSuchCommand
	}

	return def, Fields{"parameters": parameters}, nil
}
