package commands

import (
	"encoding/json"
	"log/slog"
)

type Fields map[string]any

func (f Fields) LogValue() slog.Value {
	ff := map[string]any{}
	for k, v := range f {
		if s, ok := v.(string); ok && len(s) > 100 {
			v = s[:100] + "..."
		}
		ff[k] = v
	}
	return slog.AnyValue(ff)
}

func (f Fields) Set(k string, v any) error {
	f[k] = v
	return nil
}

func (f Fields) Get(k string) (any, bool) {
	v, ok := f[k]
	return v, ok
}

func (r Fields) Clone() (Fields, error) {
	var o Fields
	b, err := json.Marshal(r)
	if err != nil {
		return o, err
	}

	return o, json.Unmarshal(b, &o)
}
