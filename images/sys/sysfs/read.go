package sysfs

import (
	"bytes"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"reflect"
	"regexp"
	"strconv"
	"strings"
)

func (r *Root) Read(fsys fs.FS) error {
	return ReadSysfsFS(fsys, ".", r)
}

func ReadSysfsFS(fsys fs.FS, path string, o any) error {
	_, err := readSysfsFS(fsys, path, o, nil)
	return err
}

func readSysfsFS(fsys fs.FS, path string, o any, children []string) (bool, error) {
	fsysv := reflect.ValueOf(fsys)
	recurse := func(path string, v reflect.Value, children []string) (bool, error) {
		result := reflect.ValueOf(readSysfsFS).Call([]reflect.Value{
			fsysv,
			reflect.ValueOf(path),
			v,
			reflect.ValueOf(children),
		})
		okv := result[0]
		errv := result[1]
		if !errv.IsNil() {
			return okv.Bool(), errv.Interface().(error)
		}
		return okv.Bool(), nil
	}
	getChildPath := func(rest string) (string, error) {
		if rest == "" {
			return path, nil
		}

		if children != nil {
			if strings.HasPrefix(rest, "^") {
				pattern, err := regexp.Compile(rest)
				if err != nil {
					return "", err
				}
				var found string
				for _, c := range children {
					if pattern.MatchString(c) {
						found = c
						break
					}
				}
				if found == "" {
					return "", nil
				}
				rest = found
			}
		}
		return filepath.Join(path, rest), nil
	}

	some := false

	ot := reflect.TypeOf(o)

	switch ot.Kind() {
	case reflect.Map:
	case reflect.Pointer:
		switch ot.Elem().Kind() {
		case reflect.Struct:
		default:
			return some, fmt.Errorf("%s is a pointer but not to a struct", o)
		}
	default:
		return some, fmt.Errorf("%s is not a map or a pointer to a struct", o)
	}

	ote := ot.Elem()
	ov := reflect.ValueOf(o)

	for i := 0; i < ote.NumField(); i++ {
		ft := ote.Field(i)
		tag := ft.Tag.Get("sysfs")
		if tag == "" {
			continue
		}

		f := ov.Elem().Field(i)
		if !f.CanAddr() || !f.CanSet() {
			continue
		}

		op, rest, _ := strings.Cut(tag, ",")

		var eval func() (bool, reflect.Value, error)
		set := func(s reflect.Value) { f.Set(s) }

		target := ft.Type
		kind := target.Kind()
		switch kind {
		case reflect.Pointer:
			target = ft.Type.Elem()
			kind = target.Kind()
		case reflect.Slice, reflect.Map:
		default:
			set = func(s reflect.Value) {
				f.Set(s.Elem())
			}
		}

		switch op {
		case "base":
			eval = func() (bool, reflect.Value, error) {
				s := filepath.Base(path)
				return true, reflect.ValueOf(&s), nil
			}
		case "path":
			eval = func() (bool, reflect.Value, error) {
				s := path
				return true, reflect.ValueOf(&s), nil
			}
		case "read":
			p, err := getChildPath(rest)
			if err != nil {
				return some, err
			}

			// skip child that's not present
			if p == "" {
				continue
			}

			read := func() (bool, []byte, error) {
				b, err := fs.ReadFile(fsys, p)
				ok := err == nil
				if errors.Is(err, os.ErrNotExist) {
					err = nil
				}
				return ok, b, err
			}

			switch kind {
			case reflect.Struct:
				s := reflect.New(target)
				if method := s.MethodByName("ReadSysfs"); method.IsValid() {
					eval = func() (bool, reflect.Value, error) {
						result := method.Call([]reflect.Value{
							fsysv,
							reflect.ValueOf(p),
						})

						okv := result[0]
						errv := result[1]
						if !errv.IsNil() {
							return okv.Bool(), s, errv.Interface().(error)
						}

						return okv.Bool(), s, nil
					}
				} else if method := s.MethodByName("ParseSysfs"); method.IsValid() {
					eval = func() (bool, reflect.Value, error) {
						ok, b, err := read()
						if err != nil {
							return ok, s, err
						}
						result := method.Call([]reflect.Value{
							reflect.ValueOf(b),
						})

						okv := result[0]
						errv := result[1]
						if !errv.IsNil() {
							return okv.Bool(), s, errv.Interface().(error)
						}

						return okv.Bool(), s, nil
					}
				} else {
					return false, fmt.Errorf("struct doesn't define ReadSysfs or ParseSysfs")
				}
			case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
				eval = func() (bool, reflect.Value, error) {
					ok, b, err := read()
					if !ok || err != nil {
						i := 0
						return ok, reflect.ValueOf(&i), err
					}
					s := string(bytes.TrimRight(b, "\n"))
					i, err := strconv.ParseInt(s, 10, target.Bits())
					return ok, reflect.ValueOf(&i), err
				}
			case reflect.Bool:
				eval = func() (bool, reflect.Value, error) {
					ok, b, err := read()
					b = bytes.TrimRight(b, "\n")
					bl := !bytes.Equal(b, []byte("0"))
					return ok, reflect.ValueOf(&bl), err
				}
			case reflect.String:
				eval = func() (bool, reflect.Value, error) {
					ok, b, err := read()
					s := string(bytes.TrimRight(b, "\n"))
					return ok, reflect.ValueOf(&s), err
				}
			case reflect.Slice:
				if ft.Type.Elem().Kind() != reflect.Uint8 {
					return some, fmt.Errorf("unsupported slice element kind: %s", ft.Type.Elem().Name())
				}
				eval = func() (bool, reflect.Value, error) {
					ok, b, err := read()
					return ok, reflect.ValueOf(b), err
				}
			default:
				return some, fmt.Errorf("TODO support parsing data from file and setting: %s", ft.Type.String())
			}
		case "group":
			switch kind {
			case reflect.Map:
				eval = func() (bool, reflect.Value, error) {
					groups := map[string][]string{}

					m := reflect.MakeMap(ft.Type)

					pattern, err := regexp.Compile(rest)
					if err != nil {
						return false, m, err
					}

					entries, err := fs.ReadDir(fsys, path)
					if err != nil {
						if errors.Is(err, os.ErrNotExist) {
							err = nil
						}
						return false, m, err
					}

					fte := ft.Type.Elem()
					setEntry := func(key string, val reflect.Value) {
						m.SetMapIndex(reflect.ValueOf(key), val)
					}
					if fte.Kind() != reflect.Pointer {
						setEntry = func(key string, val reflect.Value) {
							m.SetMapIndex(reflect.ValueOf(key), val.Elem())
						}
					}

					// log.Printf("path=%s groups=%#v pattern=%#v len(entries)=%d", path, groups, rest, len(entries))
					for _, entry := range entries {
						entryname := entry.Name()
						s := pattern.FindString(entryname)
						// log.Printf("entryname=%#v s=%s", entryname, s)
						if s != "" {
							groups[s] = append(groups[s], entryname)
						}
					}

					some := false
					for group, children := range groups {
						n := reflect.New(fte)
						ok, err := recurse(path, n, children)
						if ok {
							some = true
							setEntry(group, n)
						}
						if err != nil {
							return some, m, err
						}
					}

					return some, m, nil
				}
			default:
				return some, fmt.Errorf("TODO support parsing group data from file and setting: %s", ft.Type.String())
			}
		case "readdir":
			switch kind {
			case reflect.Struct:
				eval = func() (bool, reflect.Value, error) {
					n := reflect.New(target)
					ok, err := recurse(filepath.Join(path, rest), n, nil)
					return ok, n, err
				}
			case reflect.Map:
				eval = func() (bool, reflect.Value, error) {
					m := reflect.MakeMap(target)

					pattern, err := regexp.Compile(rest)
					if err != nil {
						return false, m, err
					}

					entries, err := fs.ReadDir(fsys, path)
					if err != nil {
						if errors.Is(err, os.ErrNotExist) {
							err = nil
						}
						return false, m, err
					}

					fte := target.Elem()
					setEntry := func(key string, val reflect.Value) {
						m.SetMapIndex(reflect.ValueOf(key), val)
					}
					if fte.Kind() != reflect.Pointer {
						setEntry = func(key string, val reflect.Value) {
							m.SetMapIndex(reflect.ValueOf(key), val.Elem())
						}
					}
					some := false
					for _, entry := range entries {
						entryname := entry.Name()
						if !pattern.MatchString(entryname) {
							continue
						}

						n := reflect.New(fte)
						ok, err := recurse(filepath.Join(path, entryname), n, nil)
						if ok {
							some = true
							setEntry(entry.Name(), n)
						}
						if err != nil {
							return some, m, err
						}
					}

					return some, m, nil
				}
			default:
				return some, fmt.Errorf("%s is not a map type or a struct or a pointer to a struct for readdir op", ft.Name)
			}
		default:
			return some, fmt.Errorf("unknown operation in struct tag: %s", op)
		}

		ok, ftv, err := eval()
		if ok {
			some = true
			set(ftv)
		}

		// log.Printf("path=%s tag=%s op=%s ok=%#v some=%#v rest=%s err=%s", path, tag, op, ok, some, rest, err)

		if err != nil {
			return some, err
		}
	}

	return some, nil
}
