package substratedb

import (
	"context"
	"database/sql"
	"log"
	"sync"

	"github.com/ajbouh/substrate/pkg/toolkit/sqliteuri"

	_ "github.com/mattn/go-sqlite3"
)

func newDB(fileName string) (*sql.DB, error) {
	dburi := sqliteuri.URI{
		FileName: fileName,
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

	err = createTables(context.Background(), db)
	if err != nil {
		defer db.Close()
		return nil, err
	}

	return db, nil
}

func New(fileName string) (*DB, error) {
	db, err := newDB(fileName)
	if err != nil {
		return nil, err
	}

	return &DB{
		mu: &sync.RWMutex{},
		db: db,
	}, nil
}
