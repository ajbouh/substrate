package store

import (
	"context"
	"fmt"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

func CreateTables(ctx context.Context, txer db.Txer) error {
	tables := []string{
		// dropEventsTable,
		createEventsTable,
		// dropEventVectorManifoldsTable,
		createEventVectorManifoldsTable,
	}

	return txer.Tx(ctx, func(tx db.Tx) error {
		for _, table := range tables {
			_, err := tx.ExecContext(ctx, table)
			if err != nil {
				return fmt.Errorf("error running sql %q: %w", table, err)
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
const manifoldsTable = "event_vector_manifolds"

const dropEventsTable = `DROP TABLE IF EXISTS "events"`

// fields column is JSONB, has "path", "type", "refs", "deleted"

const createEventsTable = `CREATE TABLE IF NOT EXISTS "events" (
	id BLOB,
	since BLOB,
	at BLOB,
	data_size INT,
	data_sha256 BLOB,
	fields_size INT,
	fields_sha256 BLOB,
	fields BLOB,
	vector_manifold_id BLOB,
	vector_data_rowid INT,
	PRIMARY KEY (id),
	FOREIGN KEY (vector_manifold_id) REFERENCES event_vector_manifolds(id)
) WITHOUT ROWID, strict;`

const dropEventVectorManifoldsTable = `DROP TABLE IF EXISTS "event_vector_manifolds"`

const createEventVectorManifoldsTable = `CREATE TABLE IF NOT EXISTS "event_vector_manifolds" (
    id BLOB,
	"table" TEXT,
	dtype TEXT,
	dimensions INT,
	metric TEXT,
	PRIMARY KEY (id)
) WITHOUT ROWID, strict;`

const createEventDataTable = `CREATE TABLE IF NOT EXISTS "event_data" (
	event_id TEXT,
	data BLOB,
	PRIMARY KEY (event_id),
	FOREIGN KEY (event_id) REFERENCES events(id)
) WITHOUT ROWID, strict;`

const createEventVectorDataTable = `CREATE TABLE IF NOT EXISTS %q (
    rowid INTEGER PRIMARY KEY AUTOINCREMENT,
	vec BLOB
);`

func EventVectorManifoldTableName(id event.ID) string {
	return "event_vector_manifold_" + id.String()
}
