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

func TestTransit(t *testing.T) {
	h1 := InitEvents(t.Name()+"_h1", t.TempDir())
	srv1 := httptest.NewServer(h1)
	defer srv1.Close()

	h2 := InitEvents(t.Name()+"_h2", t.TempDir())
	srv2 := httptest.NewServer(h2)
	defer srv2.Close()

	client := &struct {
		Env commands.Env
	}{}
	Assemble(&service.Service{}, client)
	env := client.Env

	type F = commands.Fields
	callURL[units.WriteEventsReturns](t, env, srv1.URL, "events:write",
		F{"events": []any{F{"fields": F{"name": "alice"}}}})

	must2(t, "first event should be present; expected %#v, got %#v",
		reflect.DeepEqual,
		any(F{"name": "alice"}),
		any(as[F](t,
			callURL[units.QueryEventsReturns](t, env, srv1.URL, "events:query",
				F{"query": F{"basis_criteria": F{"where": F{"name": []any{F{"compare": "=", "value": "alice"}}}}}}).Events[0].Payload)))

	exportResponse := callURL[units.ExportEventsReturns](t, env, srv1.URL, "events:export",
		F{
			"accept": "application/json",
			"query":  `{"basis_criteria": {"where": {"name": [{"compare": "=", "value": "alice"}]}}}`},
	)
	must1(t, "export should be present; expected %#v > 0",
		func(len int) bool { return len > 0 },
		len(exportResponse.Export),
	)

	must1(t, "no events should be present; expected no events, got %#v",
		func(events []event.Event) bool { return len(events) == 0 },
		callURL[units.QueryEventsReturns](t, env, srv2.URL, "events:query",
			F{"query": F{"basis_criteria": F{"where": F{"name": []any{F{"compare": "=", "value": "alice"}}}}}}).Events)

	importResponse := callURL[units.ImportEventsReturns](t, env, srv2.URL, "events:import",
		F{"import": exportResponse.Export})
	_ = importResponse

	must2(t, "first event should be present; expected %#v, got %#v",
		reflect.DeepEqual,
		any(F{"name": "alice"}),
		any(as[F](t,
			callURL[units.QueryEventsReturns](t, env, srv2.URL, "events:query",
				F{"query": F{"basis_criteria": F{"where": F{"name": []any{F{"compare": "=", "value": "alice"}}}}}}).Events[0].Payload)))
}

func TestTransitWithFields(t *testing.T) {
	h1 := InitEvents(t.Name()+"_h1", t.TempDir())
	srv1 := httptest.NewServer(h1)
	defer srv1.Close()

	h2 := InitEvents(t.Name()+"_h2", t.TempDir())
	srv2 := httptest.NewServer(h2)
	defer srv2.Close()

	client := &struct {
		Env commands.Env
	}{}
	Assemble(&service.Service{}, client)
	env := client.Env

	type F = commands.Fields
	callURL[units.WriteEventsReturns](t, env, srv1.URL, "events:write",
		F{"events": []any{F{"fields": F{"name": "alice"}}}})

	must2(t, "first event should be present; expected %#v, got %#v",
		reflect.DeepEqual,
		any(F{"name": "alice"}),
		any(as[F](t,
			callURL[units.QueryEventsReturns](t, env, srv1.URL, "events:query",
				F{"query": F{"basis_criteria": F{"where": F{"name": []any{F{"compare": "=", "value": "alice"}}}}}}).Events[0].Payload)))

	exportResponse := callURL[units.ExportEventsReturns](t, env, srv1.URL, "events:export",
		F{
			"accept": "application/json",
			"query":  `{"basis_criteria": {"where": {"name": [{"compare": "=", "value": "alice"}]}}}`},
	)
	must1(t, "export should be present; expected %#v > 0",
		func(len int) bool { return len > 0 },
		len(exportResponse.Export),
	)

	must1(t, "no events should be present; expected no events, got %#v",
		func(events []event.Event) bool { return len(events) == 0 },
		callURL[units.QueryEventsReturns](t, env, srv2.URL, "events:query",
			F{"query": F{"basis_criteria": F{"where": F{"name": []any{F{"compare": "=", "value": "alice"}}}}}}).Events)

	importResponse := callURL[units.ImportEventsReturns](t, env, srv2.URL, "events:import",
		F{
			"import": exportResponse.Export,
			"fields": `{"lunch": "pizza"}`,
		})
	_ = importResponse

	must2(t, "first event should be present; expected %#v, got %#v",
		reflect.DeepEqual,
		any(F{"lunch": "pizza", "name": "alice"}),
		any(as[F](t,
			callURL[units.QueryEventsReturns](t, env, srv2.URL, "events:query",
				F{"query": F{"basis_criteria": F{"where": F{"name": []any{F{"compare": "=", "value": "alice"}}}}}}).Events[0].Payload)))
}
