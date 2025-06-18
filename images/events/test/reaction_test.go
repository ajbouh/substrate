package events_test

import (
	"encoding/json"
	"testing"

	"github.com/ajbouh/substrate/images/events/store/reaction/reactiontest"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type O = commands.Fields

var undefined = reactiontest.Undefined
var receipt = reactiontest.Receipt
var assign = reactiontest.Assign

type Map = map[string]any
type List = []any
type ID = event.ID
type JSON = json.RawMessage

func reaction(path, source string) O {
	return O{
		"fields": O{
			"type": "reaction",
			"self": []any{"path"},
			"path": path,
			"reaction": O{
				"when": O{"alarm": 0},
				"type": "text/javascript",
			},
		},
		"data": source,
	}
}

func mustLog(c *testClient, expect ...any) {
	c.T.Helper()

	logQuery := O{"basis_criteria": O{"where": O{"type": []any{O{"compare": "=", "value": "reaction-receipt"}}}}}

	type receiptLogEntry struct {
		Args []any `json:"args"`
	}
	type receipt struct {
		Log []receiptLogEntry `json:"log"`
	}

	mustQuery[[]receipt](c, "log event should be present; expected %#v, got %#v",
		expect,
		logQuery)
}

func TestReactionWrite(t *testing.T) {
	c := NewClient(t)

	c.Write(O{
		"fields": O{
			"type": "reaction",
			"self": []any{"path"},
			"path": "/myreaction",
			"reaction": O{
				"when": O{"alarm": 0},
				"type": "text/javascript",
			},
		},
		"data": `(function react(api) { api.write([{fields: {foo:"bar"}}]) })`,
	})

	mustQuery[[]O](c, "expected %#v, got %#v",
		JSON(`[{"foo": "bar"}]`),
		JSON(`{"basis_criteria": {"where": {"foo": [{"compare": "=", "value": "bar"}]}}}`))
}

func TestReactionLog(t *testing.T) {
	c := NewClient(t)

	c.Write(O{
		"fields": O{
			"type": "reaction",
			"self": []any{"path"},
			"path": "/myreaction",
			"reaction": O{
				"when": O{"alarm": 0},
				"type": "text/javascript",
			},
		},
		"data": `(function react(api) { api.log("hi"); api.log("always"); })`,
	})

	mustLog(c,
		O{"log": []any{O{"args": []any{"hi"}}, O{"args": []any{"always"}}}})
}

func TestReactionAsyncPause(t *testing.T) {
	c := NewClient(t)

	c.Write(O{
		"fields": O{
			"type": "reaction",
			"self": []any{"path"},
			"path": "/myreaction",
			"reaction": O{
				"when": O{"alarm": 0},
				"type": "text/javascript",
			},
		},
		"data": `(async function react(api) {
					api.log("hi");
					await api.query({}, {alarm: 0});
					api.log("always");
					await api.query({}, {alarm: Date.now()+1000});
					api.log("never");
					return [];
				})`,
	})

	mustLog(c,
		O{"log": []any{O{"args": []any{"hi"}}, O{"args": []any{"always"}}}})
}

func TestReactionPause(t *testing.T) {
	c := NewClient(t)

	c.Write(O{
		"fields": O{
			"type": "reaction",
			"self": []any{"path"},
			"path": "/myreaction",
			"reaction": O{
				"when": O{"alarm": 0},
				"type": "text/javascript",
			},
		},
		"data": `(function react(api) {
					api.log("hi");
					api.query({}, {alarm: 0});
					api.log("always");
					api.query({}, {alarm: Date.now()+1000});
					api.log("never");
					return [];
				})`,
	})

	mustLog(c,
		O{"log": []any{O{"args": []any{"hi"}}, O{"args": []any{"always"}}}})
}

func TestReactionQuery(t *testing.T) {
	c := NewClient(t)

	c.Write(O{"fields": O{"name": "alice"}})
	c.Write(O{
		"fields": O{
			"type": "reaction",
			"self": []any{"path"},
			"path": "/myreaction",
			"reaction": O{
				"when": O{"alarm": 0},
				"type": "text/javascript",
			},
		},
		"data": `(function react(api) {
	const matches = api.query({records: {basis_criteria: {where: {name: [{compare: "=", value: "alice"}]}}}})
	if (matches.records.length === 1) {
		api.log("ok")
	}
})`,
	})

	mustLog(c,
		O{"log": []any{O{"args": []any{"ok"}}}})
}

func TestReactionOrdering(t *testing.T) {
	c := NewClient(t)

	c.Write(
		O{"fields": O{"name": "alice"}},
		O{
			"fields": O{
				"type": "reaction",
				"self": []any{"path"},
				"path": "/myreaction",
				"reaction": O{
					"when": O{"alarm": 0},
					"type": "text/javascript",
				},
			},
			"data": `(function react(api) {
	const matches = api.query({records: {basis_criteria: {where: {name: [{compare: "=", value: "alice"}]}}}})
	if (matches.records.length === 1) {
		api.log("ok")
	}
})`},
		O{"fields": O{"name": "alice"}},
	)

	mustLog(c,
		O{"log": []any{O{"args": []any{"ok"}}}})
}

func TestReactionThis(t *testing.T) {
	c := NewClient(t)

	c.Write(
		O{"fields": O{"name": "alice"}},
		O{
			"fields": O{
				"type": "reaction",
				"self": []any{"path"},
				"path": "/myreaction",
				"reaction": O{
					"when": O{"alarm": 0},
					"type": "text/javascript",
				},
			},
			"data": `(function react(api) {
	const matches = api.query({records: {basis_criteria: {where: {name: [{compare: "=", value: "alice"}]}}}})
	if (matches.records.length === 1) {
		api.log("ok")
	}
})`},
		O{"fields": O{"name": "alice"}},
	)

	mustLog(c,
		O{"log": []any{O{"args": []any{"ok"}}}})
}

func TestReactions(t *testing.T) {
	testCases := []struct {
		name string

		write       []any
		wantLogs    []any
		query       any
		wantResults any
	}{
		{
			name: "simple reaction logging",
			write: []any{
				O{"fields": O{"name": "alice"}},
				reaction("/myreaction", `(function react(api) {
					const matches = api.query({records: {basis_criteria: {where: {name: [{compare: "=", value: "alice"}]}}}})
					if (matches.records.length === 1) {
						api.log("ok")
					}
				})`),
				O{"fields": O{"name": "alice"}},
			},
			wantLogs: []any{O{"log": []any{O{"args": []any{"ok"}}}}},
		},
		{
			name: "simple reaction write",
			write: []any{
				reaction("/myreaction", `(function react(api) {
					api.write([{fields: {foo:"bar"}}])
				})`),
			},
			query:       JSON(`{"basis_criteria": {"where": {"foo": [{"compare": "=", "value": "bar"}]}}}`),
			wantResults: JSON(`[{"foo": "bar"}]`),
		},
		{
			name: "query should only include preceding events",
			write: []any{
				O{"fields": O{"fruit": "apple", "color": "red"}},
				O{"fields": O{"fruit": "banana", "color": "yellow"}},
				reaction("/myreaction", `(function react(api) {
					api.log("started")
					const matches1 = api.query({records: {basis_criteria: {where: {fruit: [{compare: "=", value: "banana"}]}}}})
					api.log("saw matches1", matches1.records.map(r => r.fields.color))
				})`),
				O{"fields": O{"fruit": "banana", "color": "green"}},
			},
			wantLogs: List{
				O{"log": []any{
					O{"args": []any{"started"}},
					O{"args": []any{"saw matches1", `yellow`}},
				}},
			},
		},
		{
			name: "await should retrigger",
			write: []any{
				O{"fields": O{"fruit": "apple", "color": "red"}},
				O{"fields": O{"fruit": "banana", "color": "yellow"}},
				reaction("/myreaction", `(function react(api) {
					api.log("started")
					const matches1 = api.query({records: {basis_criteria: {where: {fruit: [{compare: "=", value: "banana"}]}}}})
					api.log("saw matches1", matches1.records.map(r => r.fields.color))
					const after = api.origin(matches1).time
					const matches2 = api.query({records: {basis_criteria: {where: {fruit: [{compare: "=", value: "banana"}]}}}}, {after})
					api.log("saw matches2", matches2.records.map(r => r.fields.color))
				})`),
				O{"fields": O{"fruit": "banana", "color": "green"}},
			},
			wantLogs: List{
				O{"log": []any{
					O{"args": []any{"started"}},
					O{"args": []any{"saw matches1", `yellow`}},
				}},
				O{"log": []any{
					O{"args": []any{"saw matches2", `green`}},
				}},
			},
		},

		// todo confirm we get triggered via .resume.query
		// todo confirm we get triggered via .resume.alarm
		// todo confirm we get do not get triggered via .resume when disabled
		// todo confirm we get do not get triggered via .resume when aborted

		// todo confirm we get triggered via when query (use .when)
		// todo confirm we get triggered via when alarm
		// todo confirm we get do not get triggered via .when when disabled
		// todo confirm we get do not get triggered via .when when aborted

	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			c := NewClient(t)

			// stepName := fmt.Sprintf("step %d", i+1)
			// if step.desc != "" {
			// 	stepName = fmt.Sprintf("%s: %s", stepName, step.desc)
			// }

			// Run each step as its own subtest for better isolation and logging.
			// t.Run(stepName, func(t *testing.T) {
			// 	c := c.NewClient(t)

			if tc.write != nil {
				c.Write(tc.write...)
			}

			if tc.wantLogs != nil {
				mustLog(c, tc.wantLogs...)
			}

			if tc.query != nil {
				mustQuery[[]O](c, "expected %#v, got %#v", tc.wantResults, tc.query)
			}
		})
	}
}
