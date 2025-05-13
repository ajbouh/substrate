package events_test

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/images/events/store"
	"github.com/ajbouh/substrate/images/events/units"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/engine/daemon"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
	"github.com/ajbouh/substrate/pkg/toolkit/sqliteuri"
)

// Run assembles units and starts the program.
func InitHandler(units ...engine.Unit) http.Handler {
	asm := Assemble(units...)

	var h []http.Handler

	for i := len(asm.Units()) - 1; i >= 0; i-- {
		u := asm.Units()[i]
		r, ok := u.(*httpframework.Framework)
		if ok {
			h = append(h, r)
		}
	}

	if len(h) != 1 {
		panic(fmt.Errorf("expected 1 http.Handler, got %d", len(h)))
	}
	return h[0]
}

func Assemble(units ...engine.Unit) *engine.Assembly {
	asm, err := engine.New(units...)
	if err != nil {
		log.Fatal(err)
	}

	// add assembly
	if err := asm.Add(asm); err != nil {
		panic(err)
	}

	// add daemon framework
	d := &daemon.Framework{}
	if err := asm.Add(d); err != nil {
		panic(err)
	}

	// // add cli framework
	// c := &cli.Framework{}
	// if err := asm.Add(c); err != nil {
	// 	panic(err)
	// }

	// add logger
	if err := asm.Add(slog.Default()); err != nil {
		panic(err)
	}

	// re-assemble
	asm, err = engine.Assemble(asm.Units()...)
	if err != nil {
		panic(err)
	}

	for i := len(asm.Units()) - 1; i >= 0; i-- {
		u := asm.Units()[i]
		r, ok := u.(daemon.Initializer)
		if ok {
			if err := r.InitializeDaemon(); err != nil {
				panic(err)
			}
		}
	}

	return asm
}

var eventJSON = `{
	"events": [
	  {
		"fields": {
		  "path": "/bridge/audio-events/tracks/01JRV5CMG8VAV4QFRDSKE376GY/audio",
		  "ts": [
			987471346,
			987472306,
			987473266,
			987474226,
			987475186,
			987476146,
			987477106,
			987478066,
			987479026,
			987479986,
			987480946
		  ],
		  "ix": [
			0,
			85,
			167,
			257,
			343,
			424,
			512,
			601,
			693,
			784,
			886
		  ],
		  "sz": [
			85,
			82,
			90,
			86,
			81,
			88,
			89,
			92,
			91,
			102,
			101
		  ],
		  "encoding": {
			"mime_type": "audio/opus",
			"sample_rate": 48000,
			"channels": 2
		  },
		  "track": "01JRV5CMG8VAV4QFRDSKE376GY"
		},
		"data": "kG8TgDrbnfIOYtCzvt4AAREAywB4JxibjeOT+ioAyW/buUBOp5WUgYx5/3T8usJUQeNtKEnEKlloc2cppN/eu4Iah4XDf5bbs41zFrIeQncdTn26nJBvE4E626GyDmLQs77eAAERAMwAeCGjoNMK3j0szHzyDEo9ZfJUtY4Au5vj6t9j/6evAey5Nsg1NzEv2hNp8TtKDmqb+IDe4S3ATBlzvdDARa2QbxOCOtulcg5i0LO+3gABEQDNAHgertYuIcwCihPG5+n5bFrfnYq7qks9OIavVJ/5kklRqJ0VT+aBgd5RXYkfZfWKNcLOH2TCODaHY6JuxjCJP2uART6FHJ6QbxODOtupMg5i0LO+3gABEQDOAHgersmRrMMAw8y9/aHQ2T4Ft+PTSy0/1NSKDSCznXz/aZJp0lznDdaA7pxRY/azhI9CBcXeJXwJZqx7q6EBduPLrpBvE4Q626zyDmLQs77eAAERAM8AeB6tA8QmoOqQdBJEbGK4rAqYSvHzrzZswC7CMzXtEihkoWC+b/eWw31X1Uc7/i+SFDMXK6M7qDIS01uWW5BvE4U627CyDmLQs77eAAERANAAeAKw0u1YycPO4vSHozAXmgOsKdxT3xeXsnsghd/4P3VVV1U1yp89M8Lb+PCXOw3n9zOAYKnFgovT1NsNMm04ACquJ5+QbxOGOtu0cg5i0LO+3gABEQDRAHgbfQEKBolrGOsTbIE1Xey18W4mtuZXYO46S2sewKdGl6FUzpzxIz+avKmfElfob0YD9xLz/O248EL6IGKbiIdXt545r5BvE4c627gyDmLQs77eAAERANIAeBuJw5rQzZpOBhtbhro+ibY/z/mqAfXdeMel9pCw6S4C9njwlu6gyMaV1XOfBHVQZoufJyiOQrkfvrENsXPha4A1UwrsPpiukG8TiDrbu/IOYtCzvt4AAREA0wB4G4oTGuLs4dotSvn1PmzW+OtbwIhG1UOe1s+u0EEW+k7feLm166hSkdW+kHH7RlOSrA97QoB+Gj+d0AiFJxr9EYK+Obvm7ZBvE4k627+yDmLQs77eAAERANQAeIBUDyh/phx5P5gEsy5CXtxsoveC9Ln2CyIiWAVo8ynQ8E8C/dCl7eNSoPPtVceds59GlScH8AKlelXhB8SUjrtNMertL/BWYUxvM16KsFPfr5BvE4o628NyDmLQs77eAAERANUAeIQAIYGHyOkjg/t8v5AIG8WiAacV3ZsO6W9nFrOEzlpJGdbS4MLN/4wt1bQZ1CdjFMwvXX2MnwIlbhlbSKNrgj5eKxAfk6QEABZ8sUlC1b5t",
		"encoding": "base64",
		"vector": null,
		"conflict_keys": null
	  }
	]
  }`

