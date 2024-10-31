package sqliteuri

import (
	"context"
	"database/sql"
	"database/sql/driver"
	"fmt"
	"sync"

	sqlite "github.com/mattn/go-sqlite3"
)

func (uri *URI) Open() (*sql.DB, error) {
	return DefaultOpener.Open(uri)
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

type SQLiteDriver interface {
	SQLiteDriver() *sqlite.SQLiteDriver
}

type Opener struct {
	Driver        string
	SQLiteDrivers []SQLiteDriver

	initializeOnce sync.Once
}

var DefaultOpener = &Opener{Driver: "sqlite3", SQLiteDrivers: []SQLiteDriver{}}

func (o *Opener) Open(uri *URI) (*sql.DB, error) {
	return o.OpenRaw(uri.String())
}

func (o *Opener) Initialize() {
	o.initializeOnce.Do(func() {
		// can't register the default opener.
		if o.Driver == "sqlite3" {
			return
		}

		drivers := make([]*sqlite.SQLiteDriver, 0, len(o.SQLiteDrivers))
		for _, d := range o.SQLiteDrivers {
			if d == nil {
				continue
			}
			drivers = append(drivers, d.SQLiteDriver())
		}

		// should only be called once per process, since it inlines the registration
		sql.Register(o.Driver, JoinDrivers(drivers...))
	})
}

func (o *Opener) OpenRaw(uri string) (*sql.DB, error) {
	if o == nil {
		return DefaultOpener.OpenRaw(uri)
	}

	o.Initialize()
	return sql.Open(o.Driver, uri)
}

func ConnectHook(ch func(sc *sqlite.SQLiteConn) error) *sqlite.SQLiteDriver {
	return &sqlite.SQLiteDriver{
		ConnectHook: ch,
	}
}

func PureFunc(name string, impl any) *sqlite.SQLiteDriver {
	return &sqlite.SQLiteDriver{
		ConnectHook: func(sc *sqlite.SQLiteConn) error {
			return sc.RegisterFunc(name, impl, true)
		},
	}
}

func ExecOnConnect(query string, args []driver.Value) *sqlite.SQLiteDriver {
	return ConnectHook(func(sc *sqlite.SQLiteConn) error {
		_, err := sc.Exec(query, args)
		return err
	})
}

func ImpureFunc(name string, impl any) *sqlite.SQLiteDriver {
	return &sqlite.SQLiteDriver{
		ConnectHook: func(sc *sqlite.SQLiteConn) error {
			return sc.RegisterFunc(name, impl, false)
		},
	}
}

func DynamicImpureFunc(name string, dynamicImpl func(sc *sqlite.SQLiteConn) any) *sqlite.SQLiteDriver {
	return &sqlite.SQLiteDriver{
		ConnectHook: func(sc *sqlite.SQLiteConn) error {
			return sc.RegisterFunc(name, dynamicImpl(sc), false)
		},
	}
}

func JoinDrivers(drivers ...*sqlite.SQLiteDriver) *sqlite.SQLiteDriver {
	if len(drivers) == 1 {
		return drivers[0]
	}

	driver := &sqlite.SQLiteDriver{
		ConnectHook: func(sc *sqlite.SQLiteConn) error {
			for _, d := range drivers {
				if err := d.ConnectHook(sc); err != nil {
					return err
				}
			}
			return nil
		},
	}
	for _, d := range drivers {
		driver.Extensions = append(driver.Extensions, d.Extensions...)
	}

	return driver
}
