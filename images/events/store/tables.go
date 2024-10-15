package store

import (
	"context"

	"github.com/ajbouh/substrate/images/events/db"
)

func CreateTables(ctx context.Context, txer db.Txer) error {
	tables := []string{
		// dropEventsTable,
		createEventsTable,
	}

	return txer.Tx(ctx, func(tx db.Tx) error {
		for _, table := range tables {
			_, err := tx.ExecContext(ctx, table)
			if err != nil {
				return err
			}
		}

		return nil
	})
}

// // for debugging. this is a data structure that tracks information about what events were created
// // due to what queries and invocations.
// type StepTrace struct {
// 	ID string

// 	SubscriptionID string
// 	Select          StepQuery

// 	EmittedIDs []string
// 	Logs            []string
// 	Error           any

// 	Start time.Time
// 	Dur   time.Duration
// }

// // we tie a specific query pattern to a specific command that should be invoked whenever a batch
// // of matching events is available.

const eventsTable = "events"

const dropEventsTable = `DROP TABLE IF EXISTS "events"`

// fields column is JSONB, has "path", "type", "refs", "deleted"

// TODO add fuse mount for data, fields

const createEventsTable = `CREATE TABLE IF NOT EXISTS "events" (id TEXT, since TEXT, at TEXT, data_size INT, data_sha256 BLOB, fields_size INT, fields_sha256 BLOB, fields JSONB, PRIMARY KEY (id));`

const createEventDataTable = `CREATE TABLE IF NOT EXISTS "event_data" (event_id TEXT, data BLOB, PRIMARY KEY (event_id), FOREIGN KEY (event_id) REFERENCES events(id));`
