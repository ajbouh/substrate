package store

import (
	"context"
	"io"
	"log/slog"
	"os"
	"path"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/images/events/store/storeio"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type EventDataTx interface {
	Finish(bool) error
	Open() (io.ReadSeekCloser, error)
}

type EventDataWriter interface {
	WriteEventData(ctx context.Context, tx db.Tx, id event.ID, read io.Reader) (int64, EventDataTx, error)
}

type EventDataSource interface {
	OpenEventData(ctx context.Context, id event.ID) (io.ReadSeekCloser, error)
}

type EventDataSourceList []EventDataSource

func (e EventDataSourceList) OpenEventData(ctx context.Context, id event.ID) (io.ReadSeekCloser, error) {
	for _, eds := range e {
		rsc, err := eds.OpenEventData(ctx, id)
		if err != nil || rsc != nil {
			return rsc, err
		}
	}
	return nil, nil
}

var _ EventDataSource = (EventDataSourceList)(nil)

type ExternalDataStore struct {
	BaseDir string
}

var _ EventDataSource = (*ExternalDataStore)(nil)
var _ EventDataWriter = (*ExternalDataStore)(nil)

func (ds *ExternalDataStore) createTemp(id event.ID) (*os.File, error) {
	return os.CreateTemp(ds.BaseDir, id.String()+".*.tmp")
}

func (ds *ExternalDataStore) resolve(id event.ID) string {
	return path.Join(ds.BaseDir, id.String())
}

func (ds *ExternalDataStore) Initialize() {
	err := os.MkdirAll(ds.BaseDir, 0o755)
	if err != nil {
		panic("could not MkdirAll ExternalDataStore.BaseDir: " + err.Error())
	}
}

type eventDataTx struct {
	finish func(bool) error
	open   func() (io.ReadSeekCloser, error)
}

func (e *eventDataTx) Finish(b bool) error {
	return e.finish(b)
}

func (e *eventDataTx) Open() (io.ReadSeekCloser, error) {
	return e.open()
}

var _ EventDataTx = (*eventDataTx)(nil)

type PendingEventDataSource map[event.ID]EventDataTx

func (p PendingEventDataSource) OpenEventData(ctx context.Context, id event.ID) (io.ReadSeekCloser, error) {
	for pID, tx := range p {
		if pID == id {
			slog.Info("PendingEventDataSource.OpenEventData found", "id", id)
			return tx.Open()
		}
	}
	return nil, nil
}

var _ EventDataSource = (PendingEventDataSource)(nil)

func (ds *ExternalDataStore) WriteEventData(ctx context.Context, tx db.Tx, id event.ID, r io.Reader) (int64, EventDataTx, error) {
	fileName := ds.resolve(id)
	f, err := ds.createTemp(id)
	if err != nil {
		return 0, nil, err
	}
	defer f.Close()

	n, err := io.Copy(f, r)
	if err != nil {
		return n, nil, err
	}

	return n, &eventDataTx{
		finish: func(commit bool) error {
			if commit {
				return os.Rename(f.Name(), fileName)
			} else {
				return os.Remove(f.Name())
			}
		},
		open: func() (io.ReadSeekCloser, error) {
			slog.Info("eventDataTx.open", "f.Name()", f.Name())
			return os.Open(f.Name())
		},
	}, nil
}

func (ds *ExternalDataStore) OpenEventData(ctx context.Context, id event.ID) (io.ReadSeekCloser, error) {
	fileName := ds.resolve(id)
	return os.Open(fileName)
}

type DBDataStore struct {
	Querier db.Querier
}

var _ EventDataSource = (*DBDataStore)(nil)
var _ EventDataWriter = (*DBDataStore)(nil)

func (ds *DBDataStore) WriteEventData(ctx context.Context, tx db.Tx, id event.ID, r io.Reader) (int64, EventDataTx, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return 0, nil, err
	}

	return int64(len(data)), &eventDataTx{
		finish: func(commit bool) error {
			if commit {
				_, err = tx.ExecContext(ctx, `INSERT INTO "data" (event_id, data) VALUES (?, ?)`,
					id, data)
				return err
			}
			return nil
		},
		open: func() (io.ReadSeekCloser, error) {
			return storeio.NewReadSeekCloserForBytes(data), nil
		},
	}, nil
}

func (ds *DBDataStore) OpenEventData(ctx context.Context, id event.ID) (io.ReadSeekCloser, error) {
	rows, err := ds.Querier.QueryContext(ctx, `SELECT data from "event_data" where event_id = ?`, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if rows.Next() {
		var b []byte
		err := rows.Scan(&b)
		if err != nil {
			return nil, err
		}

		return storeio.NewReadSeekCloserForBytes(b), rows.Err()
	}

	return nil, os.ErrNotExist
}
