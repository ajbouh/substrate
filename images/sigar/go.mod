module github.com/ajbouh/substrate/images/sigar

go 1.22

toolchain go1.22.6

require (
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/cloudfoundry/gosigar v1.3.36
)

require (
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/puzpuzpuz/xsync/v3 v3.4.0 // indirect
	github.com/stretchr/testify v1.8.4 // indirect
	golang.org/x/net v0.27.0 // indirect
	golang.org/x/sync v0.8.0 // indirect
	golang.org/x/text v0.16.0 // indirect
)

require (
	github.com/onsi/gomega v1.30.0 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	golang.org/x/sys v0.22.0 // indirect
	tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe // indirect
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
