module github.com/ajbouh/substrate/images/sys

go 1.22

toolchain go1.22.6

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/google/go-cmp v0.6.0
)

require (
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/puzpuzpuz/xsync/v3 v3.4.0 // indirect
	golang.org/x/net v0.17.0 // indirect
	golang.org/x/sync v0.8.0 // indirect
	golang.org/x/text v0.13.0 // indirect
)

require tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
