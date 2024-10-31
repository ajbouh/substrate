package store

import (
	"bytes"
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/pkg/toolkit/event"

	"github.com/puzpuzpuz/xsync/v3"
)

type EventStore struct {
	Querier db.Querier
	Txer    db.Txer

	EventDataWriter EventDataWriter
	EventDataSource EventDataSource

	VectorManifoldResolver VectorManifoldResolver
	VectorManifoldWriter   VectorManifoldWriter

	newDigester func() Digester

	eventIDFunc event.IDFunc
	streams     *xsync.MapOf[*Stream, func(event.ID)]
}

var _ event.Querier = (*EventStore)(nil)
var _ event.DataQuerier = (*EventStore)(nil)
var _ event.Writer = (*EventStore)(nil)
var _ event.Streamer = (*EventStore)(nil)

func (es *EventStore) Initialize() {
	es.streams = xsync.NewMapOf[*Stream, func(event.ID)]()
	es.eventIDFunc = event.MakeID
	es.newDigester = func() Digester {
		return sha256.New()
	}
}

func (es *EventStore) QueryEventData(ctx context.Context, id event.ID) (io.ReadSeekCloser, error) {
	return es.EventDataSource.OpenEventData(ctx, id)
}

func (es *EventStore) QueryEvents(ctx context.Context, q *event.Query) ([]event.Event, event.ID, bool, error) {
	var maxID event.ID

	max, s, err := renderEventQuery(ctx, es.VectorManifoldResolver, q)
	if err != nil {
		return nil, maxID, false, err
	}
	stmt, v := db.Render(s)
	results := []event.Event{}
	numResults := 0

	defer func() {
		slog.Info("QueryEvents", "sql", q, "numResults", numResults, "max", max, "v", v, "stmt", stmt, "len(results)", len(results), "err", err)
	}()
	rows, err := es.Querier.QueryContext(ctx, stmt, v...)
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
			slog.Info("QueryEvents reached max", "err", err)
			return results, maxID, true, err
		}
		evt := &event.Event{}

		var idBytes sql.RawBytes
		var atBytes sql.RawBytes
		var sinceBytes sql.RawBytes
		var deleted int

		var dataSHA256 sql.RawBytes
		var dataSize int

		var vecManifoldIDBytes sql.RawBytes
		var vecID any

		var vecDistance any

		var fields []byte
		err = rows.Scan(&idBytes, &atBytes, &sinceBytes, &deleted,
			&fields, &evt.FieldsSize, &evt.FieldsSHA256,
			&dataSize, &dataSHA256,
			&vecManifoldIDBytes, &vecID,
			&vecDistance)
		if err != nil {
			slog.Info("QueryEvents rows.Scan", "err", err)
			return nil, maxID, false, err
		}

		if len(idBytes) > 0 {
			err = evt.ID.Scan(string(idBytes))
			if err != nil {
				slog.Info("QueryEvents ID.Scan", "err", err)
				return nil, maxID, false, err
			}
		}

		if len(atBytes) > 0 {
			err = evt.At.Scan(string(atBytes))
			if err != nil {
				slog.Info("QueryEvents At.Scan", "err", err)
				return nil, maxID, false, err
			}
		}

		if len(sinceBytes) > 0 {
			err = evt.Since.Scan(string(sinceBytes))
			if err != nil {
				slog.Info("QueryEvents Since.Scan", "err", err)
				return nil, maxID, false, err
			}
		}

		evt.Payload = json.RawMessage(fields)
		if len(dataSHA256) > 0 {
			evt.DataSHA256 = new(event.SHA256Digest)
			err = evt.DataSHA256.Scan([]byte(dataSHA256))
			if err != nil {
				slog.Info("QueryEvents DataSHA", "err", err)
				return nil, maxID, false, err
			}

			evt.DataSize = &dataSize
		}

		if len(vecManifoldIDBytes) > 0 {
			var vectorManifoldID event.ID
			err = vectorManifoldID.Scan(string(vecManifoldIDBytes))
			if err != nil {
				slog.Info("QueryEvents vectorManifoldID", "err", err)
				return nil, maxID, false, err
			}

			var vr VectorManifold
			vr, err = vmr.ResolveVectorManifold(ctx, vectorManifoldID)
			if err == nil {
				// track all vec ids
				vecIDInt, ok := vecID.(int64)
				if !ok {
					err = fmt.Errorf("vector_data_rowid is not int64: %T", vecID)
					slog.Info("QueryEvents vector rowid", "err", err)
					return nil, maxID, false, err
				}

				evt.Vector, err = vr.ReadVector(ctx, vecIDInt)
				if err != nil {
					slog.Info("QueryEvents ReadVector", "err", err)
					return nil, maxID, false, err
				}

				if vecDistance != nil {
					vecDistanceFloat, ok := vecDistance.(float64)
					if !ok {
						err = fmt.Errorf("vector_data_nn_distance is not float64: %T", vecDistance)
						slog.Info("QueryEvents vecDistance", "err", err)
						return nil, maxID, false, err
					}

					evt.VectorDistance = &vecDistanceFloat
				}
			} else {
				slog.Info("could not resolve vector_manifold_id", "vector_manifold_id", vectorManifoldID, "err", err)
			}
		}

		slog.Info("maxID.Compare(evt.ID)", "maxID", maxID, "evt.ID", evt.ID, "result", maxID.Compare(evt.ID))
		if maxID.Compare(evt.ID) < 0 {
			maxID = evt.ID
		}
		if deleted == 1 {
			slog.Info("skipping DELETED event entry", "id", evt.ID, "maxID", maxID, "evt", evt)
			continue
		}
		results = append(results, *evt)
		numResults++
	}

	err = rows.Err()
	slog.Info("QueryEvents completed", "err", err)
	return results, maxID, false, err
}

