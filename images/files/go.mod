module github.com/ajbouh/substrate/images/files

go 1.22

toolchain go1.22.6

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/elnormous/contenttype v1.0.4
	gopkg.in/fsnotify.v1 v1.4.7
	tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe
)

require (
	github.com/fsnotify/fsnotify v1.7.0 // indirect
	golang.org/x/sys v0.18.0 // indirect
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
