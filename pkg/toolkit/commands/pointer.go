package commands

import (
	"encoding/json"
	"fmt"
	"reflect"
	"strconv"
	"strings"
)

type DataPointer string // interpreted as JSON pointer

func NewDataPointer(path ...string) DataPointer {
	return DataPointer("#/" + strings.Join(path, "/"))
}

func ParseDataPointer(s string) (DataPointer, error) {
	if !strings.HasPrefix(s, "#/") {
		return "", fmt.Errorf("reference must start with #/, got %q", s)
	}

	return DataPointer(s), nil
}

func (p DataPointer) TrimPathPrefix(s DataPointer) (DataPointer, bool) {
	if strings.HasPrefix(string(p), string(s)) {
		trimmed := p[len(s):]
		if trimmed[0] == '/' {
			return "#" + trimmed, true
		}
	}

	return "", false
}

func (p DataPointer) Path() []string {
	parts := strings.Split(strings.TrimPrefix(string(p), "#/"), "/")

	for i, part := range parts {
		part = strings.ReplaceAll(part, "~1", "/")
		part = strings.ReplaceAll(part, "~0", "~")
		parts[i] = part
	}

	return parts
}

func As[T any](o any) (t T, err error) {
	var ok bool
	t, ok = o.(T)
	if ok {
		return
	}
	var b []byte
	b, err = json.Marshal(o)
	if err != nil {
		return
	}

	err = json.Unmarshal(b, &t)
	if err != nil {
		err = fmt.Errorf("can't get as %T; %#v: %w", t, o, err)
	}
	return
}

func Get[T any](m any, p DataPointer) (t T, err error) {
	path := p.Path()
	return GetPath[T](m, path...)
}

func GetPath[T any](m any, path ...string) (t T, err error) {
	var o any
	o, _, err = getPath(m, path)
	if err != nil {
		return
	}
	t, err = As[T](o)
	return t, err
}

func Set(m any, p DataPointer, v any) error {
	path := p.Path()
	return SetPath(m, path, v)
}

func SetPath(m any, path []string, v any) error {
	_, err := setPath(m, path, v)
	return err
}

func ensureLength[T any](ts []T, length int) []T {
	if len(ts) >= length {
		return ts
	}

	new := make([]T, length)
	copy(new, ts)
	return new
}

func as[T any](o any, err error) (T, error) {
	t, ok := o.(T)
	if ok || err != nil {
		return t, err
	}

	return t, fmt.Errorf("cannot assign %T to %T", o, t)
}

func setPath[T any](t0 T, path []string, v any) (T, error) {
	var err error

	if len(path) == 0 {
		return as[T](v, nil)
	}

	k := path[0]
	ki, err := strconv.Atoi(k)
	kiok := err == nil
	err = nil

	// need a new value before we can assign to the path.
	if any(t0) == nil {
		if kiok {
			// we're expecting an array. make one long enough.
			t0, err = as[T](make([]any, ki+1), nil)
		} else {
			// we're expecting a map.
			t0, err = as[T](map[string]any{}, nil)
		}
	}

	if err != nil {
		return t0, err
	}

	fail := false
	switch t := any(t0).(type) {
	case Fields:
		t[k], err = setPath[any](t[k], path[1:], v)
	case map[string]any:
		t[k], err = setPath[any](t[k], path[1:], v)
	case map[string][]string:
		t[k], err = setPath[[]string](t[k], path[1:], v)
	case []any:
		if kiok {
			t = ensureLength(t, ki+1)
			t[ki], err = setPath[any](t[ki], path[1:], v)
		} else {
			fail = true
		}
	case map[string]string: // leaf
		if vstring, ok := v.(string); ok {
			t[k], err = setPath[string](t[k], path[1:], vstring)
		} else {
			fail = true
		}
	case []string: // leaf
		if kiok && len(path) == 1 {
			if vstring, ok := v.(string); ok {
				t = ensureLength(t, ki+1)
				t[ki], err = setPath[string](t[ki], path[1:], vstring)
			} else {
				fail = true
			}
		} else {
			fail = true
		}
	}

	if fail {
		return t0, fmt.Errorf("cannot set path to value on %T; path=%#v; value=%#v", t0, path, v)
	}

	return as[T](t0, err)
}

func getKeyInMap(f any, k any) (typeMatch bool, v any, ok bool) {
	// fast path string key in common map
	ks, ksok := k.(string)
	if ksok {
		typeMatch = true
		switch t := f.(type) {
		case Fields:
			v, ok = t.Get(ks)
		case (map[string]any):
			v, ok = t[ks]
		case (map[string]string):
			v, ok = t[ks]
		case (map[string][]string):
			v, ok = t[ks]
		default:
			typeMatch = false
		}
		if typeMatch {
			return
		}
	}

	rf := reflect.ValueOf(f)
	if rf.Kind() == reflect.Map {
		typeMatch = true
		rv := rf.MapIndex(reflect.ValueOf(k))
		if rv.IsValid() {
			v = rv.Interface()
			ok = true
		}
	}

	return
}

func getKeyInSlice(f any, k any) (typeMatch bool, v any, err error) {
	// fast path string key in common map
	var ki int
	switch kn := k.(type) {
	case int:
		ki = kn
	case string:
		ki, err = strconv.Atoi(kn)
	case int8:
		ki = int(kn)
	case int16:
		ki = int(kn)
	case int32:
		ki = int(kn)
	case int64:
		ki = int(kn)
	case float32:
		ki = int(kn)
	case float64:
		ki = int(kn)
	default:
		err = fmt.Errorf("key must be a string or an int")
	}
	if err != nil {
		typeMatch = reflect.ValueOf(f).Kind() == reflect.Slice
		return
	}

	typeMatch = true
	switch t := f.(type) {
	case []any:
		v = t[ki]
	case []string:
		v = t[ki]
	default:
		typeMatch = false
	}

	rf := reflect.ValueOf(f)
	if rf.Kind() == reflect.Slice {
		typeMatch = true
		rv := rf.Index(ki)
		v = rv.Interface()
	}

	return
}

func getPath(f any, k []string) (any, bool, error) {
	if len(k) == 0 {
		return f, true, nil
	}

	first := k[0]
	isMap, v, ok := getKeyInMap(f, first)
	var isSlice bool
	var err error
	if !isMap {
		isSlice, v, err = getKeyInSlice(f, first)
		if err != nil {
			return v, false, err
		}
		if !isSlice {
			return v, false, fmt.Errorf("don't know how to get %#v for %T", first, f)
		}
		ok = true
	}

	if len(k) == 1 {
		return v, ok, nil
	}

	return getPath(v, k[1:])
}
