package units

import (
	"context"
	"database/sql"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
)

type GetStatsReturns struct {
	Writer sql.DBStats `json:"writer"`
	Reader sql.DBStats `json:"reader"`
}

var GetStatsCommand = handle.HTTPCommand(
	"stats:get", "Get current statistics for the system",
	"GET /stats", "/",

	func(ctx context.Context,
		t *struct {
			SingleWriterDB *db.SingleWriterDB
			MultiReaderDB  *db.MultiReaderDB
		},
		args struct {
		},
	) (GetStatsReturns, error) {
		return GetStatsReturns{
			Writer: t.SingleWriterDB.Stats(),
			Reader: t.MultiReaderDB.Stats(),
		}, nil
	})
