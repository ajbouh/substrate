package reactionrun_test

import (
	"testing"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

func TestAPIID(t *testing.T) {
	zeroID := ID{}
	nonzeroID := event.MakeID()

	testCases := []testCase{
		{
			name:   "simple",
			source: `(function(api) { api.log(api.id())})`,
			maxID:  zeroID,
			id:     zeroID,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{zeroID.String()}},
				},
			},
		},
		{
			name:   "maxID less than reaction id",
			source: `(function(api) { api.log(api.id())})`,
			maxID:  nonzeroID,
			id:     zeroID,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{zeroID.String()}},
				},
			},
		},
		{
			name:   "maxID and reaction id are greater than zero",
			source: `(function(api) { api.log(api.id())})`,
			maxID:  nonzeroID,
			id:     nonzeroID,
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
