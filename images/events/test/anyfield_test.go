package events_test

import (
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/ajbouh/substrate/images/events/units"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

func TestAnyFieldQuery(t *testing.T) {
	h1 := InitEvents(t.Name()+"_h1", t.TempDir())
	srv1 := httptest.NewServer(h1)
	defer srv1.Close()

	client := &struct {
		Env commands.Env
	}{}
	Assemble(&service.Service{}, client)
	env := client.Env

	type F = commands.Fields
	callURL[units.WriteEventsReturns](t, env, srv1.URL, "events:write",
		F{"events": []any{F{"fields": F{"name": "alice"}}}})

	results := callURL[units.QueryEventsReturns](t, env, srv1.URL, "events:query",
		F{"query": F{"basis_criteria": F{"where": F{"": []any{F{"compare": "=", "value": "alice"}}}}}})

	must2(t, "first event should be present; expected %#v, got %#v",
		reflect.DeepEqual,
		any(F{"name": "alice"}),
		any(as[F](t, results.Events[0].Payload)))
}
