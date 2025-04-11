package commands

import "log/slog"

type CapReflectedMsg struct {
	Client HTTPClient
}

var _ Cap = (*CapReflectedMsg)(nil)

func (a *CapReflectedMsg) Apply(env Env, m Fields) (Fields, error) {
	urlStr, err := GetPath[string](m, "url")
	if err != nil {
		return nil, err
	}

	slog.Info("CapReflectedMsg.Apply", "url", urlStr, "m", m)

	name, err := GetPath[string](m, "name")
	if err != nil {
		return nil, err
	}

	data, err := GetPath[Fields](m, "data")
	if err != nil {
		return nil, err
	}

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
		"seq": []any{
			Fields{
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
			Fields{
				"par": Fields{
					"0": nil,
				},
			},
		},
	})
}
