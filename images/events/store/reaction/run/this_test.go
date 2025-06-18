package reactionrun_test

import "testing"

func TestThisUpdates(t *testing.T) {
	testCases := []testCase{
		{
			name:   "Set specific field",
			source: `(function() { this.one = 1 })`,
			wantUpdates: Map{
				"one": 1,
			},
			wantReceipt: Map{
				"this.one": 1,
			},
		},
		{
			name:   "Overwriting fields with an object",
			source: `(function() { delete this.type })`,
			wantUpdates: Map{
				"type": undefined,
			},
			wantReceipt: Map{
				"this.type": undefined,
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
