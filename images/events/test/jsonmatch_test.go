package events_test

import (
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/ajbouh/substrate/images/events/units"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

func TestJSONMatchQuery(t *testing.T) {
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
		F{"events": []any{F{"fields": F{"name": "alice", "pizza": F{"size": "large"}}}}})

	results := callURL[units.QueryEventsReturns](t, env, srv1.URL, "events:query",
		F{"query": F{"view_criteria": F{"where": F{"pizza": []any{F{"compare": "in", "value": []any{F{"size": "large"}}}}}}}})

	must2(t, "should be one match; expected %#v, got %#v",
		reflect.DeepEqual,
		any(1),
		any(len(results.Events)))

	must2(t, "first event should be present; expected %#v, got %#v",
		reflect.DeepEqual,
		any(F{"name": "alice", "pizza": map[string]any{"size": "large"}}),
		any(as[F](t, results.Events[0].Payload)))
}
