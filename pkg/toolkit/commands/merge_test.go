package commands_test

import (
	"reflect"
	"testing"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

func TestMergeFields(t *testing.T) {
	type F = commands.Fields
	testCases := []struct {
		name         string
		a            F
		b            F
		expect       F
		expectStrErr bool
	}{
		{
			name:   "single map",
			a:      F{"one": "1"},
			b:      nil,
			expect: F{"one": "1"},
		},
		{
			name:   "single map alt",
			a:      nil,
			b:      F{"two": "2"},
			expect: F{"two": "2"},
		},
		{
			name:   "simple map",
			a:      F{"one": "1"},
			b:      F{"two": "2"},
			expect: F{"one": "1", "two": "2"},
		},
		{
			name:   "slices",
			a:      F{"one": "1", "slice": []any{"slice0"}},
			b:      F{"two": "2"},
			expect: F{"one": "1", "two": "2", "slice": []any{"slice0"}},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			got, err := commands.MergeFields(tc.a, tc.b)
			if !tc.expectStrErr && err != nil {
				t.Fatalf("MergeFields(%#v, %#v) returned unexpected error: %v", tc.a, tc.b, err)
			}

			if tc.expectStrErr {
				if err == nil {
					t.Fatalf("MergeFields(%#v, %#v) expected an error, but got nil", tc.a, tc.b)
				}
				return
			}

			if !reflect.DeepEqual(tc.expect, got) {
				t.Errorf("got %#v; want %#v", tc.expect, got)
			}
		})
	}
}
