package events_test

import (
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/ajbouh/substrate/images/events/units"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

func TestPathQuery(t *testing.T) {
	h1 := InitEvents(t.Name()+"_h1", t.TempDir())
	srv1 := httptest.NewServer(h1)
	defer srv1.Close()

	client := &struct {
		Env commands.Env
	}{}
	Assemble(&service.Service{}, client)
	env := client.Env

	type F = commands.Fields
	pathQuery := F{
		"view":  "group-by-path-max-id",
		"query": F{"basis_criteria": F{"where": F{"path": []any{F{"compare": "like", "value": "/%"}}}}},
	}

	latestFieldsWithPath := func() ([]F, []event.Event) {
		evts := callURL[units.QueryEventsReturns](t, env, srv1.URL, "events:query", pathQuery).Events
		return mapSlice(
			evts,
			func(e event.Event) F {
				return as[F](t, e.Payload)
			}), evts
	}

	records, raw := latestFieldsWithPath()
	must2(t, "should start empty; expected %#v, got %#v; raw=%#v",
		reflect.DeepEqual,
		any([]F{}),
		any(records),
		raw)

	callURL[units.WriteEventsReturns](t, env, srv1.URL, "events:write",
		F{"events": []any{F{"fields": F{"path": "/greeting"}, "data": "hello"}}})

	records, raw = latestFieldsWithPath()
	must2(t, "should include first write; expected %#v, got %#v; raw=%#v",
		reflect.DeepEqual,
		any([]F{F{"path": "/greeting"}}),
		any(records),
		raw)

	must2(t, "first event should be present; expected %#v, got %#v",
		reflect.DeepEqual,
		any(F{"path": "/greeting"}),
		any(as[F](t,
			callURL[units.QueryEventsReturns](t, env, srv1.URL, "events:query", pathQuery).Events[0].Payload)))

	callURL[units.WriteEventsReturns](t, env, srv1.URL, "events:write",
		F{"events": []any{
			F{"fields": F{"path": "/greeting", "deleted": true}},
			F{"fields": F{"path": "/lunch"}, "data": "pizza"},
		}})

	records, raw = latestFieldsWithPath()
	must2(t, "deleted paths should be ignored; expected %#v, got %#v; raw=%#v",
		reflect.DeepEqual,
		any([]F{F{"path": "/lunch"}}),
		any(records),
		raw)
}

func mapSlice[A, B any](in []A, f func(a A) B) []B {
	out := make([]B, 0, len(in))
	for _, a := range in {
		out = append(out, f(a))
	}
	return out
}
