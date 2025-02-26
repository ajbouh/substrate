module github.com/ajbouh/substrate/images/nvml

go 1.22

toolchain go1.22.6

require github.com/NVIDIA/go-nvml v0.12.4-0

require github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000

require (
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/puzpuzpuz/xsync/v3 v3.4.0 // indirect
	github.com/stretchr/testify v1.10.0 // indirect
	golang.org/x/net v0.34.0 // indirect
	golang.org/x/sync v0.10.0 // indirect
	golang.org/x/text v0.21.0 // indirect
	tractor.dev/toolkit-go v0.0.0-20250103001615-9a6753936c19 // indirect
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
