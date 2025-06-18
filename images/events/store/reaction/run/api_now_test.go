package reactionrun_test

import (
	"testing"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

func TestAPINow(t *testing.T) {
	zeroID := ID{}
	nonzeroID := event.MakeID()

	testCases := []testCase{
		{
			name:   "simple",
			source: `(function(api) { api.log(api.now())})`,
			maxID:  zeroID,
			id:     zeroID,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{zeroID.String()}},
				},
			},
		},
		{
			name:   "simple",
			source: `(function(api) { api.log(api.now())})`,
			maxID:  nonzeroID,
			id:     zeroID,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{nonzeroID.String()}},
				},
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
