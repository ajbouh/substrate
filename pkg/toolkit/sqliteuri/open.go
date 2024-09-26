package sqliteuri

import (
	"context"
	"database/sql"
	"fmt"
)

func (uri *URI) Open() (*sql.DB, error) {
	return sql.Open("sqlite3", uri.String())
}

func (uri *URI) AttachTo(ctx context.Context, db *sql.DB, name string) error {
	query := "ATTACH DATABASE ? AS ?;"
	_, err := db.ExecContext(ctx, "ATTACH DATABASE ? AS ?;", uri.String(), name)

	fmt.Printf("attached db=%#v err=%s query=%s name=%s uri=%s\n", db, err, query, name, uri.String())

	if err != nil {
		return fmt.Errorf("error with sql: `%s`: %s (%#v): %w", query, uri.String(), name, err)
	}

	return nil
}
