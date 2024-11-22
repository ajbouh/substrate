module github.com/ajbouh/substrate/images/spaceview

go 1.22.1

toolchain go1.22.2

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/progrium/go-vscode v0.0.0-20240905182510-5c2c9c463118
	tractor.dev/toolkit-go v0.0.0-20240916212610-32b5098759db
)

require (
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/fxamacker/cbor/v2 v2.7.0 // indirect
	github.com/mitchellh/mapstructure v1.5.0 // indirect
	github.com/puzpuzpuz/xsync/v3 v3.4.0 // indirect
	github.com/x448/float16 v0.8.4 // indirect
	golang.org/x/net v0.29.0 // indirect
	golang.org/x/sync v0.8.0 // indirect
	golang.org/x/text v0.18.0 // indirect
)

replace github.com/ajbouh/substrate/pkg/cueloader => ../../pkg/cueloader

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit

replace github.com/progrium/go-vscode => github.com/ajbouh/go-vscode v0.0.0-20241122204707-cca2b7c42e19
