package commands

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

	if a.DefTransform != nil {
		di = TranformDefIndex(env.Context(), di, a.DefTransform)
	}

	return Fields{
		"msgindex": di,
	}, nil
}
