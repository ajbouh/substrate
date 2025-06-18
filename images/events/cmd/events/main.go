package main

import (
	"context"
	"log"
	"log/slog"
	"os"
	"path"

	sqlite_vec "github.com/asg017/sqlite-vec-go-bindings/cgo"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/images/events/store"
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
		&db.MultiReaderDB{
			MaxIdleConns: 16,
			MaxOpenConns: 0,
		},
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
			BaseDir: os.Getenv("EVENTS_DATA_BASE_DIR"),
		},
		&store.DefaultIDSource{},
		&store.Writer{},
		&store.Querier{},
		&store.Streamer{},
		&store.VectorManifoldStore{},
		&units.EventURLs{
			URLForEvent: func(ctx context.Context, eventID event.ID) string {
				return httpframework.ContextPrefix(ctx) + "/events/" + eventID.String()
			},
		},
		&units.SelfLinks{},

		units.ExportEventsCommand,
		units.ImportEventsCommand,

		units.WriteTreeFieldsPathCommand,
		units.GetTreeFieldsPathCommand,

		units.WriteTreeDataPathCommand,
		units.GetTreeDataPathCommand,

		units.GetTreeRawPathCommand,

		units.GetEventCommand,
		units.GetEventDataCommand,
		units.IDLinksQueryCommand,
		units.EventPathLinksQueryCommand,

		units.WriteEventsCommand,
		units.QueryEventsCommand,
		&units.EventStreamHandler{},
		&units.FSHandler{},

		units.GetStatsCommand,

		&httpframework.PProfHandler{},
	)
}
