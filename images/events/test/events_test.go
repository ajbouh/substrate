package events_test

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"
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

func must1[A any](t *testing.T, failFmt string, f func(a A) bool, a A, moreArgs ...any) {
	if f(a) {
		return
	}
	args := append([]any{a}, moreArgs...)
	t.Logf(failFmt, args...)
	t.FailNow()
}

func must2[A, B any](t *testing.T, failFmt string, f func(a A, b B) bool, a A, b B, moreArgs ...any) {
	if f(a, b) {
		return
	}
	args := append([]any{a, b}, moreArgs...)
	t.Logf(failFmt, args...)
	t.FailNow()
}
