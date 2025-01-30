package engine

import (
	"fmt"
	"log"
	"reflect"
	"sync"
)

// Unit is a reference to a struct.
type Unit interface{}

func unitFrom(v interface{}) Unit {
	rv := reflect.ValueOf(v)
	if rv.Kind() == reflect.Ptr {
		return Unit(v)
	}
	n := reflect.New(rv.Type())
	n.Elem().Set(rv)
	return n.Interface()
}

// Assembly is a registry of related units.
type Assembly struct {
	units []Unit
	mu    sync.Mutex
}

// New returns an Assembly with any values added as units.
func New(v ...Unit) (*Assembly, error) {
	a := &Assembly{}
	return a, a.Add(v...)
}

// Units returns the units in the assembly.
func (a *Assembly) Units() []Unit {
	a.mu.Lock()
	defer a.mu.Unlock()
	e := make([]Unit, len(a.units))
	copy(e, a.units)
	return e
}

// Main returns the first registered unit in the assembly.
// If there are no units it returns nil.
func (a *Assembly) Main() Unit {
	u := a.Units()
	if len(u) == 0 {
		return nil
	}
	return u[0]
}

// Add adds values to the assembly as units
func (a *Assembly) Add(v ...Unit) error {
	a.mu.Lock()
	defer a.mu.Unlock()
	for _, vv := range v {
		a.units = append(a.units, unitFrom(vv))
	}
	return nil
}

// AssignableTo returns units that can be assigned to a value of the provided type.
// If the type is a slice/array, it returns units assignable to the element of the type.
func (a *Assembly) AssignableTo(t reflect.Type) (u []Unit) {
	if t.Kind() == reflect.Slice || t.Kind() == reflect.Array {
		t = t.Elem()
	}
	for _, uu := range a.Units() {
		ut := reflect.TypeOf(uu)
		if ut.AssignableTo(t) {
			u = append(u, uu)
		}
	}
	return
}

// Assemble will set any fields on v that match a type or interface in the assembly.
// It only sets fields that are exported and unset. If there is more than one match for a
// field, the first one is used. If the field is a slice, it will be populated with all
// the matches for the slice element type.
func (a *Assembly) Assemble(v interface{}) error {
	rv := reflect.ValueOf(v)
	if rv.Kind() != reflect.Ptr {
		return fmt.Errorf("Assemble: v is not a pointer")
	}
	target := rv.Elem()
	isStructOrTypeDefinition := func(target reflect.Value) bool {
		if target.Kind() == reflect.Struct {
			return true
		}
		t := target.Type()
		if t.Kind() == reflect.Map && t != reflect.MapOf(t.Key(), t.Elem()) {
			return true
		}
		return false
	}

	if !isStructOrTypeDefinition(target) {
		return fmt.Errorf("Assemble: v is not pointing to a struct")
	}

	// TODO: update docs
	// TODO: Ensure helper to panic if nil?
	// try to use Assemble method
	asm := rv.MethodByName("Assemble")
	if asm.IsValid() && !asm.IsZero() && rv.Type() != reflect.TypeOf(a) {
		args := []reflect.Value{}
		for i := 0; i < asm.Type().NumIn(); i++ {
			argType := asm.Type().In(i)
			if argType.Kind() == reflect.Interface && argType.Name() == "" {
				args = append(args, reflect.Zero(argType))
				continue
			}
			assignable := a.AssignableTo(argType)
			if len(assignable) == 0 {
				args = append(args, reflect.Zero(argType))
				continue
			}
			switch argType.Kind() {
			case reflect.Slice:
				s := reflect.MakeSlice(argType, 0, len(assignable))
				for _, u := range assignable {
					v := reflect.ValueOf(u)
					s.Set(reflect.Append(s, v))
				}
				args = append(args, s)
			case reflect.Ptr, reflect.Interface:
				args = append(args, reflect.ValueOf(assignable[0]))
			default:
				args = append(args, reflect.ValueOf(assignable[0]).Elem())
			}
		}
		defer func() {
			if err := recover(); err != nil {
				log.Println("Assemble:", rv.Type())
				panic(err)
			}
		}()
		asm.Call(args)
		return nil
	}

	// otherwise populate by exported fields. only structs have these.
	if target.Kind() != reflect.Struct {
		return nil
	}
	for i := 0; i < target.NumField(); i++ {
		// filter out unexported fields
		if len(target.Type().Field(i).PkgPath) > 0 {
			continue
		}
		// TODO: struct tag ignore?
		field := target.Field(i)
		fieldType := target.Type().Field(i).Type
		if !isNilOrZero(field, fieldType) {
			continue
		}
		if fieldType.Kind() == reflect.Interface && fieldType.Name() == "" {
			continue
		}
		assignable := a.AssignableTo(fieldType)
		if len(assignable) == 0 {
			continue
		}
		switch fieldType.Kind() {
		case reflect.Slice:
			field.Set(reflect.MakeSlice(fieldType, 0, len(assignable)))
			for _, u := range assignable {
				v := reflect.ValueOf(u)
				field.Set(reflect.Append(field, v))
			}
		case reflect.Ptr, reflect.Interface:
			field.Set(reflect.ValueOf(assignable[0]))
		default:
			field.Set(reflect.ValueOf(assignable[0]).Elem())
		}
	}

	return nil
}

// SelfAssemble runs AssembleTo on the assembly units.
func (a *Assembly) SelfAssemble() error {
	for _, u := range a.Units() {
		if err := a.Assemble(u); err != nil {
			return err
		}
	}
	return nil
}

// ValueTo sets a value to the first unit that matches the value type.
func (a *Assembly) ValueTo(v interface{}) error {
	rv := reflect.ValueOf(v)
	if rv.Kind() != reflect.Ptr {
		return fmt.Errorf("ValueTo: v is not a pointer")
	}
	target := rv.Elem()
	ptyp := rv.Type()

	if target.Kind() == reflect.Ptr {
		target.Set(reflect.New(rv.Type().Elem().Elem()))
		ptyp = rv.Type().Elem()
		target = target.Elem()
	}

	for _, u := range a.Units() {
		up := reflect.ValueOf(u)
		uv := up.Elem()
		if up.Type().AssignableTo(ptyp) {
			target.Set(uv)
			return nil
		}
	}

	return fmt.Errorf("ValueTo: no assignable unit for value")
}

func isNilOrZero(v reflect.Value, t reflect.Type) bool {
	switch v.Kind() {
	default:
		return reflect.DeepEqual(v.Interface(), reflect.Zero(t).Interface())
	case reflect.Interface, reflect.Ptr:
		return v.IsNil()
	}
}
