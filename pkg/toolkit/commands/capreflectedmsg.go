package commands

import (
	"log"
	neturl "net/url"
)

type CapReflectedMsg struct {
	Client HTTPClient
}

var _ Cap = (*CapReflectedMsg)(nil)

func (a *CapReflectedMsg) Apply(env Env, m Fields) (Fields, error) {
	urlStr, err := GetPath[string](m, "url")
	if err != nil {
		return nil, err
	}

	log.Printf("CapReflectedMsg.Apply: url=%q", urlStr)
	// TODO do reflect via env

	name, err := Get[string](m, "name")
	if err != nil {
		return nil, err
	}

	parameters, err := Get[Fields](m, "parameters")
	if err != nil {
		return nil, err
	}

	di, err := ReflectURL(env.Context(), a.Client, urlStr)
	if err != nil {
		return nil, err
	}

	if u, err := neturl.Parse(urlStr); err == nil {
		u.Path = ""
		u.RawPath = ""
		env = env.New(env.Context(), map[string]Cap{
			"read-urlbase": &CapFunc{
				Func: func(env Env, d Fields) (Fields, error) {
					return Fields{
						"urlbase": u.String(),
					}, nil
				},
			},
		})
	}

	def, ok := di[name]
	if !ok {
		return nil, ErrNoSuchCommand
	}
	log.Printf("CapReflectedMsg.Apply: def=%#v", def)

	return env.Apply(nil, Fields{
		"cap":        "msg",
		"msg":        def,
		"parameters": parameters,

		"msg_in": Bindings{
			"#/msg/parameters": "#/parameters",
		},
		"msg_out": Bindings{
			"#/returns": "#/msg/returns",
		},
	})
}
