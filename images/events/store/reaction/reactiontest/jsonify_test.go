package reactiontest_test

import (
	"encoding/json"
	"fmt"
	"reflect"
	"testing"

	"github.com/ajbouh/substrate/images/events/store/reaction/reactiontest"
)

func TestJsonify(t *testing.T) {
	// Helper to create json.RawMessage from string for test cases
	rm := func(s string) json.RawMessage {
		return json.RawMessage(s)
	}

	testCases := []struct {
		name    string
		input   any
		more    []any
		want    []json.RawMessage
		wantErr bool
	}{
		{
			name:    "string slice input",
			input:   []string{"hello", "world"},
			want:    []json.RawMessage{rm(`"hello"`), rm(`"world"`)},
			wantErr: false,
		},
		{
			name:    "any slice input",
			input:   []any{"this", "is", 123, true},
			want:    []json.RawMessage{rm(`"this"`), rm(`"is"`), rm("123"), rm("true")},
			wantErr: false,
		},
		{
			name: "function returning string slice",
			input: func() any {
				return []string{"from", "a", "function"}
			},
			want:    []json.RawMessage{rm(`"from"`), rm(`"a"`), rm(`"function"`)},
			wantErr: false,
		},
		{
			name: "function with args returning mixed slice",
			input: func(s string, b bool) any {
				return []any{s, b}
			},
			more:    []any{"value", true},
			want:    []json.RawMessage{rm(`"value"`), rm("true")},
			wantErr: false,
		},
		{
			name: "nested function call with args",
			input: func(prefix string) any {
				return func(val int) any {
					return []string{fmt.Sprintf("%s-%d", prefix, val)}
				}
			},
			more:    []any{"id", 99},
			want:    []json.RawMessage{rm(`"id-99"`)},
			wantErr: false,
		},
		{
			name:    "single value (int)",
			input:   12345,
			want:    []json.RawMessage{rm("12345")},
			wantErr: false,
		},
		{
			name:    "single value (struct)",
			input:   struct{ Name string }{Name: "test"},
			want:    []json.RawMessage{rm(`{"Name":"test"}`)},
			wantErr: false,
		},
		{
			name:    "nil input",
			input:   nil,
			want:    nil,
			wantErr: true,
		},
		{
			name:    "error on not enough args",
			input:   func(i int, j bool) any { return nil },
			more:    []any{1},
			want:    nil,
			wantErr: true,
		},
		{
			name:    "error on unmarshallable type in slice",
			input:   []any{make(chan int)},
			want:    nil,
			wantErr: true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			got, err := reactiontest.Jsonify(tc.input, tc.more...)

			if (err != nil) != tc.wantErr {
				t.Errorf("jsonify() error = %v, wantErr %v", err, tc.wantErr)
				return
			}

			if !reflect.DeepEqual(got, tc.want) {
				// For better error messages, convert RawMessage to string for printing
				gotStr := make([]string, len(got))
				for i, v := range got {
					gotStr[i] = string(v)
				}
				wantStr := make([]string, len(tc.want))
				for i, v := range tc.want {
					wantStr[i] = string(v)
				}
				t.Errorf("jsonify() got = %v, want %v", gotStr, wantStr)
			}
		})
	}
}
