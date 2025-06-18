package reactionrun_test

import "testing"

func TestSafetyStripWhen(t *testing.T) {
	testCases := []testCase{
		{
			name:   "Should strip reaction.when.alarm",
			source: `(function() { })`,
			in: assign(reaction(),
				Map{
					"reaction.when.alarm": 0,
				}),
			wantReceipt: Map{
				"this.reaction.when": undefined,
			},
		},
		{
			name:   "Should strip reaction.when.query",
			source: `(function() { })`,
			in: assign(reaction(),
				Map{
					"reaction.when.query": Map{},
				}),
			wantReceipt: Map{
				"this.reaction.when": undefined,
			},
		},
		{
			name:   "Should strip reaction.when for a syntax error",
			source: `(function() { , })`,
			in: assign(reaction(),
				Map{
					"reaction.when.alarm": 0,
				}),
			wantUpdates: Map{
				"reaction.disabled": true,
				"reaction.when":     undefined,
			},
			wantReceipt: Map{
				"this.reaction.when": undefined,
				"error": Map{
					"message": "unexpected token in expression: ','",
					"name":    "SyntaxError",
					"stack":   "    at <input>:1:15\n",
				},
			},
		},
		{
			name:   "Should strip reaction.when for a runtime error",
			source: `(function() { throw Error("custom") })`,
			in: assign(reaction(),
				Map{
					"reaction.when.alarm": 0,
				}),
			wantUpdates: Map{
				"reaction.disabled": true,
			},
			wantReceipt: Map{
				"this.reaction.when": undefined,
				"error": Map{
					"message": "custom",
					"name":    "Error",
					"stack":   "    at <anonymous> (<input>:1:26)\n",
				},
			},
		},
		{
			name:   "Should strip reaction.when for an infinite loop",
			source: `(function() { while (true); })`,
			in: assign(reaction(),
				Map{
					"reaction.when.alarm": 0,
				}),
			wantUpdates: Map{"reaction.disabled": true},
			wantReceipt: Map{
				"this.reaction.when": undefined,
				"error": Map{
					"message": "context deadline exceeded",
				},
			},
		},
	}

	for _, tc := range testCases {
		if tc.wantUpdates == nil {
			tc.wantUpdates = Map{}
		}
		tc.wantUpdates["reaction.when"] = undefined
		t.Run(tc.name, tc.Run)
	}
}

func TestSafetyNoHang(t *testing.T) {
	testCases := []testCase{
		{
			name:        "Should not hang with infinite loop",
			source:      `(function() { while (true); })`,
			wantUpdates: Map{"reaction.disabled": true},
			wantReceipt: Map{"error": Map{
				"message": "context deadline exceeded",
			}},
		},
		{
			name:        "Return promise that never resolves",
			source:      `(function test() { return new Promise(() => { }) })`,
			wantUpdates: Map{"reaction.disabled": true},
			wantReceipt: Map{"error": Map{
				"message": "return value is an unresolvable promise",
			}},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
