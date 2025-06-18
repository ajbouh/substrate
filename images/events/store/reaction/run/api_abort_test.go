package reactionrun_test

import "testing"

func TestAPIAbort(t *testing.T) {
	testCases := []testCase{
		{
			name:        "simple",
			source:      `(function(api) { api.abort() })`,
			wantUpdates: Map{"reaction.disabled": true},
			wantReceipt: Map{"error": Map{
				"message": "aborted without reason",
			}},
		},
		{
			name:        "simple",
			source:      `(function(api) { api.abort("secret reason") })`,
			wantUpdates: Map{"reaction.disabled": true},
			wantReceipt: Map{"error": Map{
				"message": "secret reason",
			}},
		},
		{
			name:        "malformed",
			source:      `(function(api) { api.abort(1) })`,
			wantUpdates: Map{"reaction.disabled": true},
			wantReceipt: Map{"error": Map{
				"message": "aborted with malformed reason",
			}},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
