module github.com/ajbouh/substrate/images/events

go 1.23.2

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/asg017/sqlite-vec-go-bindings v0.1.4-alpha.2
	github.com/mattn/go-sqlite3 v1.14.23
)

require (
	golang.org/x/net v0.17.0 // indirect
	golang.org/x/sync v0.8.0 // indirect
	golang.org/x/sys v0.22.0 // indirect
	golang.org/x/text v0.13.0 // indirect
	tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe // indirect
)

require (
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/oklog/ulid/v2 v2.1.0
	github.com/puzpuzpuz/xsync/v3 v3.4.0
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
