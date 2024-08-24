package commands

import (
	"fmt"
	"strings"
)

type Fields map[string]any

type FieldDef struct {
	Description string `json:"description,omitempty"`
	Type        string `json:"type"` // "string", "number", "boolean"
}

type FieldDefs map[string]FieldDef

func (f Fields) Set(k string, v any) error {
	if first, rest, ok := strings.Cut(k, "."); !ok {
		f[first] = v
	} else {
		frest := f[first]
		if frest == nil {
			frest = map[string]any{}
			f[first] = frest
		}

		if m, ok := frest.(map[string]any); ok {
			Fields(m).Set(rest, v)
		} else if m, ok := frest.(map[string]string); ok {
			m[rest] = fmt.Sprintf("%v", v)
		} else if m, ok := frest.(map[string][]string); ok {
			m[rest] = append(m[rest], fmt.Sprintf("%v", v))
		} else {
			return fmt.Errorf("can't set %q on %T; %#v", k, frest, frest)
		}
	}

	return nil
}

func (f Fields) Get(k string) (any, error) {
	if first, rest, ok := strings.Cut(k, "."); !ok {
		return f[first], nil
	} else {
		v, ok := f[first]
		if !ok {
			return nil, fmt.Errorf("no value for %s; %#v", first, f)
		}

		switch val := v.(type) {
		case Fields:
			return val.Get(rest)
		case (map[string]any):
			return Fields(val).Get(rest)
		case (map[string]string):
			return val[rest], nil
		case (map[string][]string):
			return val[rest], nil
		}
		return nil, fmt.Errorf("can't get %q on %T; %#v", rest, v, v)
	}
}

func (f Fields) String(k string) string {
	v, ok := f[k]
	if ok {
		return v.(string)
	}
	return ""
}

func (f Fields) Bool(k string) bool {
	v, ok := f[k]
	if ok {
		return v.(bool)
	}
	return false
}
