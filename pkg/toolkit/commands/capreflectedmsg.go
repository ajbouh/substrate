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

	data, err := GetPath[Fields](m, "data")
	if err != nil {
		return nil, err
	}
	if true {
		return env.Apply(nil, Fields{
			"cap": "seq",
			"tmp": Fields{
				"url":  urlStr,
				"name": name,
				"data": data,
			},
			"ret": Fields{
				"#": "#/seq/1/par/0",
			},
			"seq": Fields{
				"0": Fields{
					"pre": Fields{
						"#/par/0/url":    "#/tmp/url",
						"#/par/1/path/2": "#/tmp/name",
					},
					"var": Fields{
						"dataptr": "#/tmp/data",
					},
					"par": Fields{
						"0": Fields{"cap": "reflect"},
						"1": Fields{"cap": "ptr", "path": []any{"tmp", "msgindex", nil}},
					},
					"out": Fields{
						"#/tmp/msgindex":              "#/par/0/msgindex",
						"#/seq/1/pre/#~1par~10":       "#/par/1/pointer",
						"#/seq/1/pre/#~1par~10~1data": "#/var/dataptr",
					},
				},
				"1": Fields{
					"par": Fields{
						"0": nil,
					},
				},
			},
		})
	}
	parameters := Fields{}

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
