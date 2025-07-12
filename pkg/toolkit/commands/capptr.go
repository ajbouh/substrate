package commands

import (
	"fmt"
)

type CapPtr struct {
}

var _ Cap = (*CapPtr)(nil)

func (a *CapPtr) Apply(env Env, m Fields) (Fields, error) {
	// slog.Info("CapPtr.Apply", "m", m)

	pointer, ok, err := MaybeGetPath[string](m, "pointer")
	if err != nil {
		return nil, err
	}
	if ok {
		m, err = m.Clone()
		if err != nil {
			return nil, err
		}
		parsed, err := ParseDataPointer(pointer)
		if err != nil {
			return nil, err
		}
		m["path"] = parsed.Path()
		return m, nil
	}

	path, ok, err := MaybeGetPath[[]string](m, "path")
	if err != nil {
		return nil, err
	}
	if ok {
		m, err = m.Clone()
		if err != nil {
			return nil, err
		}
		m["pointer"] = NewDataPointer(path...)
		return m, nil
	}

	return nil, fmt.Errorf("must either specify pointer or path")
}
