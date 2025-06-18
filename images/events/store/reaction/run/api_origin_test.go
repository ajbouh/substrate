package reactionrun_test

import (
	"testing"
)

func TestAPIOrigin(t *testing.T) {
	nonzeroID := mustParseID("00000000000000000000000001")

	testCases := []testCase{
		{
			name: "undefined on value that isn't query result",
			source: `(function(api) {
				api.log(JSON.stringify(api.origin({})))
			})`,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{`undefined`}},
				},
			},
		},
		{
			name: "is the time of the query made for zero",
			source: `(function(api) {
				const result = api.query({
					reactions: {basis_criteria: {where: {type: [{compare: "=", value: "reaction"}]}}},
				})
				api.log(JSON.stringify(api.origin(result)))
			})`,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{`{"time":"00000000000000000000000000"}`}},
				},
			},
		},
		{
			name:  "is the time of the query made for nonzero",
			id:    nonzeroID,
			maxID: nonzeroID,
			source: `(function(api) {
				const result = api.query({
					reactions: {basis_criteria: {where: {type: [{compare: "=", value: "reaction"}]}}},
				})
				api.log(JSON.stringify(api.origin(result)))
			})`,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{`{"time":"00000000000000000000000001"}`}},
				},
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
