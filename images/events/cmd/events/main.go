package main

import (
	"context"
	"log"
	"log/slog"
	"os"
	"path"
	"time"

	sqlite_vec "github.com/asg017/sqlite-vec-go-bindings/cgo"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/images/events/store"
	"github.com/ajbouh/substrate/images/events/tick"
	"github.com/ajbouh/substrate/images/events/units"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/event"

	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
	"github.com/ajbouh/substrate/pkg/toolkit/sqliteuri"
)

func main() {
	// TODO move this somewhere else.
	sqlite_vec.Auto()

	sqlDBFile := os.Getenv("EVENTS_DATABASE_FILE")

	err := os.MkdirAll(path.Dir(sqlDBFile), 0o755)
	if err != nil {
		slog.Error("couldn't create database", "err", err)
		log.Fatal()
	}

	engine.Run(
		&service.Service{
			ExportsRoute: "/{$}",
		},

		&sqliteuri.URI{
			FileName: sqlDBFile,
			URIOptions: sqliteuri.URIOptions{
				JournalMode: sqliteuri.JournalModeWAL,
			},
		},
		&sqliteuri.Opener{
			Driver: "sqlite_custom",
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
			BaseDir: os.Getenv("EVENTS_DATA_BASE_DIR"),
		},
		&store.EventStore{},
		&store.VectorManifoldStore{},
		&units.EventURLs{
			URLForEvent: func(ctx context.Context, eventID event.ID) string {
				return httpframework.ContextPrefix(ctx) + "/events/" + eventID.String()
			},
		},
		&units.SelfLinks{},


		units.WriteTreeFieldsPathCommand,
		units.GetTreeFieldsPathCommand,

		units.WriteTreeDataPathCommand,
		units.GetTreeDataPathCommand,

		units.GetTreeRawPathCommand,

		units.GetEventCommand,
		units.IDLinksQueryCommand,
		units.EventPathLinksQueryCommand,

		units.WriteEventsCommand,
		units.TryReactionCommand,
		units.QueryEventsCommand,
		&units.EventStreamHandler{},
		&units.FSHandler{},

		&tick.BootstrapStrategy{},
		&tick.BootstrapInput{
			RulesPathPrefix:   "/rules/defs/",
			CursorsPathPrefix: "/rules/runs/",
		},
		&tick.BoostrapTicker{},
		&tick.BootstrapLoop{},
		&tick.CommandStrategy{
			DefaultTimeout: 60 * time.Second,
		},
	)
}
