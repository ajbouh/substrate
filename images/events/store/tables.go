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

const eventsTable = "events2"
const manifoldsTable = "event_vector_manifolds2"

const dropEventsTable = `DROP TABLE IF EXISTS "` + eventsTable + `"`

// fields column is JSONB, has "path", "type", "links", "deleted"

const createEventsTable = `CREATE TABLE IF NOT EXISTS "` + eventsTable + `" (
	id TEXT,
	since TEXT,
	at TEXT,
	data_size INT,
	data_sha256 BLOB,
	fields BLOB,
	vector_manifold_id TEXT,
	vector_data_rowid INT,
	PRIMARY KEY (id),
	FOREIGN KEY (vector_manifold_id) REFERENCES ` + manifoldsTable + `(id)
) WITHOUT ROWID, strict;`

const dropEventVectorManifoldsTable = `DROP TABLE IF EXISTS "` + manifoldsTable + `"`

const createEventVectorManifoldsTable = `CREATE TABLE IF NOT EXISTS "` + manifoldsTable + `" (
    id TEXT,
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
	FOREIGN KEY (event_id) REFERENCES ` + eventsTable + `(id)
) WITHOUT ROWID, strict;`

const createEventVectorDataTable = `CREATE TABLE IF NOT EXISTS %q (
    rowid INTEGER PRIMARY KEY AUTOINCREMENT,
	vec BLOB
);`

func EventVectorManifoldTableName(id event.ID) string {
	return "event_vector_manifold_" + id.String()
}
