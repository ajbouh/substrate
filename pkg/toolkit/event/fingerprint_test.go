package event_test

import (
	"bytes"
	"sort"
	"testing"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
	"github.com/tidwall/gjson"
)

func TestFingerprintFor(t *testing.T) {
	tests := []struct {
		name           string
		input          []byte
		expectedOutput event.Fingerprint
		expectError    bool
	}{
		{
			name:           "Happy Path - Basic",
			input:          []byte(`{"z": 99, "a": "hello", "self": ["a"]}`),
			expectedOutput: []byte(`{"a":"hello"}`),
			expectError:    false,
		},
		{
			name:           "Happy Path - Multiple Fields",
			input:          []byte(`{"c": 3, "self": ["a", "b"], "a": 1, "b": 2}`),
			expectedOutput: []byte(`{"a":1,"b":2}`),
			expectError:    false,
		},
		{
			name:           "Happy Path - Complex Types",
			input:          []byte(`{"x": false, "y": {"z": 1}, "self": ["x", "y"]}`),
			expectedOutput: []byte(`{"x":false,"y":{"z":1}}`),
			expectError:    false,
		},
		{
			name:           "Happy Path - Sorting Is Enforced",
			input:          []byte(`{"zulu": 1, "yankee": 2, "xray": 3, "self": ["zulu", "xray", "yankee"]}`),
			expectedOutput: []byte(`{"xray":3,"yankee":2,"zulu":1}`),
			expectError:    false,
		},
		{
			name:           "Edge Case - Empty self yields empty object",
			input:          []byte(`{"a": 123, "self": []}`),
			expectedOutput: []byte(`{}`),
			expectError:    false,
		},
		{
			name:           "Edge Case - self is not ignored when listed",
			input:          []byte(`{"a": 1, "self": ["a", "self"]}`),
			expectedOutput: []byte(`{"a":1,"self":["a","self"]}`),
			expectError:    false,
		},
		{
			name:           "Error - Invalid JSON",
			input:          []byte(`{"a": 1,`),
			expectedOutput: nil,
			expectError:    true,
		},
		{
			name:           "Error - Not a JSON Object",
			input:          []byte(`[1, 2, 3]`),
			expectedOutput: nil,
			expectError:    true,
		},
		{
			name:           "Error - Missing self",
			input:          []byte(`{"a": 1, "b": 2}`),
			expectedOutput: nil,
			expectError:    true,
		},
		{
			name:           "Error - self is Wrong Type",
			input:          []byte(`{"a": 1, "self": "not-an-array"}`),
			expectedOutput: nil,
			expectError:    true,
		},
		{
			name:           "Error - self Array Contains Non-String",
			input:          []byte(`{"a": 1, "self": ["a", 42]}`),
			expectedOutput: nil,
			expectError:    true,
		},
		{
			name:           "Error - self Lists Missing Field",
			input:          []byte(`{"b": 2, "self": ["a"]}`),
			expectedOutput: nil,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := event.FingerprintFor(tt.input)

			if tt.expectError {
				if err == nil {
					t.Errorf("FingerprintFor() expected an error, but got nil")
				}
				return
			}

			if err != nil {
				t.Fatalf("FingerprintFor() returned an unexpected error: %v", err)
			}

			var keysInOrder []string
			gjson.ParseBytes(got).ForEach(func(key, value gjson.Result) bool {
				keysInOrder = append(keysInOrder, key.String())
				return true // continue iterating
			})

			if !sort.StringsAreSorted(keysInOrder) {
				t.Errorf("FingerprintFor() output keys are not sorted. Got order: %v", keysInOrder)
			}

			if !bytes.Equal(got, tt.expectedOutput) {
				t.Errorf("FingerprintFor()\n got: %s\nwant: %s", got, tt.expectedOutput)
			}
		})
	}
}
