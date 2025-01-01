module github.com/ajbouh/substrate/images/msgtun

go 1.22

toolchain go1.22.6

require (
	github.com/ajbouh/substrate/pkg/duplex v0.0.0-00010101000000-000000000000
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
)

require (
	github.com/evanw/esbuild v0.24.2 // indirect
	golang.org/x/sys v0.29.0 // indirect
)

require (
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/puzpuzpuz/xsync/v3 v3.4.0 // indirect
	golang.org/x/net v0.34.0
	golang.org/x/sync v0.10.0 // indirect
	golang.org/x/text v0.21.0 // indirect
)

require (
	github.com/fxamacker/cbor/v2 v2.5.0 // indirect
	github.com/mitchellh/mapstructure v1.5.0 // indirect
	github.com/oklog/ulid/v2 v2.1.0
	github.com/x448/float16 v0.8.4 // indirect
	tractor.dev/toolkit-go v0.0.0-20250103001615-9a6753936c19
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit

replace github.com/ajbouh/substrate/pkg/duplex => ../../pkg/duplex
