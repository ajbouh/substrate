package reactiontest

import (
	"encoding/json"
	"fmt"
	"reflect"
	"testing"
)

func Jsonify(arg any, more ...any) ([]json.RawMessage, error) {
	if arg == nil {
		return nil, fmt.Errorf("unsupported type: <nil>")
	}

	val := reflect.ValueOf(arg)

	switch val.Kind() {
	case reflect.Slice:
		result := make([]json.RawMessage, val.Len())
		for i := 0; i < val.Len(); i++ {
			jsonBytes, err := json.Marshal(val.Index(i).Interface())
			if err != nil {
				return nil, fmt.Errorf("failed to marshal element at index %d to JSON: %w", i, err)
			}
			result[i] = json.RawMessage(jsonBytes)
		}
		return result, nil

	case reflect.Func:
		funcType := val.Type()
		numIn := funcType.NumIn()

		if funcType.NumOut() != 1 {
			return nil, fmt.Errorf("function must return exactly one value")
		}
		if len(more) < numIn {
			return nil, fmt.Errorf("not enough arguments for function: got %d, want %d", len(more), numIn)
		}

		callArgs := make([]reflect.Value, numIn)
		for i := 0; i < numIn; i++ {
			if more[i] == nil {
				callArgs[i] = reflect.Zero(funcType.In(i))
			} else {
				callArgs[i] = reflect.ValueOf(more[i])
			}
		}

		returnValues := val.Call(callArgs)
		result := returnValues[0].Interface()
		remainingArgs := more[numIn:]
		return Jsonify(result, remainingArgs...)

	default:
		// Handle any other type as a single-element slice.
		jsonBytes, err := json.Marshal(arg)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal argument to JSON: %w", err)
		}
		return []json.RawMessage{json.RawMessage(jsonBytes)}, nil
	}
}

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
			got, err := Jsonify(tc.input, tc.more...)

			if (err != nil) != tc.wantErr {
				t.Errorf("Jsonify() error = %v, wantErr %v", err, tc.wantErr)
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
