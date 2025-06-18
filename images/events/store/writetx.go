package store

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"hash"
	"io"
	"log/slog"

	"github.com/ajbouh/substrate/images/events/db"
	reactionrun "github.com/ajbouh/substrate/images/events/store/reaction/run"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
	"github.com/tidwall/gjson"
)

type WriteTx struct {
	NewDigester  func() hash.Hash
	NextIDSource EventStoreIDSource

	EventDataWriter        EventDataWriter
	VectorManifoldWriter   VectorManifoldWriter
	VectorManifoldResolver VectorManifoldResolver

	Since       event.ID
	NotifyWrite event.WriteNotifyFunc

	Querier *Querier
	Tx      db.Tx

	nextEventID event.IDFunc
	maxID       event.ID
	triggerTx   *TriggerTx
	at          event.ID
	committers  []EventDataCommitFunc
}

func (tx *WriteTx) queryExpr(ctx context.Context, expr db.Expr) (*sql.Rows, error) {
	stmt, values := db.Render(expr)
	return tx.Tx.QueryContext(ctx, stmt, values...)
}

func (tx *WriteTx) writeDataIfAny(ctx context.Context, id event.ID, readCloser io.ReadCloser) ([]byte, int64, error) {
	if readCloser == nil {
		return nil, 0, nil
	}

	d := tx.NewDigester()

	n, committer, err := tx.EventDataWriter.WriteEventData(ctx, tx.Tx, id, NewTeeReadCloser(readCloser, d))
	if err == nil {
		tx.committers = append(tx.committers, committer)
	}

	return d.Sum(nil), n, err
}

