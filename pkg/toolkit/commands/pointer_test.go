package commands_test

import (
	"reflect"
	"testing"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

func TestJSONPointer(t *testing.T) {
	testCases := []struct {
		name         string
		str          string
		path         []string
		expectStrErr bool
	}{
		{
			name: "root",
			str:  "#",
			path: []string{},
		},
		{
			name: "simple",
			str:  "#/foo/bar",
			path: []string{"foo", "bar"},
		},
		{
			name: "empty segment",
			str:  "#/foo//bar",
			path: []string{"foo", "", "bar"},
		},
		{
			name: "ending with slash (empty last segment)",
			str:  "#/a/b/",
			path: []string{"a", "b", ""},
		},
		{
			name: "tilde",
			str:  "#/m~0n",
			path: []string{"m~n"},
		},
		{
			name: "slash",
			str:  "#/c~1d",
			path: []string{"c/d"},
		},
		{
			name: "tilde and slash",
			str:  "#/e~0~1f",
			path: []string{"e~/f"},
		},
		{
			name: "uri encoding like chars (should not be decoded)",
			str:  "#/%20",
			path: []string{"%20"},
		},
		{
			name: "complex escapes",
			str:  "#/~01~10/~00~11",
			path: []string{"~1/0", "~0/1"},
		},
		{
			name: "using array index syntax",
			str:  "#/a/0/b",
			path: []string{"a", "0", "b"},
		},
		{
			name:         "invalid (does not start with /)",
			str:          "a/b",
			path:         nil, // Not applicable for parse error testing directly
			expectStrErr: true,
		},
		// Should we error on invalid escape sequences?
		// {
		// 	name:         "invalid escape sequence",
		// 	str:          "#/foo~bar", // '~' not followed by 0 or 1
		// 	path:         nil,
		// 	expectStrErr: true,
		// },
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			parsedPtr, err := commands.ParseDataPointer(tc.str)

			if !tc.expectStrErr && err != nil {
				t.Fatalf("ParseDataPointer(%q) returned unexpected error: %v", tc.str, err)
			}

			if tc.expectStrErr {
				if err == nil {
					t.Fatalf("ParseDataPointer(%q) expected an error, but got nil", tc.str)
				}
				return
			}

			if str := parsedPtr.String(); str != tc.str {
				t.Errorf("ParseDataPointer(%q).String() = %q; want %q", tc.str, str, tc.str)
			}

			if path := parsedPtr.Path(); !reflect.DeepEqual(path, tc.path) {
				t.Errorf("ParseDataPointer(%q).Path() = %v; want %v", tc.str, path, tc.path)
			}

			ptrFromPath := commands.NewDataPointer(tc.path...)

			if str := ptrFromPath.String(); str != tc.str {
				t.Errorf("NewDataPointer(%v).String() = %q; want %q", tc.path, str, tc.str)
			}

			if path := ptrFromPath.Path(); !reflect.DeepEqual(path, tc.path) {
				t.Errorf("NewDataPointer(%v).Path() = %v; want %v", tc.path, path, tc.path)
			}
		})
	}
}
