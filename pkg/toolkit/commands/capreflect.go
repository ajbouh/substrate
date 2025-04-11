package commands

import "context"

type CapReflect struct {
	Client       HTTPClient
	DefTransform DefTransformFunc
}

var _ Cap = (*CapReflect)(nil)

func (a *CapReflect) Apply(env Env, m Fields) (Fields, error) {
	urlStr, err := Get[string](m, "url")
	if err != nil {
		return nil, err
	}

	// NB not necessary if ReflectURL uses http capability
	urlStr, err = resolveURLWithEnv(env, urlStr)
	if err != nil {
		return nil, err
	}

	di, err := ReflectURL(env.Context(), a.Client, urlStr)
	if err != nil {
		return nil, err
	}

	di = TranformDefIndex(env.Context(), di, func(ctx context.Context, s string, f Fields) (string, Fields) {
		return s, Fields{
			"cap":     "with-urlbase",
			"urlbase": urlStr, // TODO make this the *response* url, to handle redirecots
			"msg":     f,
			"pre": Bindings{
				"#/msg/data": "#/data",
			},
			"ret": Bindings{
				"#": "#/msg",
			},
		}
	})

	if a.DefTransform != nil {
		di = TranformDefIndex(env.Context(), di, a.DefTransform)
	}

	return Fields{
		"msgindex": di,
	}, nil
}
