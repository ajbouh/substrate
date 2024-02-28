module github.com/ajbouh/substrate/images/sigar

go 1.21

toolchain go1.21.1

require (
	github.com/ajbouh/substrate/pkg/cueloader v0.0.0-00010101000000-000000000000
	github.com/cloudfoundry/gosigar v1.3.36
)

require (
	cuelabs.dev/go/oci/ociregistry v0.0.0-20231103182354-93e78c079a13 // indirect
	cuelang.org/go v0.7.1 // indirect
	github.com/cockroachdb/apd/v3 v3.2.1 // indirect
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/emicklei/proto v1.10.0 // indirect
	github.com/fsnotify/fsnotify v1.7.0 // indirect
	github.com/google/uuid v1.2.0 // indirect
	github.com/mitchellh/go-wordwrap v1.0.1 // indirect
	github.com/mpvl/unique v0.0.0-20150818121801-cbe035fff7de // indirect
	github.com/opencontainers/go-digest v1.0.0 // indirect
	github.com/opencontainers/image-spec v1.1.0-rc4 // indirect
	github.com/protocolbuffers/txtpbfmt v0.0.0-20230328191034-3462fbc510c0 // indirect
	github.com/stretchr/testify v1.8.4 // indirect
	golang.org/x/net v0.18.0 // indirect
	golang.org/x/text v0.14.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

require (
	github.com/onsi/gomega v1.30.0 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	golang.org/x/sys v0.14.0 // indirect
	tractor.dev/toolkit-go v0.0.0-20240111035846-6a7f40f8500e
)

replace github.com/ajbouh/substrate/pkg/cueloader => ../../pkg/cueloader
