module github.com/ajbouh/substrate/images/events

go 1.23.2

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/asg017/sqlite-vec-go-bindings v0.1.4-alpha.2
	github.com/mattn/go-sqlite3 v1.14.24
)

require (
	golang.org/x/net v0.34.0 // indirect
	golang.org/x/sync v0.10.0 // indirect
	golang.org/x/sys v0.29.0 // indirect
	golang.org/x/text v0.21.0 // indirect
	tractor.dev/toolkit-go v0.0.0-20250103001615-9a6753936c19 // indirect
)

require (
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/oklog/ulid/v2 v2.1.0 // indirect
	github.com/puzpuzpuz/xsync/v3 v3.4.0
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
