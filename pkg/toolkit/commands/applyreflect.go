package commands

import (
	"context"
	"log"
	neturl "net/url"
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

func findMsgBasis(c *Msg) *Msg {
	if c == nil {
		return nil
	}

	for {
		if c.Msg == nil {
			return c
		}

		c = c.Msg
	}
}

func ensureRunHTTPRequestURLIncludesPrefix(prefix string) DefTransformFunc {
	return func(ctx context.Context, commandName string, commandDef *Msg) (string, *Msg) {
		if prefix == "" {
			return commandName, commandDef
		}

		r := findMsgBasis(commandDef)
		if r == nil || r.Cap == nil || *r.Cap != "http" {
			return commandName, commandDef
		}

		// is this a full URL? if not make it so.
		url, err := GetPath[string](r.Data, "request", "url")
		if err != nil {
			return commandName, commandDef
		}

		// TODO if we pass in the original URL, we could use neturl.ResolveReference
		// to handle relative URLs.
		if !strings.HasPrefix(url, "/") {
			return commandName, commandDef
		}

		new := commandDef.MustClone()
		r = findMsgBasis(new)
		err = SetPath(r.Data, []string{"request", "url"}, prefix+url)
		if err != nil {
			return commandName, commandDef
		}

		return commandName, new
	}
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

	var xform []DefTransformFunc
	if a.DefTransform != nil {
		xform = append(xform, a.DefTransform)
	}
	if u, err := neturl.Parse(url); err == nil {
		u.Path = ""
		u.RawPath = ""
		// TODO put the original URL on the context instead so we can access it from DefTransform?
		xform = append(xform, ensureRunHTTPRequestURLIncludesPrefix(u.String()))
	}
	if len(xform) > 0 {
		di = TranformDefIndex(ctx, di, DefTransforms(xform...))
	}

	def, ok := di[name]
	if !ok {
		return nil, nil, ErrNoSuchCommand
	}
	log.Printf("ReflectCapability.Apply: def=%#v", def)

	return def, Fields{"parameters": parameters}, nil
}
