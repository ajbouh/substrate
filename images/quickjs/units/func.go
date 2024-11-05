package units

import (
	"encoding/json"
	"fmt"
	"reflect"
	"runtime/debug"

	"github.com/buke/quickjs-go"
)

func checkFuncType(t reflect.Type, f any) error {
	if t.Kind() != reflect.Func {
		return fmt.Errorf("value provided is not a function: %#v", f)
	}

	if t.NumOut() != 2 {
		return fmt.Errorf("value provided must have exactly two return values: %#v", f)
	}

	if !t.Out(1).AssignableTo(reflect.TypeFor[error]()) {
		return fmt.Errorf("second return value must be assignable to error: %#v", f)
	}

	return nil
}

func callFunc(qctx *quickjs.Context, fv reflect.Value, ft reflect.Type, args []quickjs.Value) (*quickjs.Value, error) {
	n := ft.NumIn()
	in := make([]reflect.Value, n)
	for i := 0; i < n; i++ {
		ti := ft.In(i)
		var vi reflect.Value
		kind := ti.Kind()
		switch kind {
		default:
			vi = reflect.New(ti)
			s := args[i].JSONStringify()
			err := json.Unmarshal([]byte(s), vi.Interface())
			if err != nil {
				return nil, err
			}
		}
		in[i] = vi.Elem()
	}

	out := fv.Call(in)

	if !out[1].IsNil() {
		err := out[1].Interface().(error)
		if err != nil {
			return nil, err
		}
	}

	rv := out[0].Interface()
	b, err := json.Marshal(rv)
	if err != nil {
		return nil, err
	}

	rvq := qctx.ParseJSON(string(b))
	return &rvq, nil
}

func asAsyncFunction(qctx *quickjs.Context, f any) (*quickjs.Value, error) {
	v := reflect.ValueOf(f)
	t := v.Type()

	err := checkFuncType(t, f)
	if err != nil {
		return nil, err
	}

	af := qctx.AsyncFunction(func(qctx *quickjs.Context, this, promise quickjs.Value, args []quickjs.Value) quickjs.Value {
		rvq, err := callFunc(qctx, v, t, args)
		if err != nil {
			rej := qctx.Error(err)
			defer rej.Free()
			promise.Call("reject", rej)
			return promise
		}
		defer rvq.Free()

		promise.Call("resolve", *rvq)
		return promise
	})

	return &af, nil
}

func asFunction(qctx *quickjs.Context, f any) (*quickjs.Value, error) {
	v := reflect.ValueOf(f)
	t := v.Type()

	err := checkFuncType(t, f)
	if err != nil {
		return nil, err
	}

	af := qctx.Function(func(ctx *quickjs.Context, this quickjs.Value, args []quickjs.Value) quickjs.Value {
		rvq, err := callFunc(qctx, v, t, args)
		if err != nil {
			return qctx.ThrowError(err)
		}

		return *rvq
	})

	return &af, nil
}
