module github.com/ajbouh/substrate/images/events

go 1.22

toolchain go1.22.6

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/mattn/go-sqlite3 v1.14.23
	tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe
)

require (
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/oklog/ulid/v2 v2.1.0
	github.com/puzpuzpuz/xsync/v3 v3.4.0
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
