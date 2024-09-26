package db

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"
	"time"

	"github.com/ajbouh/substrate/pkg/toolkit/sqliteuri"

	_ "github.com/mattn/go-sqlite3"
)

type Querier interface {
	QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error)
}

type Executor interface {
	ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error)
}

func wrapSQLError(err error, sql string, values ...interface{}) error {
	if len(values) == 0 {
		return fmt.Errorf("error with sql: `%s`: %w", sql, err)
	}
	return fmt.Errorf("error with sql: `%s`: (%#v): %w", sql, values, err)
}

func execContext(ctx context.Context, db Executor, query string, values ...any) (sql.Result, error) {
	start := time.Now()
	var err error
	defer func() {
		slog.Info("Exec", "sql", query, "len(values)", len(values), "time", time.Since(start), "err", err)
	}()

	res, err := db.ExecContext(ctx, query, values...)
	if err != nil {
		return res, wrapSQLError(err, query, values...)
	}

	return res, nil
}

func queryContext(ctx context.Context, db Querier, query string, values ...any) (*sql.Rows, error) {
	start := time.Now()
	var err error
	defer func() {
		slog.Info("Query", "sql", query, "values", values, "time", time.Since(start), "err", err)
	}()

	r, err := db.QueryContext(ctx, query, values...)
	if err != nil {
		return nil, wrapSQLError(err, query, values...)
	}

	return r, nil
}

type MultiReaderDB struct {
	URI *sqliteuri.URI
	db  *sql.DB
}

func (s *MultiReaderDB) Initialize() {
	var err error

	uri := s.URI.Clone()
	if uri.Mode != sqliteuri.ModeReadOnly {
		uri.Mode = sqliteuri.ModeReadOnly
	}

	s.db, err = uri.Open()
	slog.Info("MultiReaderDB.Initialize()", "uri", uri.String(), "err", err)
	if err != nil {
		panic(err)
	}

}

func (s *MultiReaderDB) Terminate() error {
	return s.db.Close()
}

var _ Querier = (*MultiReaderDB)(nil)
var _ Executor = (*MultiReaderDB)(nil)

func (s *MultiReaderDB) ExecContext(ctx context.Context, query string, values ...any) (sql.Result, error) {
	return execContext(ctx, s.db, query, values...)
}

func (s *MultiReaderDB) QueryContext(ctx context.Context, query string, values ...any) (*sql.Rows, error) {
	return queryContext(ctx, s.db, query, values...)
}
