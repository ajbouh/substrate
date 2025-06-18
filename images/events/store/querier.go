package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type Querier struct {
	DBQuerier              db.Querier
	EventDataSource        EventDataSource
	VectorManifoldResolver VectorManifoldResolver
}

var _ event.Querier = (*Querier)(nil)
var _ event.DataQuerier = (*Querier)(nil)

func (es *Querier) QueryEventData(ctx context.Context, id event.ID) (io.ReadSeekCloser, error) {
	return es.EventDataSource.OpenEventData(ctx, id)
}

func (es *Querier) QueryEvents(ctx context.Context, q *event.Query) ([]event.Event, event.ID, bool, error) {
	var maxID event.ID

	max, s, err := renderEventQuery(ctx, es.VectorManifoldResolver, q)
	if err != nil {
		return nil, maxID, false, err
	}
	stmt, v := db.Render(s)
	results := []event.Event{}
	numResults := 0

	// defer func() {
	// 	slog.Info("QueryEvents", "sql", q, "numResults", numResults, "max", max, "v", v, "stmt", stmt, "len(results)", len(results), "err", err)
	// }()
	rows, err := es.DBQuerier.QueryContext(ctx, stmt, v...)
	if err != nil {
		slog.Info("QueryContext error", "err", err)
		return nil, maxID, false, err
	}

	defer rows.Close()

	vmr := NewVectorManifoldCache(es.VectorManifoldResolver)

	for rows.Next() {
		// we *could* read more, but we won't because we reached our nonzero max.
		if max > 0 && numResults == max {
			err = rows.Err()
			// slog.Info("QueryEvents reached max", "err", err)
			return results, maxID, true, err
		}
		evt := &event.Event{}

		var idBytes sql.RawBytes
		var atBytes sql.RawBytes
		var sinceBytes sql.RawBytes
		var deleted int
		var matches []byte

		var dataSHA256 sql.RawBytes
		var dataSize int

		var vecManifoldIDBytes sql.RawBytes
		var vecID any

		var vecDistance any

		var fields []byte
		err = rows.Scan(&idBytes, &atBytes, &sinceBytes, &deleted,
			&fields,
			&dataSize, &dataSHA256,
			&vecManifoldIDBytes, &vecID,
			&matches,
			&vecDistance)
		if err != nil {
			// slog.Info("QueryEvents rows.Scan", "err", err)
			return nil, maxID, false, err
		}

		if len(idBytes) > 0 {
			err = evt.ID.Scan(string(idBytes))
			if err != nil {
				// slog.Info("QueryEvents ID.Scan", "err", err)
				return nil, maxID, false, err
			}
		}

		if len(atBytes) > 0 {
			err = evt.At.Scan(string(atBytes))
			if err != nil {
				// slog.Info("QueryEvents At.Scan", "err", err)
				return nil, maxID, false, err
			}
		}

		if len(sinceBytes) > 0 {
			err = evt.Since.Scan(string(sinceBytes))
			if err != nil {
				// slog.Info("QueryEvents Since.Scan", "err", err)
				return nil, maxID, false, err
			}
		}

		if len(matches) > 0 {
			err = json.Unmarshal(matches, &evt.Matches)
			if err != nil {
				// slog.Info("QueryEvents Since.Scan", "err", err)
				return nil, maxID, false, err
			}
		}

		evt.Payload = json.RawMessage(fields)
		if len(dataSHA256) > 0 {
			evt.DataSHA256 = new(event.SHA256Digest)
			err = evt.DataSHA256.Scan([]byte(dataSHA256))
			if err != nil {
				// slog.Info("QueryEvents DataSHA", "err", err)
				return nil, maxID, false, err
			}

			evt.DataSize = &dataSize
		}

		if len(vecManifoldIDBytes) > 0 {
			var vectorManifoldID event.ID
			err = vectorManifoldID.Scan(string(vecManifoldIDBytes))
			if err != nil {
				// slog.Info("QueryEvents vectorManifoldID", "err", err)
				return nil, maxID, false, err
			}

			var vr VectorManifold
			vr, err = vmr.ResolveVectorManifold(ctx, vectorManifoldID)
			if err == nil {
				// track all vec ids
				vecIDInt, ok := vecID.(int64)
				if !ok {
					err = fmt.Errorf("vector_data_rowid is not int64: %T", vecID)
					// slog.Info("QueryEvents vector rowid", "err", err)
					return nil, maxID, false, err
				}

				evt.Vector, err = vr.ReadVector(ctx, vecIDInt)
				if err != nil {
					// slog.Info("QueryEvents ReadVector", "err", err)
					return nil, maxID, false, err
				}

				if vecDistance != nil {
					vecDistanceFloat, ok := vecDistance.(float64)
					if !ok {
						err = fmt.Errorf("vector_data_nn_distance is not float64: %T", vecDistance)
						// slog.Info("QueryEvents vecDistance", "err", err)
						return nil, maxID, false, err
					}

					evt.VectorDistance = &vecDistanceFloat
				}
			} else {
				slog.Info("could not resolve vector_manifold_id", "vector_manifold_id", vectorManifoldID, "err", err)
			}
		}

		if maxID.Compare(evt.ID) < 0 {
			maxID = evt.ID
		}
		if deleted == 1 {
			// slog.Info("skipping DELETED event entry", "id", evt.ID, "maxID", maxID, "evt", evt)
			continue
		}
		results = append(results, *evt)
		numResults++
	}

	err = rows.Err()
	// slog.Info("QueryEvents completed", "err", err)
	return results, maxID, false, err
}

func (es *Querier) QueryMaxID(ctx context.Context) (event.ID, error) {
	var id event.ID
	var err error
	defer func() {
		slog.Info("QueryMaxID", "id", id, "err", err)
	}()
	rows, err := es.DBQuerier.QueryContext(ctx, `SELECT max(id) as id from "`+eventsTable+`" LIMIT 1`)
	if err != nil {
		return id, err
	}

	defer rows.Close()
	if !rows.Next() {
		err = rows.Err()
		return id, err
	}

	err = rows.Scan(&id)
	if err != nil {
		return id, err
	}

	err = rows.Err()
	return id, err
}
