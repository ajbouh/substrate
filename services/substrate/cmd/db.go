package main

import (
	"context"
	"database/sql"
	"log"

	"github.com/ajbouh/substrate/pkg/sqliteuri"
	"github.com/ajbouh/substrate/services/substrate"

	_ "github.com/mattn/go-sqlite3"
)

func newDB() (*sql.DB, error) {
	dburi := sqliteuri.URI{
		FileName: mustGetenv("SUBSTRATE_DB"),
		URIOptions: sqliteuri.URIOptions{
			Cache:       sqliteuri.CacheShared,
			JournalMode: sqliteuri.JournalModeWAL,
		},
	}
	log.Printf("opening substrate db: %s", dburi.String())
	db, err := dburi.Open()
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(1)

	err = substrate.CreateTables(context.Background(), db)
	if err != nil {
		defer db.Close()
		return nil, err
	}

	return db, nil
}
