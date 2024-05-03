module github.com/ajbouh/substrate/images/sigar

go 1.22

toolchain go1.22.6

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/cloudfoundry/gosigar v1.3.36
)

require (
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/stretchr/testify v1.8.4 // indirect
	golang.org/x/net v0.27.0 // indirect
	golang.org/x/tools v0.21.1-0.20240508182429-e35e4ccd0d2d // indirect
)

require (
	github.com/onsi/gomega v1.30.0 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	golang.org/x/sys v0.22.0 // indirect
	tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
