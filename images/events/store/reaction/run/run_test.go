package reactionrun_test

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"maps"
	"reflect"
	"regexp"
	"slices"
	"strings"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/tidwall/gjson"

	reactionpkg "github.com/ajbouh/substrate/images/events/store/reaction"
	"github.com/ajbouh/substrate/images/events/store/reaction/reactiontest"
	reactionrun "github.com/ajbouh/substrate/images/events/store/reaction/run"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

var undefined = reactiontest.Undefined
var reaction = reactiontest.Reaction
var receipt = reactiontest.Receipt
var assign = reactiontest.Assign

type Map = map[string]any
type List = []any
type ID = event.ID
type JSON = json.RawMessage

type testCase struct {
	name  string
	maxID ID
	id    ID

	in     JSON
	source string

	out any

	err string

	wantUpdates      Map
	wantContinuation Map
	wantReceipt      Map
	wantError        Map
	wantWrites       []JSON

	querier func(tc testCase) reactionpkg.Querier
}

// Compare uses reflection to compare two values 'a' and 'b'.
// It requires 'a' to have a method with the signature:
// Compare(T) int
// where T is the type of 'b'.
func compare(a, b any) int {

	// strings don't implement compare.
	if sa, ok := a.(string); ok {
		return strings.Compare(sa, b.(string))
	}

	valA := reflect.ValueOf(a)
	valB := reflect.ValueOf(b)

	method := valA.MethodByName("Compare")
	if !method.IsValid() {
		panic(fmt.Sprintf("type %T does not have a Compare method", a))
	}

	// Verify the signature is exactly 'func(T) int', where T is the type of 'b'
	methodType := method.Type()
	if methodType.NumIn() != 1 || methodType.In(0) != valB.Type() || methodType.NumOut() != 1 || methodType.Out(0).Kind() != reflect.Int {
		panic(fmt.Sprintf("type %T has a Compare method, but its signature is not 'func(%T) int'", a, b))
	}

	result := method.Call([]reflect.Value{valB})
	return int(result[0].Int())
}

func eq(a, b any) bool {
	if reflect.DeepEqual(a, b) {
		return true
	}
	if reflect.DeepEqual(a, 1) { // sqlite treats 1 as true
		bBool, ok := b.(bool)
		return ok && bBool
	}
	return false
}

func like(p *regexp.Regexp, v any) bool {
	s, ok := v.(string)
	if !ok {
		return false
	}
	return p.MatchString(s)
}

// likeToRegexp takes a string pattern used in a SQLite LIKE clause
// and converts it into an equivalent Go regular expression pattern.
// It handles the '%' and '_' wildcards and escapes all other special
// regexp metacharacters.
func likeToRegexp(likePattern string) string {
	var builder strings.Builder
	// The pattern is anchored to match the entire string, mimicking LIKE behavior.
	builder.WriteRune('^')

	for _, char := range likePattern {
		switch char {
		case '%':
			// SQLite's '%' matches any sequence of zero or more characters.
			builder.WriteString(".*")
		case '_':
			// SQLite's '_' matches any single character.
			builder.WriteRune('.')
		case '\\', '^', '$', '.', '|', '?', '*', '+', '(', ')', '[', ']', '{', '}':
			// These are special characters in Go's regexp engine.
			// They must be escaped with a backslash to be treated as literals.
			builder.WriteRune('\\')
			builder.WriteRune(char)
		default:
			// Any other character is treated as a literal.
			builder.WriteRune(char)
		}
	}

	// Close the anchor.
	builder.WriteRune('$')
	return builder.String()
}

// returns true if v is in s. should work for all basic types
func in(s []any, v any) bool {
	for _, item := range s {
		if reflect.DeepEqual(item, v) {
			return true
		}
	}
	return false
}

func whereMatches(w event.WhereCompare, v any) bool {
	switch w.Compare {
	case "like":
		pattern := regexp.MustCompilePOSIX(likeToRegexp(w.Value.(string)))
		return like(pattern, v)
	case "in":
		return in(w.Value.([]any), v)
	case "is not":
		return !eq(w.Value, v)
	case ">":
		return compare(v, w.Value) > 0
	case ">=":
		return compare(v, w.Value) >= 0
	case "<":
		return compare(v, w.Value) < 0
	case "<=":
		return compare(v, w.Value) <= 0
	case "=":
		return eq(w.Value, v)
	}
	panic(fmt.Errorf("unhandled where compare %s in %#v for %#v", w.Compare, w, v))
}

