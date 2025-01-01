module github.com/ajbouh/substrate/pkg/duplex

go 1.22

toolchain go1.22.6

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/evanw/esbuild v0.24.2
)

require (
	github.com/puzpuzpuz/xsync/v3 v3.4.0 // indirect
	golang.org/x/net v0.34.0 // indirect
	golang.org/x/sync v0.10.0 // indirect
	golang.org/x/sys v0.29.0 // indirect
	golang.org/x/text v0.21.0 // indirect
	tractor.dev/toolkit-go v0.0.0-20250103001615-9a6753936c19 // indirect
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
