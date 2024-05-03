module github.com/ajbouh/substrate/images/sys

go 1.21.0

toolchain go1.22.2

require (
	github.com/ajbouh/substrate/pkg/cueloader v0.0.0-20240731171619-57f7f003f0b5
	github.com/ajbouh/substrate/pkg/exports v0.0.0-20240731171619-57f7f003f0b5
	github.com/ajbouh/substrate/pkg/httpframework v0.0.0-20240731171619-57f7f003f0b5
	github.com/google/go-cmp v0.6.0
)

require (
	cuelabs.dev/go/oci/ociregistry v0.0.0-20240703134027-fa95d0563666 // indirect
	cuelang.org/go v0.9.2 // indirect
	github.com/cockroachdb/apd/v3 v3.2.1 // indirect
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/emicklei/proto v1.13.2 // indirect
	github.com/fsnotify/fsnotify v1.7.0 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/mitchellh/go-wordwrap v1.0.1 // indirect
	github.com/opencontainers/go-digest v1.0.0 // indirect
	github.com/opencontainers/image-spec v1.1.0 // indirect
	github.com/protocolbuffers/txtpbfmt v0.0.0-20230328191034-3462fbc510c0 // indirect
	github.com/rogpeppe/go-internal v1.12.0 // indirect
	golang.org/x/mod v0.19.0 // indirect
	golang.org/x/net v0.27.0 // indirect
	golang.org/x/oauth2 v0.21.0 // indirect
	golang.org/x/text v0.16.0 // indirect
	golang.org/x/tools v0.23.0 // indirect
	gopkg.in/check.v1 v1.0.0-20201130134442-10cb98267c6c // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

require (
	golang.org/x/sys v0.22.0 // indirect
	tractor.dev/toolkit-go v0.0.0-20240731233937-ae3586204eaa
)

replace github.com/ajbouh/substrate/pkg/cueloader => ../../pkg/cueloader

replace github.com/ajbouh/substrate/pkg/exports => ../../pkg/exports

replace github.com/ajbouh/substrate/pkg/httpframework => ../../pkg/httpframework