func InitEvents(name, dir string) http.Handler {
	return InitHandler(
		&service.Service{},

		&sqliteuri.URI{
			FileName: dir + "/db.sqlite",
			URIOptions: sqliteuri.URIOptions{
				JournalMode: sqliteuri.JournalModeWAL,
			},
		},
		&sqliteuri.Opener{
			Driver: "sqlite_custom_" + name,
		},
		&db.MultiReaderDB{},
		&db.SingleWriterDB{},
		notify.On(
			func(ctx context.Context,
				evt db.Initialized[db.Txer],
				t *struct{}) {
				err := store.CreateTables(ctx, evt.Initialized)
				if err != nil {
					panic(err)
				}
			}),

		&store.ExternalDataStore{
			BaseDir: dir + "/data",
		},
		&store.EventStore{},
		&store.VectorManifoldStore{},
		&units.EventURLs{
			URLForEvent: func(ctx context.Context, eventID event.ID) string {
				return httpframework.ContextPrefix(ctx) + "/events/" + eventID.String()
			},
		},
		&units.SelfLinks{},

		units.ExportEventsCommand.Clone(),
		units.ImportEventsCommand.Clone(),

		units.WriteTreeFieldsPathCommand.Clone(),
		units.GetTreeFieldsPathCommand.Clone(),

		units.WriteTreeDataPathCommand.Clone(),
		units.GetTreeDataPathCommand.Clone(),

		units.GetTreeRawPathCommand.Clone(),

		units.GetEventCommand.Clone(),
		units.GetEventDataCommand.Clone(),
		units.IDLinksQueryCommand.Clone(),
		units.EventPathLinksQueryCommand.Clone(),

		units.WriteEventsCommand.Clone(),
		units.TryReactionCommand.Clone(),
		units.QueryEventsCommand.Clone(),
		&units.EventStreamHandler{},
	)
}

func as[Out any](t *testing.T, o any) Out {
	out, err := commands.As[Out](o)
	if err != nil {
		t.Fatalf("error converting to %T: %s", out, err)
	}
	return out
}

func callURL[Out, In any](t *testing.T, env commands.Env, url, command string, params In) *Out {
	out, err := commands.CallURL[Out, In](context.Background(), env, url, command, params)
	if err != nil {
		t.Fatalf("error calling command: %v", err)
	}
	t.Logf("url=%s command=%s params=%#v response: %#v", url, command, params, out)
	return out
}

func TestCallEvent(t *testing.T) {
	h := InitEvents(t.Name(), t.TempDir())
	srv := httptest.NewServer(h)
	defer srv.Close()

	client := &struct {
		Env commands.Env
	}{}
	Assemble(&service.Service{}, client)
	env := client.Env

	var input commands.Fields
	err := json.Unmarshal([]byte(eventJSON), &input)
	if err != nil {
		t.Fatalf("error unmarshalling input: %v", err)
	}

	response := callURL[units.WriteEventsReturns](t, env, srv.URL, "events:write", input)
	t.Logf("Response: %#v", response)
}

func must1[A any](t *testing.T, failFmt string, f func(a A) bool, a A) {
	if f(a) {
		return
	}
	t.Logf(failFmt, a)
	t.FailNow()
}

func must2[A, B any](t *testing.T, failFmt string, f func(a A, b B) bool, a A, b B) {
	if f(a, b) {
		return
	}
	t.Logf(failFmt, a, b)
	t.FailNow()
}

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
			"query":  F{"basis_criteria": F{"where": F{"name": []any{F{"compare": "=", "value": "alice"}}}}}},
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
