package reactionrun_test

import "testing"

func TestAPILog(t *testing.T) {
	testCases := []testCase{
		{
			name:   "log empty",
			source: `(function(api) { api.log()})`,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{}},
				},
			},
		},
		{
			name:   "log simple",
			source: `(function(api) { api.log("hi")})`,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{"hi"}},
				},
			},
		},
		{
			name:   "log non-JSON bigint",
			source: `(function(api) { api.log(12345678901234567890n)})`,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{"12345678901234567890"}},
				},
			},
		},
		{
			name: "log non-JSON cycle",
			source: `(function(api) {
				let obj = {}; obj.self = obj;
				api.log(obj)
			})`,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{"[object Object]"}},
				},
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
