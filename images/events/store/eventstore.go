package store

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/json"
	"errors"
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

func (es *EventStore) QueryEvents(ctx context.Context, q *event.Query) ([]event.Event, bool, error) {
	max, s := renderEventQuery(q)
	stmt, v := db.Render(s)
	slog.Info("QueryEvents", "sql", q, "max", max, "v", v)
	rows, err := es.Querier.QueryContext(ctx, stmt, v...)
	if err != nil {
		return nil, false, err
	}

	defer rows.Close()

	results := []event.Event{}
	numResults := 0
	for rows.Next() {
		// we *could* read more, but we won't because we reached our nonzero max.
		if max > 0 && numResults == max {
			return results, true, rows.Err()
		}

		var idBytes sql.RawBytes
		var atBytes sql.RawBytes
		var sinceBytes sql.RawBytes

		var fields []byte
		var fieldsSha256 []byte
		var dataSize int
		var dataSha256 []byte
		var fieldsSize int
		err := rows.Scan(&idBytes, &atBytes, &sinceBytes, &fields, &fieldsSize, &fieldsSha256, &dataSize, &dataSha256)
		if err != nil {
			return nil, false, err
		}

		var id event.ID
		if idBytes != nil && len(idBytes) > 0 {
			err := id.Scan([]byte(idBytes))
			if err != nil {
				return nil, false, err
			}
		}

		var at event.ID
		if atBytes != nil && len(atBytes) > 0 {
			err := at.Scan([]byte(atBytes))
			if err != nil {
				return nil, false, err
			}
		}

		var since event.ID
		if sinceBytes != nil && len(sinceBytes) > 0 {
			err := since.Scan([]byte(sinceBytes))
			if err != nil {
				return nil, false, err
			}
		}

		results = append(results, event.Event{
			ID:         id,
			Payload:    json.RawMessage(fields),
			DataSize:   dataSize,
			FieldsSize: fieldsSize,

			At:           at,
			Since:        since,
			DataSHA256:   event.SHA256Digest(dataSha256),
			FieldsSHA256: event.SHA256Digest(fieldsSha256),
		})
		numResults++
	}

	return results, false, rows.Err()
}

func (es *EventStore) QueryMaxID(ctx context.Context) (event.ID, error) {
	var id event.ID
	rows, err := es.Querier.QueryContext(ctx, `SELECT max(id) as id from "events" LIMIT 1`)
	if err != nil {
		return id, err
	}

	defer rows.Close()
	if !rows.Next() {
		return id, sql.ErrNoRows
	}

	err = rows.Scan(&id)
	if err != nil {
		return id, err
	}

	return id, rows.Err()
}

func (es *EventStore) WriteEvents(ctx context.Context, since event.ID, payloads []json.RawMessage, readClosers []io.ReadCloser) ([]event.ID, error) {
	slog.Info("EventStore.WriteEvents", "since", since, "len(payloads)", len(payloads), "len(readClosers)", len(readClosers))

	if len(payloads) == 0 {
		return nil, nil
	}

	lastUnusedReadCloserIndex := 0
	defer func() {
		if readClosers == nil {
			return
		}
		// close remaining unused readClosers, if any.
		for _, rc := range readClosers[lastUnusedReadCloserIndex+1:] {
			rc.Close()
		}
	}()

	var committers []EventDataCommitFunc

	writeDataIfAny := func(tx db.Tx, id event.ID, i int) ([]byte, int64, error) {
		if readClosers == nil {
			return nil, 0, nil
		}

		readCloser := readClosers[i]
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

	eventIDs := make([]event.ID, 0, len(payloads))
	err := es.Txer.Tx(ctx, func(tx db.Tx) error {
		var at event.ID

		for i, event := range payloads {
			id := es.eventIDFunc()
			if i == 0 {
				at = id
			}

			fields, err := json.Marshal(event)
			if err != nil {
				return err
			}

			dataDigest, n, err := writeDataIfAny(tx, id, i)
			if err != nil {
				return err
			}

			fieldDigester := es.newDigester()
			_, err = fieldDigester.Write(fields)
			if err != nil {
				return err
			}
			fieldDigest := fieldDigester.Sum(nil)

			_, err = tx.ExecContext(ctx, `INSERT INTO "events" (id, at, since, data_size, data_sha256, fields_size, fields_sha256, fields) VALUES (?, ?, ?, ?, ?, ?, ?, jsonb(?))`,
				id, at, since,
				n, dataDigest,
				len(fields), fieldDigest, fields)
			if err != nil {
				return err
			}

			eventIDs = append(eventIDs, id)
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
		return nil, err
	}

	if len(eventIDs) > 0 {
		es.notifyStreamsOfNewMaxID(eventIDs[len(eventIDs)-1])
	}
	return eventIDs, nil
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
