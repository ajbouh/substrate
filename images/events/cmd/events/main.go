package main

import (
	"context"
	"log"
	"log/slog"
	"os"
	"path"

	"tractor.dev/toolkit-go/engine"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/images/events/store"
	"github.com/ajbouh/substrate/images/events/units"
	"github.com/ajbouh/substrate/pkg/toolkit/event"

	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
	"github.com/ajbouh/substrate/pkg/toolkit/sqliteuri"
)

func main() {
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
		db.MultiReaderDB{},
		db.SingleWriterDB{},
		notify.On(
			func(ctx context.Context,
				evt db.Initialized[db.Txer],
				t *struct{}) {
				err := store.CreateTables(ctx, evt.Initialized)
				if err != nil {
					panic(err)
				}
			}),

		store.ExternalDataStore{
			BaseDir: os.Getenv("EVENTS_DATA_BASE_DIR"),
		},
		store.EventStore{},
		units.EventURLs{
			URLForEvent: func(ctx context.Context, eventID event.ID) string {
				return httpframework.ContextPrefix(ctx) + "/events/" + eventID.String()
			},
		},

		units.WriteTreeFieldsPathCommand,
		units.GetTreeFieldsPathCommand,
		units.WriteTreeDataPathCommand,
		units.GetTreeDataPathCommand,

		// units.GetEventCommand,
		// units.IDLinksQueryCommand,
		// units.EventPathLinksQueryCommand,

		units.WriteEventsCommand,
		units.QueryEventsCommand,
		&units.EventStreamHandler{},
		&units.FSHandler{},
	)
}