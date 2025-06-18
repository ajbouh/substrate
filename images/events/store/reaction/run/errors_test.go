package reactionrun_test

import "testing"

func TestBadFormats(t *testing.T) {
	testCases := []testCase{
		{
			name: "Valid JSON array with multiple objects",
			in:   JSON(`[{"a": 1}, {"b": 2}]`),
			err:  "reaction: bad format",
		},
		{
			name: "Empty JSON array",
			in:   JSON(`[]`),
			err:  "reaction: bad format",
		},
		{
			name: "Null JSON value",
			in:   JSON(`null`),
			err:  "reaction: bad format",
		},
		{
			name: "Invalid JSON format",
			in:   JSON(`[{"a": 1},]`),
			err:  "reaction: bad format",
		},
		{
			name: "JSON object",
			in:   JSON(`{"a": 1}`),
			err:  "reaction: bad format",
		},
		{
			name: "Empty input",
			in:   JSON(``),
			err:  "reaction: bad format",
		},
		{
			name: "Empty JSON object",
			in:   JSON(`{}`),
			err:  "reaction: bad format",
		},
		{
			name: "Reaction without source",
			in:   JSON(`{"type":"reaction"}`),
			err:  "reaction: missing source",
		},
		{
			name: "Empty source",
			in:   reaction(``),
			err:  "reaction: missing source",
		},
	}
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) { tc.Run(t) })
	}
}

func TestBadSourceTypes(t *testing.T) {
	testCases := []testCase{
		{
			name:   "Array",
			source: `[]`,
			wantError: Map{
				"message": "reaction: source does not provide a function, got Array",
			},
		},
		{
			name:   "undefined",
			source: `undefined`,
			wantError: Map{
				"message": "reaction: source does not provide a function, got undefined",
			},
		},
		{
			name:   "null",
			source: `null`,
			wantError: Map{
				"message": "reaction: source does not provide a function, got null",
			},
		},
		{
			name:   "Object",
			source: `({})`,
			wantError: Map{
				"message": "reaction: source does not provide a function, got Object",
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}

func TestSyntaxErrors(t *testing.T) {
	testCases := []testCase{
		{
			name:   "Syntax Error",
			source: `(function() {,})`,
			wantError: Map{
				"message": "unexpected token in expression: ','",
				"name":    "SyntaxError",
				"stack":   "    at <input>:1:14\n",
			},
		},
		{
			// todo once we do the proper dance for allowing a reaction to be a module, this shouldn't be an error anymore.
			name:   "Empty default function",
			source: `export default function() {}`,
			wantError: Map{
				"message": "reaction: source does not provide a function, got undefined",
			},
		},
		{
			name:   "Naked function (invalid)",
			source: `function() {}`,
			wantError: Map{
				"message": "function name expected",
				"name":    "SyntaxError",
				"stack":   "    at <input>:1:9\n",
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}

func TestRuntimeErrors(t *testing.T) {
	testCases := []testCase{
		{
			name:   "Thrown by runtime",
			source: `(function() { undefined.foo })`,
			wantError: Map{
				"message": "cannot read property 'foo' of undefined",
				"name":    "TypeError",
				"stack":   "    at <anonymous> (<input>:1:24)\n",
			},
		},
		{
			name:   "Thrown by user",
			source: `(function() { throw new Error("custom message") })`,
			wantError: Map{
				"message": "custom message",
				"name":    "Error",
				"stack":   "    at <anonymous> (<input>:1:30)\n",
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
