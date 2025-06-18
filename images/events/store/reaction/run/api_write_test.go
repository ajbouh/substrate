package reactionrun_test

import "testing"

func TestAPIWrite(t *testing.T) {
	testCases := []testCase{
		{
			name:   "empty write",
			source: `(function(api) { api.write([])})`,
		},
		{
			name:   "write single",
			source: `(function(api) { api.write([{fields: {name: "alice"}}])})`,
			wantWrites: []JSON{
				JSON(`{"name": "alice"}`),
			},
		},
		{
			name:   "write batch",
			source: `(function(api) { api.write([{fields: {name: "alice"}}, {fields: {food: "pizza"}}])})`,
			wantWrites: []JSON{
				JSON(`{"name": "alice"}`),
				JSON(`{"food": "pizza"}`),
			},
		},
		{
			name: "write multiple",
			source: `(function(api) {
				api.write([{fields: {name: "alice"}}])
				api.write([{fields: {food: "pizza"}}])
			})`,
			wantWrites: []JSON{
				JSON(`{"name": "alice"}`),
				JSON(`{"food": "pizza"}`),
			},
		},
		{
			name: "write bad value after good",
			source: `(function(api) {
				api.write([{fields: {name: "alice"}}, 1])
			})`,
			wantUpdates: Map{"reaction.disabled": true},
			wantReceipt: Map{"error": Map{"message": "error unmarshaling write: json: cannot unmarshal number into Go value of type event.PendingEvent"}},
		},
		{
			name: "invalid write after valid",
			source: `(function(api) {
				api.write([{fields: {name: "alice"}}])
				api.write([1])
			})`,
			wantWrites: []JSON{
				JSON(`{"name": "alice"}`),
			},
			wantUpdates: Map{"reaction.disabled": true},
			wantReceipt: Map{"error": Map{"message": "error unmarshaling write: json: cannot unmarshal number into Go value of type event.PendingEvent"}},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
