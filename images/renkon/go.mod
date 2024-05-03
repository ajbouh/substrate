module github.com/ajbouh/substrate/images/renkon

go 1.21

toolchain go1.21.6

require (
	github.com/ajbouh/substrate/pkg/httpframework v0.0.0-00010101000000-000000000000
	tractor.dev/toolkit-go v0.0.0-20240304053737-324323efde45
)

replace github.com/ajbouh/substrate/pkg/httpframework => ../../pkg/httpframework
