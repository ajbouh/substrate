package reactionrun_test

import "testing"

func TestAPIQueryAsync(t *testing.T) {
	testCases := []testCase{
		{
			name: "async alarms in present and in the future",
			source: `(async function(api) {
				api.log("before noop alarm");
				await api.query({}, {alarm: 0})
				api.log("before future alarm");
				await api.query({}, {alarm: 1})
				api.log("after future alarm");
			})`,
			wantUpdates: Map{
				"reaction.resume.journal.entries": List{
					Map{
						"alg":  "HighwayHash",
						"cs":   "64a6bfe12112075ebacb7c40429985eb59f7d141a9a22f346afb6432dcf9b37f",
						"now":  "00000000000000000000000000",
						"op":   "query",
						"this": "00000000000000000000000000",
					},
				},
				"reaction.resume.alarm": 1,
			},
			wantReceipt: Map{
				"log": List{
					Map{"args": List{"before noop alarm"}},
					Map{"args": List{"before future alarm"}},
				},
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}

}

func TestAPIQuery(t *testing.T) {
	testCases := []testCase{
		{
			name:   "no arg",
			source: `(function(api) { api.query() })`,
			wantUpdates: Map{
				"reaction.disabled": true,
			},
			wantReceipt: Map{
				"error": Map{
					"message": "query requires an argument",
				},
			},
		},
		{
			name:   "bad arg",
			source: `(function(api) { api.query(1) })`,
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
			source: `(function(api) { api.log(JSON.stringify(api.query({}))) })`,
			wantUpdates: Map{
				"reaction.resume.journal.entries": nil,
			},
		},
		{
			name:   "alarm now",
			source: `(function(api) { api.log(JSON.stringify(api.query({}, {alarm: 0}))) })`,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{"{}"}},
				},
			},
		},
		{
			name:   "alarm in the past",
			source: `(function(api) { api.log(JSON.stringify(api.query({}, {alarm: -1}))) })`,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{"{}"}},
				},
			},
		},
		{
			name:   "alarm in the future",
			source: `(function(api) { api.log(JSON.stringify(api.query({}, {alarm: 1}))) })`,
			wantUpdates: Map{
				"reaction.resume.journal.entries": nil,
				"reaction.resume.alarm":           1,
			},
		},
		{
			name: "alarm now and query",
			source: `(function(api) {
				api.log(JSON.stringify(api.query({
					foods: {basis_criteria: {where: {food: [{compare: "=", value: "pizza"}]}}},
				}, {
					alarm: 0,
				})))
			})`,
			wantReceipt: Map{
				"log": List{
					Map{"args": List{`{"foods":null}`}},
				},
			},
		},
		{
			name: "alarm in the future and query",
			source: `(function(api) {
				api.query({
					foods: {basis_criteria: {where: {food: [{compare: "=", value: "pizza"}]}}},
				}, {
					alarm: 1,
				})
			})`,
			wantUpdates: Map{
				"reaction.resume.journal.entries": nil,
				"reaction.resume.alarm":           1,
				"reaction.resume.after":           "00000000000000000000000000",
				"reaction.resume.query": Map{
					"foods": Map{
						"basis_criteria": Map{"where": Map{"food": []any{Map{"compare": string("="), "value": string("pizza")}}}},
						"view_criteria":  Map{},
					},
				},
			},
		},
		{
			name: "blocking query",
			source: `(function(api) {
				api.query({
					foods: {basis_criteria: {where: {food: [{compare: "=", value: "pizza"}]}}},
				})
			})`,
			wantUpdates: Map{
				"reaction.resume.journal.entries": nil,
				"reaction.resume.after":           "00000000000000000000000000",
				"reaction.resume.query": Map{
					"foods": Map{
						"basis_criteria": Map{"where": Map{"food": []any{Map{"compare": string("="), "value": string("pizza")}}}},
						"view_criteria":  Map{},
					},
				},
			},
		},
		{
			name: "alarms in present and in the future",
			source: `(function(api) {
				api.log("before noop alarm");
				api.query({}, {alarm: 0})
				api.log("before future alarm");
				api.query({}, {alarm: 1})
				api.log("after future alarm");
			})`,
			wantUpdates: Map{
				"reaction.resume.journal.entries": List{
					Map{
						"alg":  "HighwayHash",
						"cs":   "64a6bfe12112075ebacb7c40429985eb59f7d141a9a22f346afb6432dcf9b37f",
						"now":  "00000000000000000000000000",
						"op":   "query",
						"this": "00000000000000000000000000",
					},
				},
				"reaction.resume.alarm": 1,
			},
			wantReceipt: Map{
				"log": List{
					Map{"args": List{"before noop alarm"}},
					Map{"args": List{"before future alarm"}},
				},
			},
		},
		{
			name: "alarms in present and in the future with try-catch and infinite loop",
			source: `(function(api) {
				api.log("before noop alarm");
				api.query({}, {alarm: 0})
				api.log("before future alarm");
				try {
					api.query({}, {alarm: 1})
				} catch (e) {
					while(true);
				}
				api.log("after future alarm");
			})`,
			wantUpdates: Map{
				"reaction.resume.journal.entries": List{
					Map{
						"alg":  "HighwayHash",
						"cs":   "64a6bfe12112075ebacb7c40429985eb59f7d141a9a22f346afb6432dcf9b37f",
						"now":  "00000000000000000000000000",
						"op":   "query",
						"this": "00000000000000000000000000",
					},
				},
				"reaction.resume.alarm": 1,
			},
			wantReceipt: Map{

				"log": List{
					Map{"args": List{"before noop alarm"}},
					Map{"args": List{"before future alarm"}},
				},
			},
		},
		{
			name: "cannot log after try-catch alarm",
			source: `(function(api) {
				api.log("before noop alarm");
				api.query({}, {alarm: 0})
				api.log("before future alarm");
				try {
					api.query({}, {alarm: 1})
				} catch (e) {}
				api.log("after future alarm");
			})`,
			wantUpdates: Map{
				"reaction.resume.journal.entries": List{
					Map{
						"alg":  "HighwayHash",
						"cs":   "64a6bfe12112075ebacb7c40429985eb59f7d141a9a22f346afb6432dcf9b37f",
						"now":  "00000000000000000000000000",
						"op":   "query",
						"this": "00000000000000000000000000",
					},
				},
				"reaction.resume.alarm": 1,
			},
			wantReceipt: Map{
				"log": List{
					Map{"args": List{"before noop alarm"}},
					Map{"args": List{"before future alarm"}},
				},
			},
		},
		{
			name: "cannot log in try-catch alarm",
			source: `(function(api) {
				api.log("before noop alarm");
				api.query({}, {alarm: 0})
				api.log("before future alarm");
				try {
					api.query({}, {alarm: 1})
				} catch (e) {
					api.log("never");
				}
			})`,
			wantUpdates: Map{
				"reaction.resume.journal.entries": List{
					Map{
						"alg":  "HighwayHash",
						"cs":   "64a6bfe12112075ebacb7c40429985eb59f7d141a9a22f346afb6432dcf9b37f",
						"now":  "00000000000000000000000000",
						"op":   "query",
						"this": "00000000000000000000000000",
					},
				},
				"reaction.resume.alarm": 1,
			},
			wantReceipt: Map{
				"log": List{
					Map{"args": List{"before noop alarm"}},
					Map{"args": List{"before future alarm"}},
				},
			},
		},
		{
			name: "can modify this before alarms",
			source: `(function(api) {
				api.log("before noop alarm");
				this.beforenoopalarm = true
				api.query({}, {alarm: 0})
				this.beforefuturealarm = true
				api.log("before future alarm");
				try {
					api.query({}, {alarm: 1})
				} catch (e) {
					this.afterfuturealarm = true
				}
			})`,
			wantUpdates: Map{
				"reaction.resume.journal.entries": List{
					Map{
						"alg":  "HighwayHash",
						"cs":   "64a6bfe12112075ebacb7c40429985eb59f7d141a9a22f346afb6432dcf9b37f",
						"now":  "00000000000000000000000000",
						"op":   "query",
						"this": "00000000000000000000000000",
					},
				},
				"reaction.resume.alarm": 1,
			},
			wantReceipt: Map{
				"this.beforenoopalarm":   true,
				"this.beforefuturealarm": true,
				"log": List{
					Map{"args": List{"before noop alarm"}},
					Map{"args": List{"before future alarm"}},
				},
			},
		},
		{
			name: "cannot modify this after try-catch alarm",
			source: `(function(api) {
				api.log("before noop alarm");
				api.query({}, {alarm: 0})
				api.log("before future alarm");
				this.goingtotry = 1
				try {
					api.query({}, {alarm: 1})
				} catch (e) {
					this.caughtyou = 2
				}
			})`,
			wantUpdates: Map{
				"reaction.resume.journal.entries": List{
					Map{
						"alg":  "HighwayHash",
						"cs":   "64a6bfe12112075ebacb7c40429985eb59f7d141a9a22f346afb6432dcf9b37f",
						"now":  "00000000000000000000000000",
						"op":   "query",
						"this": "00000000000000000000000000",
					},
				},
				"reaction.resume.alarm": 1,
			},
			wantReceipt: Map{
				"this.goingtotry": 1,
				"log": List{
					Map{"args": List{"before noop alarm"}},
					Map{"args": List{"before future alarm"}},
				},
			},
		},
		{
			name: "cannot modify this after try-finally alarm",
			source: `(function(api) {
				api.log("before noop alarm");
				api.query({}, {alarm: 0})
				api.log("before future alarm");
				this.goingtotry = 1
				try {
					api.query({}, {alarm: 1})
				} finally {
					this.caughtyou = 2
				}
			})`,
			wantUpdates: Map{
				"reaction.resume.journal.entries": List{
					Map{
						"alg":  "HighwayHash",
						"cs":   "64a6bfe12112075ebacb7c40429985eb59f7d141a9a22f346afb6432dcf9b37f",
						"now":  "00000000000000000000000000",
						"op":   "query",
						"this": "00000000000000000000000000",
					},
				},
				"reaction.resume.alarm": 1,
			},
			wantReceipt: Map{
				"this.goingtotry": 1,
				"log": List{
					Map{"args": List{"before noop alarm"}},
					Map{"args": List{"before future alarm"}},
				},
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, tc.Run)
	}
}
