package db

import (
	"context"
	"database/sql"
	"database/sql/driver"
	"fmt"
	"log/slog"
	"time"

	"github.com/mattn/go-sqlite3"
)

type SingleWriterSQLiteConn struct {
	Conn *sqlite3.SQLiteConn
}

var _ Executor = (*SingleWriterSQLiteConn)(nil)

func (s *SingleWriterSQLiteConn) ExecContext(ctx context.Context, query string, values ...any) (sql.Result, error) {
	return connExecContext(ctx, s.Conn, query, values...)
}

func wrapConnSQLError(err error, sql string, args []driver.NamedValue) error {
	if len(args) == 0 {
		return fmt.Errorf("error with sql: `%s`: %w", sql, err)
	}
	return fmt.Errorf("error with sql: `%s`: (%#v): %w", sql, args, err)
}

func connExecContext(ctx context.Context, conn *sqlite3.SQLiteConn, query string, values ...any) (sql.Result, error) {
	start := time.Now()
	var err error
	defer func() {
		slog.Info("Exec", "sql", query, "len(values)", len(values), "time", time.Since(start), "err", err)
	}()

	args := make([]driver.NamedValue, len(values))
	for i, value := range values {
		args[i] = driver.NamedValue{Ordinal: i + 1, Value: value}
	}
	res, err := conn.ExecContext(ctx, query, args)
	if err != nil {
		return res, wrapSQLError(err, query, values...)
	}

	return res, nil
}
