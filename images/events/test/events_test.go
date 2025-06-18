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
	"strings"
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

func NewServer(t *testing.T, name string) string {
	h := InitEvents(t.Name()+"_"+name, t.TempDir())
	srv := httptest.NewServer(h)
	t.Cleanup(srv.Close)
	return srv.URL
}

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
				evt db.Ready[db.Txer],
				t *struct{}) {
				err := store.CreateTables(ctx, evt.Ready)
				if err != nil {
					panic(err)
				}
			}),

		&store.ExternalDataStore{
			BaseDir: dir + "/data",
		},
		&store.IncrementingIDSource{},
		&store.Writer{},
		&store.Streamer{},
		&store.Querier{},
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
		units.QueryEventsCommand.Clone(),
		&units.EventStreamHandler{},
	)
}

func as[Out any](t *testing.T, o any) Out {
	t.Helper()

	out, err := commands.As[Out](o)
	if err != nil {
		t.Fatalf("error converting to %T: %s", out, err)
	}
	return out
}

func callURL[Out, In any](t *testing.T, env commands.Env, url, command string, params In) *Out {
	t.Helper()

	out, err := commands.CallURL[Out, In](context.Background(), env, url, command, params)
	if err != nil {
		t.Fatalf("error calling command: %v", err)
	}
	// t.Logf("url=%s command=%s params=%#v response: %#v", url, command, params, out)
	return out
}

type testClient struct {
	T   *testing.T
	url string
	Env commands.Env
}

func NewClient(t *testing.T) *testClient {
	name := strings.ReplaceAll(
		strings.ReplaceAll(t.Name(), "#", "_"),
		"/", "_")
	url := NewServer(t, name)
	return NewClientForURL(t, url)
}

func NewClientForURL(t *testing.T, url string) *testClient {
	t.Helper()

	client := &testClient{url: url}
	Assemble(&service.Service{}, t, client)
	return client
}

func (c *testClient) NewClient(t *testing.T) *testClient {
	client := &testClient{url: c.url}
	Assemble(&service.Service{}, t, client)
	return client
}

func (c *testClient) Write(events ...any) {
	c.T.Helper()
	callURL[units.WriteEventsReturns](c.T, c.Env, c.url, "events:write",
		commands.Fields{"events": events})
}

func (c *testClient) Query(queryFields commands.Fields) *units.QueryEventsReturns {
	c.T.Helper()
	return callURL[units.QueryEventsReturns](c.T, c.Env, c.url, "events:query",
		commands.Fields{"query": queryFields})
}

func must1[A any](t *testing.T, failFmt string, f func(a A) bool, a A, moreArgs ...any) {
	t.Helper()

	if f(a) {
		return
	}
	args := append([]any{a}, moreArgs...)
	t.Logf(failFmt, args...)
	t.FailNow()
}

func must2[A, B any](t *testing.T, failFmt string, f func(a A, b B) bool, a A, b B, moreArgs ...any) {
	t.Helper()

	if f(a, b) {
		return
	}
	args := append([]any{a, b}, moreArgs...)
	t.Logf(failFmt, args...)
	t.FailNow()
}

func mustEq[T any](t *testing.T, failFmt string, a any, b any, moreArgs ...any) {
	t.Helper()

	must2(t, failFmt, reflect.DeepEqual,
		any(as[T](t, a)),
		any(as[T](t, b)),
		moreArgs...,
	)
}

func mustQuery[T any](c *testClient, failFmt string, a any, query any, moreArgs ...any) {
	c.T.Helper()

	q := as[commands.Fields](c.T, query)

	c.T.Logf("mustQuery query=%s", query)
	b := c.Query(q)

	var results []json.RawMessage
	for _, evt := range b.Events {
		results = append(results, evt.Payload)
		c.T.Logf("mustQuery result=%s", string(evt.Payload))
	}

	mustEq[T](c.T, failFmt, a, results, moreArgs...)
}
