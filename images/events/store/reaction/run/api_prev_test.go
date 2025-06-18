package reactionrun_test

import (
	"testing"
)

func TestAPIPrev(t *testing.T) {
	zeroID := ID{}

	testCases := []testCase{
		{
			name:   "simple",
			source: `(function(api) { api.log(JSON.stringify(api.prev()))})`,
			maxID:  zeroID,
			id:     zeroID,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{`{"type":"reaction","self":["type"]}`}},
				},
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