func (es *EventStore) QueryMaxID(ctx context.Context) (event.ID, error) {
	var id event.ID
	var err error
	defer func() {
		slog.Info("QueryMaxID", "id", id, "err", err)
	}()
	rows, err := es.Querier.QueryContext(ctx, `SELECT max(id) as id from "`+eventsTable+`" LIMIT 1`)
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

func (es *EventStore) WriteEvents(ctx context.Context,
	since event.ID,
	set *event.PendingEventSet,
	cb event.WriteNotifyFunc) error {
	slog.Info("EventStore.WriteEvents", "since", since, "len(fieldsList)", len(set.FieldsList), "len(dataList)", len(set.DataList))

	if len(set.FieldsList) == 0 {
		return nil
	}

	lastUnusedReadCloserIndex := 0
	defer func() {
		if len(set.DataList) <= lastUnusedReadCloserIndex {
			return
		}
		// close remaining unused dataList, if any.
		for _, rc := range set.DataList[lastUnusedReadCloserIndex+1:] {
			if rc != nil {
				rc.Close()
			}
		}
	}()

	var committers []EventDataCommitFunc

	writeDataIfAny := func(tx db.Tx, id event.ID, i int) ([]byte, int64, error) {
		l := len(set.DataList)
		if l == 0 || i >= l {
			return nil, 0, nil
		}

		readCloser := set.DataList[i]
		if readCloser == nil {
			return nil, 0, nil
		}

		lastUnusedReadCloserIndex = i

		d := es.newDigester()

		n, committer, err := es.EventDataWriter.WriteEventData(ctx, tx, id, NewTeeReadCloser(readCloser, d))
		if err == nil {
			committers = append(committers, committer)
		}

		return d.Sum(nil), n, err
	}

	finishData := func(commit, breakEarly bool) error {
		var errs []error
		for _, committer := range committers {
			err := committer(commit)
			if err != nil {
				if breakEarly {
					return err
				} else {
					errs = append(errs, err)
				}
			}
		}

		return errors.Join(errs...)
	}

	vmr := NewVectorManifoldCache(es.VectorManifoldResolver)
	writeVectorDataIfAny := func(tx db.Tx, i int) (rowid int64, manifoldID *event.ID, err error) {
		l := len(set.VectorList)
		if l == 0 || i >= l {
			return
		}

		vec := set.VectorList[i]
		if vec == nil {
			return
		}

		vrw, err := vmr.ResolveVectorManifold(ctx, vec.ManifoldID)
		if err != nil {
			return
		}
		rowid, err = vrw.WriteVector(ctx, tx, vec.Data)
		manifoldID = &vec.ManifoldID
		return
	}

	conflictKeysIfAny := func(i int) []string {
		l := len(set.ConflictFieldKeysList)
		if l == 0 || i >= l {
			return nil
		}

		return set.ConflictFieldKeysList[i]
	}

	checkExisting := func(tx db.Tx, i int, fields json.RawMessage) (*event.ID, int, []byte, int64, []byte, bool, error) {
		conflictKeys := conflictKeysIfAny(i)
		if conflictKeys == nil {
			return nil, 0, nil, 0, nil, false, nil
		}

		expr := From(
			As("existing", SQL(eventsTable)),
			As("new", SQL("SELECT", As("fields", V(string(fields))))),
		).Select(
			eventFieldNameJSON("id"),
			eventFieldNameJSON("fields_size"),
			eventFieldNameJSON("fields_sha256"),
			eventFieldNameJSON("data_size"),
			eventFieldNameJSON("data_sha256"),
		)
		for _, key := range conflictKeys {
			path := "$." + key
			expr.AndWhere(
				SQL(Call("jsonb_extract", "existing.fields", V(path)),
					"=",
					Call("json_extract", "new.fields", V(path))))
		}
		query, args := db.Render(expr)

		rows, err := tx.QueryContext(ctx, query, args...)
		if err != nil {
			return nil, 0, nil, 0, nil, false, err
		}
		defer rows.Close()

		if !rows.Next() {
			return nil, 0, nil, 0, nil, false, rows.Err()
		}

		var id event.ID
		var fieldsDigest []byte
		var fieldsSize int
		var dataDigest []byte
		var dataSize int64

		err = rows.Scan(&id, &fieldsSize, &fieldsDigest, &dataSize, &dataDigest)
		return &id, fieldsSize, fieldsDigest, dataSize, dataDigest, err == nil, err
	}

	var lastMaxID *event.ID

	err := es.Txer.Tx(ctx, func(tx db.Tx) error {
		var at event.ID

		for i, fields := range set.FieldsList {
			id := es.eventIDFunc()
			if i == 0 {
				at = id
			}

			fieldsBytes, err := json.Marshal(fields)
			if err != nil {
				return err
			}

			var fieldsDigest []byte
			var fieldsSize int
			var dataDigest []byte
			var dataSize int64

			existingID, existingFieldsSize, existingFieldsDigest, existingDataSize, existingDataDigest, useExisting, err := checkExisting(tx, i, fields)
			if err != nil {
				return err
			}
			if useExisting {
				id = *existingID
				fieldsSize = existingFieldsSize
				fieldsDigest = existingFieldsDigest
				dataSize = existingDataSize
				dataDigest = existingDataDigest
			} else {
				fieldsDigester := es.newDigester()
				_, err = fieldsDigester.Write(fieldsBytes)
				if err != nil {
					return err
				}
				fieldsDigest = fieldsDigester.Sum(nil)
				fieldsSize = len(fieldsBytes)

				dataDigest, dataSize, err = writeDataIfAny(tx, id, i)
				if err != nil {
					return err
				}

				vectorDataRowid, vectorManifoldID, err := writeVectorDataIfAny(tx, i)
				if err != nil {
					return err
				}

				if vectorManifoldID != nil {
					_, err = tx.ExecContext(ctx, `INSERT INTO "`+eventsTable+`" (id, at, since, data_size, data_sha256, fields_size, fields_sha256, fields, vector_manifold_id, vector_data_rowid) VALUES (?, ?, ?, ?, ?, ?, ?, jsonb(?), ?, ?)`,
						id.String(), at.String(), since.String(),
						dataSize, dataDigest,
						fieldsSize, fieldsDigest, fieldsBytes,
						vectorManifoldID.String(), vectorDataRowid,
					)
				} else {
					_, err = tx.ExecContext(ctx, `INSERT INTO "`+eventsTable+`" (id, at, since, data_size, data_sha256, fields_size, fields_sha256, fields) VALUES (?, ?, ?, ?, ?, ?, ?, jsonb(?))`,
						id.String(), at.String(), since.String(),
						dataSize, dataDigest,
						fieldsSize, fieldsDigest, fieldsBytes,
					)
				}

				if err != nil {
					return err
				}

				err = es.interpretEventWrite(ctx, tx, id, fields)
				if err != nil {
					return err
				}
			}

			if cb != nil {
				cb(i, id, fieldsSize, fieldsDigest, dataSize, dataDigest)
			}

			lastMaxID = &id
		}

		err := finishData(true, true)
		if err != nil {
			// something went wrong ... delete all the data we committed!
			finishErr := finishData(false, false)
			if finishErr != nil {
				slog.Info("e", "err", finishErr)
			}
		}

		return err
	})
	if err != nil {
		return err
	}

	if lastMaxID != nil {
		es.notifyStreamsOfNewMaxID(*lastMaxID)
	}
	return nil
}

var typeFieldBytes = []byte(`"type":`)
var typeVectorManifoldBytes = []byte(`"vector_manifold"`)

func (es *EventStore) interpretEventWrite(ctx context.Context, tx db.Tx, id event.ID, fields []byte) error {
	if !bytes.Contains(fields, typeFieldBytes) {
		return nil
	}

	// this is a good enough hint to try decoding it.
	if bytes.Contains(fields, typeVectorManifoldBytes) {

		f := struct {
			Type string `json:"type"`
			event.VectorManifold
		}{}

		err := json.Unmarshal(fields, &f)
		if err != nil {
			return nil
		}

		if f.Type != "vector_manifold" {
			return nil
		}

		f.VectorManifold.ID = id
		return es.VectorManifoldWriter.WriteVectorManifold(ctx, tx, &f.VectorManifold)
	}

	return nil
}

func (es *EventStore) notifyStreamsOfNewMaxID(eventID event.ID) {
	es.streams.Range(func(key *Stream, value func(event.ID)) bool {
		value(eventID)
		return true
	})
}

func (es *EventStore) StreamEvents(ctx context.Context, sq *event.Query) (event.Stream, error) {
	stream := newStream(sq.View.StreamShouldAutoAdvanceAfter())

	until, err := es.QueryMaxID(ctx)
	if err != nil {
		return nil, err
	}

	go stream.process(ctx, es, sq)
	go func() {
		defer es.streams.Delete(stream)
		<-ctx.Done()
	}()

	es.streams.Store(stream, stream.tap)
	stream.tap(until)

	return stream, nil
}
