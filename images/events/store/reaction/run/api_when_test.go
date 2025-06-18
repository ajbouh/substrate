package reactionrun_test

import (
	"testing"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

func mustParseID(s string) ID {
	id, err := event.ParseID(s)
	if err != nil {
		panic(err)
	}
	return id
}

func TestAPIWhen(t *testing.T) {
	nonzeroID := mustParseID("00000000000000000000000001")

	testCases := []testCase{
		{
			name:   "no arg",
			source: `(function(api) { api.when() })`,
			wantUpdates: Map{
				"reaction.disabled": true,
			},
			wantReceipt: Map{
				"error": Map{
					"message": "when requires an argument",
					"name":    "Error",
					"stack":   "    at <anonymous> (<input>:21:20)\n    at <anonymous> (<input>:1:26)\n",
				},
			},
		},
		{
			name:   "bad arg",
			source: `(function(api) { api.when(1) })`,
			wantUpdates: Map{
				"reaction.disabled": true,
			},
			wantReceipt: Map{
				"error": Map{
					"message": "query expects an Object, got a Number",
				},
			},
		},
		{
			name:   "empty arg",
			source: `(function(api) { api.when({}) })`,
			wantContinuation: Map{
				"reaction-continuation.journal.entries": List{
					Map{
						"alg":  "HighwayHash",
						"cs":   "376315255d531d5bd41dca822c504b4b36cc3aef75fd9929f2e9a1e321e7b222",
						"now":  "00000000000000000000000000",
						"op":   "now",
						"this": "00000000000000000000000000",
					},
					Map{
						"alg":  "HighwayHash",
						"cs":   "c934b3fcc1a3b1c83f41e91e0b8066b8cefb32298b8126a578d8e178b2274cd1",
						"now":  "00000000000000000000000000",
						"op":   "id",
						"this": "00000000000000000000000000",
					},
					Map{
						"alg":  "HighwayHash",
						"cs":   "c9c15cc2b64ac1dec164094fc91e62d76b34560cea22fe28d48404fea1ae2b22",
						"now":  "00000000000000000000000000",
						"op":   "query",
						"this": "00000000000000000000000000",
					},
				},
			},
		},
		{
			name: "simple zero id",
			source: `(function(api) {
				api.when({foods: {basis_criteria: {where: {food: [{compare: "=", value: "pizza"}]}}}})
			})`,
			wantContinuation: Map{
				"reaction-continuation.journal.entries": List{
					Map{
						"alg":  "HighwayHash",
						"cs":   "376315255d531d5bd41dca822c504b4b36cc3aef75fd9929f2e9a1e321e7b222",
						"now":  "00000000000000000000000000",
						"op":   "now",
						"this": "00000000000000000000000000",
					},
					Map{
						"alg":  "HighwayHash",
						"cs":   "c934b3fcc1a3b1c83f41e91e0b8066b8cefb32298b8126a578d8e178b2274cd1",
						"now":  "00000000000000000000000000",
						"op":   "id",
						"this": "00000000000000000000000000",
					},
					Map{
						"alg":  "HighwayHash",
						"cs":   "c9c15cc2b64ac1dec164094fc91e62d76b34560cea22fe28d48404fea1ae2b22",
						"now":  "00000000000000000000000000",
						"op":   "query",
						"this": "00000000000000000000000000",
					},
				},
				"reaction-continuation.when.after": "00000000000000000000000000",
				"reaction-continuation.when.query": Map{
					"foods": Map{
						"basis_criteria": Map{"where": Map{"food": []any{Map{"compare": string("="), "value": string("pizza")}}}},
						"view_criteria":  Map{},
					},
				},
			},
			wantReceipt: Map{
				"this.reaction.when.after": event.ID{},
				"this.reaction.when.query": Map{
					"foods": Map{
						"basis_criteria": Map{"where": Map{"food": []any{Map{"compare": string("="), "value": string("pizza")}}}},
					},
				},
			},
		},
		{
			name:  "simple nonzero id",
			maxID: nonzeroID,
			source: `(function(api) {
				api.when({foods: {basis_criteria: {where: {food: [{compare: "=", value: "pizza"}]}}}})
			})`,
			wantContinuation: Map{
				"reaction-continuation.journal.entries": List{
					Map{
						"alg":  "HighwayHash",
						"cs":   "376315255d531d5bd41dca822c504b4b36cc3aef75fd9929f2e9a1e321e7b222",
						"now":  "00000000000000000000000001",
						"op":   "now",
						"this": "00000000000000000000000000",
					},
					Map{
						"alg":  "HighwayHash",
						"cs":   "c934b3fcc1a3b1c83f41e91e0b8066b8cefb32298b8126a578d8e178b2274cd1",
						"now":  "00000000000000000000000001",
						"op":   "id",
						"this": "00000000000000000000000000",
					},
					Map{
						"alg":  "HighwayHash",
						"cs":   "c9c15cc2b64ac1dec164094fc91e62d76b34560cea22fe28d48404fea1ae2b22",
						"now":  "00000000000000000000000001",
						"op":   "query",
						"this": "00000000000000000000000000",
					},
				},
				"reaction-continuation.when.after": nonzeroID,
				"reaction-continuation.when.query": Map{
					"foods": Map{
						"basis_criteria": Map{"where": Map{"food": []any{Map{"compare": string("="), "value": string("pizza")}}}},
						"view_criteria":  Map{},
					},
				},
			},
			wantReceipt: Map{
				"this.reaction.when.after": nonzeroID,
				"this.reaction.when.query": Map{
					"foods": Map{
						"basis_criteria": Map{"where": Map{"food": []any{Map{"compare": string("="), "value": string("pizza")}}}},
					},
				},
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
