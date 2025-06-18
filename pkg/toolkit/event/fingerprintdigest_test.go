package event_test

import (
	"testing"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

func TestFingerprintDigest_Equivalence(t *testing.T) {
	tests := []struct {
		name        string
		input1      []byte
		input2      []byte
		shouldMatch bool
	}{
		// Cases that SHOULD match
		{
			name:        "SHOULD MATCH: Different Other Values",
			input1:      []byte(`{"a": 1, "z": 99, "self": ["a"]}`),
			input2:      []byte(`{"a": 1, "y": 88, "self": ["a"]}`),
			shouldMatch: true,
		},
		{
			name:        "SHOULD MATCH: Different Field and Self Order",
			input1:      []byte(`{"b": 2, "a": 1, "self": ["a", "b"]}`),
			input2:      []byte(`{"a": 1, "b": 2, "self": ["b", "a"]}`),
			shouldMatch: true,
		},
		// Cases that SHOULD NOT match
		{
			name:        "SHOULD NOT MATCH: Different Fingerprint Values",
			input1:      []byte(`{"a": 1, "self": ["a"]}`),
			input2:      []byte(`{"a": 2, "self": ["a"]}`),
			shouldMatch: false,
		},
		{
			name:        "SHOULD NOT MATCH: Different Fingerprint Fields",
			input1:      []byte(`{"a": 1, "self": ["a"]}`),
			input2:      []byte(`{"b": 1, "self": ["b"]}`),
			shouldMatch: false,
		},
		{
			name:        "SHOULD NOT MATCH: Superset of Fields",
			input1:      []byte(`{"a": 1, "b": 2, "self": ["a"]}`),
			input2:      []byte(`{"a": 1, "b": 2, "self": ["a", "b"]}`),
			shouldMatch: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			digest1, err1 := event.FingerprintKeyFor(tt.input1)
			if err1 != nil {
				t.Fatalf("FingerprintKeyFor(input1) returned an unexpected error: %v", err1)
			}

			digest2, err2 := event.FingerprintKeyFor(tt.input2)
			if err2 != nil {
				t.Fatalf("FingerprintKeyFor(input2) returned an unexpected error: %v", err2)
			}

			if digest1 == "" || digest2 == "" {
				t.Fatal("Expected non-empty digests, but got an empty string")
			}

			if tt.shouldMatch {
				if digest1 != digest2 {
					t.Errorf("Expected digests to be equal, but they were different:\n digest1: %s\n digest2: %s", digest1, digest2)
				}
			} else {
				if digest1 == digest2 {
					t.Errorf("Expected digests to be different, but they were the same: %s", digest1)
				}
			}
		})
	}
}
