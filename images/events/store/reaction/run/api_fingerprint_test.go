package reactionrun_test

import (
	"testing"
)

func TestAPIFingerprint(t *testing.T) {
	testCases := []testCase{
		{
			name: "none",
			in: assign(
				reaction(),
				Map{
					"self": undefined,
				}),
			source: `(function(api) { api.log(api.fingerprint()) })`,
			wantError: Map{
				"message": "self is not set",
			},
		},
		{
			name: "simple",
			in: assign(
				reaction(),
				Map{
					"self": List{"name"},
					"name": "somereaction",
				}),
			source: `(function(api) { api.log(JSON.stringify(api.fingerprint())) })`,
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
