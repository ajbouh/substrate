module github.com/ajbouh/substrate/images/gstreamer-pipeline

go 1.22

toolchain go1.22.2

require (
	github.com/go-gst/go-glib v1.1.0
	github.com/go-gst/go-gst v1.1.0
)

require (
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/mattn/go-pointer v0.0.1 // indirect
	golang.org/x/exp v0.0.0-20240416160154-fe59bbe5cc7f // indirect
)

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
