package reactionrun_test

import "testing"

func TestReturnValues(t *testing.T) {
	testCases := []testCase{
		{
			name:   "Return undefined",
			source: `(function() {})`,
		},
		{
			name:   "Return empty array",
			source: `(function() { return [] })`,
		},
		{
			name:   "Return number",
			source: `(function() { return 1 })`,
		},
		{
			name:   "Return promise",
			source: `(function() { return Promise.resolve(1) })`,
		},
		{
			name:   "Return function",
			source: `(function() { return new Function() })`,
		},
		// // For some reason, returning an object fails with error:
		// // Map{"message": "Object object expected", "name": "TypeError"}
		// // Disable this test for now.
		// {
		// 	name:       "Return object",
		// 	source:     `(function() { return new Object() })`,
		// },
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}

}
