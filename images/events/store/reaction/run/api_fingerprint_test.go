package reactionrun_test

import (
	"testing"
)

func TestAPIFingerprint(t *testing.T) {
	testCases := []testCase{
		{
			name:   "none",
			source: `(function(api) { api.log(api.fingerprint()) })`,
			wantError: Map{
				"message": "self is not set",
			},
		},
		{
			name: "simple",
			in: assign(
				reaction(`(function(api) { api.log(JSON.stringify(api.fingerprint())) })`),
				Map{
					"self": List{"name"},
					"name": "somereaction",
				}),
			wantReceipt: Map{
				"log": List{
					Map{"args": List{`{"name":"somereaction"}`}},
				},
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
