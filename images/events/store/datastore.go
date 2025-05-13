package store

import (
	"bytes"
	"context"
	"io"
	"os"
	"path"

	"github.com/ajbouh/substrate/images/events/db"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type EventDataCommitFunc func(bool) error

type EventDataWriter interface {
	WriteEventData(ctx context.Context, tx db.Tx, id event.ID, read io.Reader) (int64, EventDataCommitFunc, error)
}

type EventDataSource interface {
	OpenEventData(ctx context.Context, id event.ID) (io.ReadSeekCloser, error)
}

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

func (ds *ExternalDataStore) WriteEventData(ctx context.Context, tx db.Tx, id event.ID, r io.Reader) (int64, EventDataCommitFunc, error) {
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

	commit := func(commit bool) error {
		if commit {
			return os.Rename(f.Name(), fileName)
		} else {
			return os.Remove(f.Name())
		}
	}
	return n, commit, nil
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

func (ds *DBDataStore) WriteEventData(ctx context.Context, tx db.Tx, id event.ID, r io.Reader) (int64, EventDataCommitFunc, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return 0, nil, err
	}

	commit := func(commit bool) error {
		if commit {
			_, err = tx.ExecContext(ctx, `INSERT INTO "data" (event_id, data) VALUES (?, ?)`,
				id, data)
			return err
		}
		return nil
	}

	return int64(len(data)), commit, nil
}

func (ds *DBDataStore) OpenEventData(ctx context.Context, id event.ID) (io.ReadSeekCloser, error) {
	rows, err := ds.Querier.QueryContext(ctx, `SELECT data from "event_data" where event_id = ?`, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var b []byte
		err := rows.Scan(&b)
		if err != nil {
			return nil, err
		}

		return &bytesReadSeekCloser{reader: bytes.NewReader(b)}, rows.Err()
	}

	return nil, os.ErrNotExist
}

var _ io.ReadSeekCloser = (*bytesReadSeekCloser)(nil)

type bytesReadSeekCloser struct {
	reader *bytes.Reader
}

func (b *bytesReadSeekCloser) Close() error {
	// garbage collect.
	b.reader = nil
	return nil
}

func (b *bytesReadSeekCloser) Read(p []byte) (n int, err error) {
	return b.reader.Read(p)
}

func (b *bytesReadSeekCloser) Seek(offset int64, whence int) (int64, error) {
	return b.reader.Seek(offset, whence)
}
