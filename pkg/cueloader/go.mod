module github.com/ajbouh/substrate/pkg/cueloader

go 1.22.0

toolchain go1.23.2

require (
	cuelang.org/go v0.11.0-alpha.4
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/fsnotify/fsnotify v1.7.0
)

require (
	cuelabs.dev/go/oci/ociregistry v0.0.0-20240906074133-82eb438dd565 // indirect
	github.com/cockroachdb/apd/v3 v3.2.1 // indirect
	github.com/emicklei/proto v1.13.2 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/mitchellh/go-wordwrap v1.0.1 // indirect
	github.com/opencontainers/go-digest v1.0.0 // indirect
	github.com/opencontainers/image-spec v1.1.0 // indirect
	github.com/pelletier/go-toml/v2 v2.2.3 // indirect
	github.com/protocolbuffers/txtpbfmt v0.0.0-20240823084532-8e6b51fa9bef // indirect
	github.com/rogpeppe/go-internal v1.13.1 // indirect
	golang.org/x/mod v0.21.0 // indirect
	golang.org/x/net v0.29.0 // indirect
	golang.org/x/oauth2 v0.23.0 // indirect
	golang.org/x/sys v0.25.0 // indirect
	golang.org/x/text v0.18.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
	tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe // indirect
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
