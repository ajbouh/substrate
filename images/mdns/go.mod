module github.com/ajbouh/substrate/images/mdns

go 1.22.0

toolchain go1.23.2

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/grandcat/zeroconf v1.0.0
)

require golang.org/x/net v0.34.0 // indirect

require (
	github.com/cenkalti/backoff v2.2.1+incompatible // indirect
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/miekg/dns v1.1.62 // indirect
	github.com/puzpuzpuz/xsync/v3 v3.4.0 // indirect
	golang.org/x/mod v0.22.0 // indirect
	golang.org/x/sync v0.10.0 // indirect
	golang.org/x/sys v0.29.0 // indirect
	golang.org/x/text v0.21.0 // indirect
	golang.org/x/tools v0.29.0 // indirect
	tractor.dev/toolkit-go v0.0.0-20250103001615-9a6753936c19 // indirect
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
