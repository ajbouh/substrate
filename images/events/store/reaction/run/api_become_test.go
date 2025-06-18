package reactionrun_test

import (
	"testing"
)

func TestAPIBecome(t *testing.T) {
	testCases := []testCase{
		{
			name:   "simple",
			source: `(function(api) { api.become({one: 1}) })`,
			wantUpdates: Map{
				"one":      1,
				"reaction": undefined,
				"type":     undefined,
			},
			wantReceipt: Map{
				"this.one":      1,
				"this.reaction": undefined,
				"this.type":     undefined,
			},
		},
		{
			name:   "malformed",
			source: `(function(api) { api.become(2) })`,
			wantError: Map{
				"message": "this.fields must be an Object",
			},
		},
		{
			name:   "malformed",
			source: `(function(api) { api.become([]) })`,
			wantError: Map{
				"message": "this.fields must be an Object",
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
