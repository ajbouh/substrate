package db

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"
	"sync"

	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/ajbouh/substrate/pkg/toolkit/sqliteuri"
)

var _ Txer = (*SingleWriterDB)(nil)

type Ready[T any] struct {
	Ready T
}

type SingleWriterDB struct {
	mu     sync.RWMutex
	db     *sql.DB
	Opener *sqliteuri.Opener
	URI    *sqliteuri.URI

	ReadyNotifiers []notify.Notifier[Ready[Txer]]
}

func (s *SingleWriterDB) Initialize() {
	var err error
	uri := s.URI
	s.db, err = s.Opener.Open(s.URI)
	slog.Info("SingleWriterDB.Initialize()", "uri", uri.String(), "err", err)
	if err != nil {
		panic(err)
	}

	s.db.SetMaxOpenConns(1)

	notify.Notify(context.Background(), s.ReadyNotifiers, Ready[Txer]{Ready: s})
}

func (s *SingleWriterDB) Stats() sql.DBStats {
	if s.db == nil {
		return sql.DBStats{}
	}

	return s.db.Stats()
}

func (s *SingleWriterDB) Terminate() error {
	return s.db.Close()
}

func (s *SingleWriterDB) Tx(ctx context.Context, op func(tx Tx) error) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	err = op(&SingleWriterTx{tx: tx})
	if err == nil {
		return tx.Commit()
	}

	rollbackErr := tx.Rollback()
	if rollbackErr != nil {
		return errors.Join(err, rollbackErr)
	}
	return err
}

type Txer interface {
	Tx(ctx context.Context, op func(tx Tx) error) error
}

type Tx interface {
	Querier
	Executor
}

type SingleWriterTx struct {
	tx Tx
}

var _ Tx = (*SingleWriterTx)(nil)

func (s *SingleWriterTx) ExecContext(ctx context.Context, query string, values ...any) (sql.Result, error) {
	return execContext(ctx, s.tx, query, values...)
}

func (s *SingleWriterTx) QueryContext(ctx context.Context, query string, values ...any) (*sql.Rows, error) {
	return queryContext(ctx, s.tx, query, values...)
}