func (tx *WriteTx) finishData(commit, breakEarly bool) error {
	var errs []error
	for _, committer := range tx.committers {
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

func (tx *WriteTx) writeVectorDataIfAny(ctx context.Context, vec *event.VectorInput[float32]) (rowid int64, manifoldID *event.ID, err error) {
	if vec == nil {
		return
	}

	vrw, err := tx.VectorManifoldResolver.ResolveVectorManifold(ctx, vec.ManifoldID)
	if err != nil {
		return
	}
	rowid, err = vrw.WriteVector(ctx, tx.Tx, vec.Data)
	manifoldID = &vec.ManifoldID
	return
}

func (tx *WriteTx) checkExisting(ctx context.Context, conflictKeys []string, fields json.RawMessage) (*event.ID, int64, []byte, bool, error) {
	if conflictKeys == nil {
		return nil, 0, nil, false, nil
	}

	expr := From(
		As("existing", SQL(eventsTable)),
		As("new", SQL("SELECT", As("fields", V(string(fields))))),
	).Select(
		eventFieldNameJSON("id"),
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
	rows, err := tx.queryExpr(ctx, expr)
	if err != nil {
		return nil, 0, nil, false, err
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, 0, nil, false, rows.Err()
	}

	var id event.ID
	var dataDigest []byte
	var dataSize int64

	err = rows.Scan(&id, &dataSize, &dataDigest)
	return &id, dataSize, dataDigest, err == nil, err
}

func (tx *WriteTx) writeOnePending(ctx context.Context, id event.ID, pending *event.PendingEventSet, i int) (eid event.ID, dataSize int64, dataDigest []byte, err error) {
	fields := pending.FieldsAt(i)
	fieldsBytes, err := json.Marshal(fields)
	if err != nil {
		return id, 0, nil, err
	}

	conflictKeys := pending.ConflictFieldKeysAt(i)
	existingID, existingDataSize, existingDataDigest, useExisting, err := tx.checkExisting(ctx, conflictKeys, fields)
	if err != nil {
		return id, 0, nil, err
	}
	if useExisting {
		return *existingID, existingDataSize, existingDataDigest, nil
	}

	fieldsDigester := tx.NewDigester()
	_, err = fieldsDigester.Write(fieldsBytes)
	if err != nil {
		return id, 0, nil, err
	}

	readCloser, err := pending.DataAt(i)
	if err != nil {
		return id, 0, nil, err
	}

	dataDigest, dataSize, err = tx.writeDataIfAny(ctx, id, readCloser)
	if err != nil {
		return id, 0, nil, err
	}

	vec := pending.VectorAt(i)
	vectorDataRowid, vectorManifoldID, err := tx.writeVectorDataIfAny(ctx, vec)
	if err != nil {
		return id, 0, nil, err
	}

	if vectorManifoldID != nil {
		_, err = tx.Tx.ExecContext(ctx, `INSERT INTO "`+eventsTable+`" (id, at, since, data_size, data_sha256, fields, vector_manifold_id, vector_data_rowid) VALUES (?, ?, ?, ?, ?, jsonb(?), ?, ?)`,
			id.String(), tx.at.String(), tx.Since.String(),
			dataSize, dataDigest,
			fieldsBytes,
			vectorManifoldID.String(), vectorDataRowid,
		)
	} else {
		_, err = tx.Tx.ExecContext(ctx, `INSERT INTO "`+eventsTable+`" (id, at, since, data_size, data_sha256, fields) VALUES (?, ?, ?, ?, ?, jsonb(?))`,
			id.String(), tx.at.String(), tx.Since.String(),
			dataSize, dataDigest,
			fieldsBytes,
		)
	}

	if err != nil {
		return id, 0, nil, err
	}

	derived, err := tx.interpretWrite(ctx, id, fieldsBytes)
	if err != nil {
		return id, 0, nil, err
	}

	if len(derived) > 0 {
		for _, set := range derived {
			for setIndex := range set.Len() {
				// runaway recursion between reactions will eventually mean a stack overflow here.
				_, _, _, err := tx.writeOnePending(ctx, tx.nextEventID(), set, setIndex)
				if err != nil {
					return id, 0, nil, err
				}
			}
		}
	}

	return id, dataSize, dataDigest, nil
}

func (tx *WriteTx) Begin(ctx context.Context, pending *event.PendingEventSet) error {
	slog.Info("WriteTx.Begin", "since", tx.Since, "len", pending.Len())

	if pending.Len() == 0 {
		return nil
	}

	tx.nextEventID = func() event.ID {
		id := tx.NextIDSource.NextEventID()
		tx.maxID = id
		return id
	}

	tx.triggerTx = &TriggerTx{
		Tx:                     tx.Tx,
		VectorManifoldResolver: tx.VectorManifoldResolver,
	}

	// clear trigger table before we write, just in case
	if err := tx.triggerTx.ClearNotifications(ctx); err != nil {
		return err
	}

	for i := range pending.Len() {
		id := tx.nextEventID()
		if i == 0 {
			tx.at = id
		}

		id, dataSize, dataDigest, err := tx.writeOnePending(ctx, id, pending, i)
		if err != nil {
			return err
		}

		if tx.NotifyWrite != nil {
			tx.NotifyWrite(i, id, dataSize, dataDigest)
		}
	}

	err := tx.finishData(true, true)
	if err != nil {
		// something went wrong ... delete all the data we committed!
		finishErr := tx.finishData(false, false)
		if finishErr != nil {
			slog.Info("e", "err", finishErr)
		}
	}

	return err
}

var typeFieldBytes = []byte(`"type":`)

var typeVectorManifoldBytes = []byte(`"vector_manifold"`)

func (tx *WriteTx) considerVectorManifoldWrite(ctx context.Context, id event.ID, fields []byte) error {
	// this is a good enough hint to try decoding it.
	if !bytes.Contains(fields, typeFieldBytes) || !bytes.Contains(fields, typeVectorManifoldBytes) {
		return nil
	}

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
	return tx.VectorManifoldWriter.WriteVectorManifold(ctx, tx.Tx, &f.VectorManifold)
}

func (tx *WriteTx) shouldReactionRun(ctx context.Context, id event.ID, at *ReactionAlarmTrigger, qt *ReactionQueryTrigger) (bool, error) {
	if at != nil {
		// if the alarm is in the past, we need to run it.
		slog.Info("WriteTx.shouldReactionRun", "id", id, "at", at, "at.Alarm.Compare(event.Time(id))", at.Alarm.Compare(event.Time(id)))
		if at.Alarm.Compare(event.Time(id)) <= 0 {
			return true, nil
		}
	}

	// if we have conditions for resume or launch then update the triggers.
	if qt != nil {
		// if there's even one result, that's all we need to know.
		some, err := renderTriggerQuery(ctx, tx.VectorManifoldResolver, *qt)
		if err != nil {
			return false, err
		}

		if some != nil {
			rows, err := tx.queryExpr(ctx, some)
			if err != nil {
				return false, err
			}
			defer rows.Close()

			if rows.Next() {
				err := rows.Err()
				if err != nil {
					return false, err
				}

				return true, nil
			}
		}
	}

	return false, nil
}

// returns rewritten fields (if needed), and a thunk to use after writing
func (tx *WriteTx) considerReactionWrite(ctx context.Context, id event.ID, fields []byte) error {
	slog.Info("WriteTx.considerReactionWrite", "id", id)

	var err error
	var qt *ReactionQueryTrigger
	var at *ReactionAlarmTrigger
	var typeField string
	var isDisabled bool
	var isDeletion bool
	var fpk event.FingerprintKey
	var shouldRun bool

	defer func() {
		slog.Info("WriteTx.considerReactionWrite", "id", id, "fpk", fpk, "type", typeField, "isDeletion", isDeletion, "err", err, "isDisabled", isDisabled, "at", at, "qt", qt, "shouldRun", shouldRun)
	}()

	// consider trigger deletion
	if fpk, isDeletion = isWriteADeletion(fields); isDeletion {
		// nothing more to do if this is a deletion
		return tx.triggerTx.Drop(ctx, fpk)
	}

	// if it's not a reaction, nothing to run
	typeField = gjson.GetBytes(fields, "type").String()
	if typeField != "reaction" {
		return nil
	}

	fpk, err = event.FingerprintKeyFor(fields)
	if err != nil {
		// if we have no valid fingerprint key, fail the write
		return err
	}

	// if it's disabled, drop the trigger
	isDisabled = gjson.GetBytes(fields, "reaction.disabled").Bool()
	if isDisabled {
		return tx.triggerTx.Drop(ctx, fpk)
	}

	at = reactionAlarmTriggerFor(id, fpk, fields)
	qt = reactionQueryTriggerFor(id, fpk, fields)

	// update the triggers
	if qt == nil {
		if err = tx.triggerTx.Drop(ctx, fpk); err != nil {
			return err
		}
	} else {
		if err = tx.triggerTx.Drop(ctx, qt.FingerprintKey); err != nil {
			return err
		}
		if err = tx.triggerTx.Create(ctx, *qt); err != nil {
			return err
		}
	}

	if shouldRun, err = tx.shouldReactionRun(ctx, id, at, qt); err != nil {
		return err
	} else if shouldRun {
		if err = tx.triggerTx.Notify(ctx, id); err != nil {
			return err
		}
	}

	return nil
}

func (tx *WriteTx) interpretWrite(ctx context.Context, id event.ID, fields []byte) ([]*event.PendingEventSet, error) {
	// todo can we convert vector manifold tracking to just be a reaction?
	if err := tx.considerVectorManifoldWrite(ctx, id, fields); err != nil {
		return nil, err
	}

	if err := tx.considerReactionWrite(ctx, id, fields); err != nil {
		return nil, err
	}

	runIDs, err := tx.triggerTx.ConsumeNotifications(ctx)
	if err != nil {
		return nil, err
	}

	slog.Info("WriteTx.interpretWrite", "id", id, "runIDs", runIDs)

	var sets []*event.PendingEventSet
	for _, runID := range runIDs {
		set, err := reactionrun.RunID(ctx, tx.Querier, tx.maxID, runID)
		if err != nil {
			return nil, err
		}
		sets = append(sets, set)
	}

	return sets, err
}

func isWriteADeletion(fields []byte) (event.FingerprintKey, bool) {
	deletedField := gjson.GetBytes(fields, "deleted")
	var fp event.FingerprintKey
	if !deletedField.Exists() {
		return fp, false
	}
	switch deletedField.Type {
	case gjson.Number:
		if deletedField.Num == 0 {
			return fp, false
		}
	case gjson.False:
		return fp, false
	}

	// can only be a deletion if we have a valid fingerprint
	fp, err := event.FingerprintKeyFor(fields)
	if err != nil {
		return fp, false
	}
	return fp, true
}
