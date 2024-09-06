module github.com/ajbouh/substrate/images/weather

go 1.22.2

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-20240808180218-f8f2851695f0
	tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe
)

require github.com/elnormous/contenttype v1.0.4 // indirect

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
