package commands

import (
	"context"
	"log"
	"strings"
)

type ReflectCapability struct {
	Client       HTTPClient
	DefTransform DefTransformFunc

	BaseURL string
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
	log.Printf("ReflectCapability.Apply: url=%q", url)
	if strings.HasPrefix(url, "/") {
		url = a.BaseURL + url
		log.Printf("ReflectCapability.Apply (with prefix): url=%q", url)
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
