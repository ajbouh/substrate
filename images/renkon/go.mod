module github.com/ajbouh/substrate/images/renkon

go 1.22

toolchain go1.22.6

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe
)

require github.com/elnormous/contenttype v1.0.4 // indirect

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
