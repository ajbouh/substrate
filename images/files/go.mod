module github.com/ajbouh/substrate/images/files

go 1.21

toolchain go1.21.6

require (
	github.com/ajbouh/substrate/pkg/httpframework v0.0.0-00010101000000-000000000000
	github.com/elnormous/contenttype v1.0.4 // indirect
	golang.org/x/sys v0.18.0 // indirect
	gopkg.in/fsnotify.v1 v1.4.7 // indirect
	tractor.dev/toolkit-go v0.0.0-20240304053737-324323efde45 // indirect
)

replace github.com/ajbouh/substrate/pkg/httpframework => ../../pkg/httpframework