func criteriaMatches(c event.Criteria, id event.ID, fields []byte) bool {
	slog.Info("criteriaMatches", "c", c, "id", id, "fields", string(fields))
	for k, ws := range c.WhereCompare {
		var v any
		if k == "id" {
			v = id.String()
		} else {
			v = gjson.GetBytes(fields, k).Value()
		}
		for _, w := range ws {
			if !whereMatches(w, v) {
				slog.Info("criteriaMatches where", "k", k, "v", v, "w", w, "match", false)
				return false
			}
			slog.Info("criteriaMatches where", "k", k, "v", v, "w", w, "match", true)
		}
	}

	return true
}

func (tc *testCase) Run(t *testing.T) {
	t.Helper()

	if tc.in == nil {
		tc.in = reaction()
	}

	var querier reactionpkg.Querier
	if tc.querier != nil {
		querier = tc.querier(*tc)
	} else {
		existing := map[ID]JSON{
			tc.id: tc.in,
		}

		// this is a primitive implementation of querier
		querier = &reactiontest.Querier{
			QueryEventsFunc: func(ctx context.Context, q *event.Query) ([]event.Event, reactiontest.ID, bool, error) {
				var evts []event.Event
				for id, fields := range existing {
					if criteriaMatches(q.BasisCriteria, id, fields) &&
						criteriaMatches(q.ViewCriteria, id, fields) {
						evts = append(evts, event.Event{ID: id, Payload: fields})
					}
				}

				t.Logf("QueryEvents query #%v", *q)
				for _, evt := range evts {
					t.Logf("QueryEvents result %s %s", evt.ID, string(evt.Payload))
				}

				return evts, tc.maxID, false, nil
			},
		}
	}

	gotPending, err := reactionrun.Run(context.Background(), querier, tc.maxID, tc.id, []byte(tc.in), tc.source)

	if err != nil {
		if err.Error() != tc.err {
			t.Fatalf("Run() error message did not match expectation.\n\nGOT:  %q\nWANT: %q", err.Error(), tc.err)
		}
		return
	}

	if tc.err != "" {
		t.Fatalf("Run() expected error %q, but got nil", tc.err)
	}

	if tc.out == nil {
		tc.out = func(tc testCase) []JSON {
			wantWrites := slices.Clone(tc.wantWrites)
			wantUpdates := maps.Clone(tc.wantUpdates)
			wantReceipt := maps.Clone(tc.wantReceipt)
			wantContinuation := maps.Clone(tc.wantContinuation)

			if wantUpdates == nil {
				wantUpdates = Map{}
			}
			if wantContinuation == nil {
				wantContinuation = Map{}
			}
			if wantReceipt == nil {
				wantReceipt = Map{}
			}

			if tc.wantError != nil {
				wantUpdates["reaction.disabled"] = true
				wantReceipt["error"] = tc.wantError
			}

			this := tc.in
			if len(wantUpdates) > 0 {
				wantWrites = append(wantWrites, assign(this, wantUpdates))
			}
			if len(wantContinuation) > 0 {
				wantContinuation["type"] = "reaction-continuation"
				wantContinuation["self"] = []any{"type", "reaction-continuation.shadows.id"}
				wantContinuation["reaction-continuation.shadows.id"] = tc.id
				wantContinuation["reaction-continuation.shadows.fingerprint"] = map[string]any{"type": "reaction"}

				wantWrites = append(wantWrites, assign(JSON(`{}`), wantContinuation))
			}

			t.Logf("wantUpdates %s", string(assign(this, wantUpdates)))

			wantWrites = append(wantWrites, assign(receipt(tc.maxID, tc.id), Map{"this": this}, wantReceipt))

			return wantWrites
		}
	}

	wantJSONs, err := reactiontest.Jsonify(tc.out, *tc)
	if err != nil {
		t.Fatalf("Failed to jsonify 'out' for comparison: %v", err)
	}

	asSlice := func(role string, jsons []JSON) []any {
		var slice []any
		var all [][]byte
		for _, m := range jsons {
			all = append(all, m)
		}
		b := []byte("[" + string(bytes.Join(all, []byte(","))) + "]")
		if err := json.Unmarshal(b, &slice); err != nil {
			t.Fatalf("Failed to unmarshal '%s' for comparison: %v", role, err)
		}
		return slice
	}

	wantParsed := asSlice("want", wantJSONs)
	gotParsed := asSlice("got", gotPending.FieldsList)

	if diff := cmp.Diff(wantParsed, gotParsed); diff != "" {
		t.Errorf("Run() returned unexpected result (-want +got):\n%s", diff)
	}
}
