package commands_test

import (
	"reflect"
	"testing"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

func TestPluck(t *testing.T) {
	var cases = []struct {
		name string
		ptr  string
		src  any
		ret  any
	}{
		{
			name: "simple field",
			ptr:  "#/foo",
			src:  commands.Fields{"foo": 1},
			ret:  1,
		},
		{
			name: "simple slice index",
			ptr:  "#/1",
			src:  []any{"zero", "one"},
			ret:  "one",
		},
		{
			name: "root object",
			ptr:  "#",
			src:  "s",
			ret:  "s",
		},
	}

	for _, c := range cases {
		c := c
		t.Run(c.name, func(t *testing.T) {
			ptr, err := commands.ParseDataPointer(c.ptr)
			if err != nil {
				t.Fatalf("unexpected parse error: %s", err)
			}

			got, err := commands.Get[any](c.src, ptr)
			if err != nil {
				t.Fatalf("unexpected get error: %s", err)
			}
			if !reflect.DeepEqual(got, c.ret) {
				t.Fatalf("got %q; want %q", got, c.ret)
			}
		})
	}
}

func TestLen(t *testing.T) {
	var cases = []struct {
		name string
		ptr  string
		src  any
		ret  any
	}{
		{
			name: "fields",
			src:  commands.Fields{"foo": 1},
			ptr:  "#",
			ret:  1,
		},
		{
			name: "slice",
			src:  []any{"zero", "one"},
			ptr:  "#",
			ret:  2,
		},
		{
			name: "number",
			src:  1,
			ptr:  "#",
			ret:  0,
		},
	}

	for _, c := range cases {
		c := c
		t.Run(c.name, func(t *testing.T) {
			ptr, err := commands.ParseDataPointer(c.ptr)
			if err != nil {
				t.Fatalf("unexpected parse error: %s", err)
			}

			got := commands.LenGetPath(c.src, ptr.Path()...)
			if !reflect.DeepEqual(got, c.ret) {
				t.Fatalf("got %#v; want %#v", got, c.ret)
			}
		})
	}
}
