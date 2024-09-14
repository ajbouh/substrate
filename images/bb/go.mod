module github.com/ajbouh/substrate/images/bb

go 1.22

toolchain go1.22.2

require (
	cuelang.org/go v0.11.0-alpha.1
	github.com/ajbouh/substrate/pkg/cueloader v0.0.0-00010101000000-000000000000
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-00010101000000-000000000000
	github.com/elnormous/contenttype v1.0.4
	github.com/stretchr/testify v1.9.0
	tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe
)

require (
	cuelabs.dev/go/oci/ociregistry v0.0.0-20240807094312-a32ad29eed79 // indirect
	github.com/cockroachdb/apd/v3 v3.2.1 // indirect
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/emicklei/proto v1.13.2 // indirect
	github.com/fsnotify/fsnotify v1.7.0 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/mitchellh/go-wordwrap v1.0.1 // indirect
	github.com/opencontainers/go-digest v1.0.0 // indirect
	github.com/opencontainers/image-spec v1.1.0 // indirect
	github.com/pelletier/go-toml/v2 v2.2.2 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/protocolbuffers/txtpbfmt v0.0.0-20230328191034-3462fbc510c0 // indirect
	github.com/rogpeppe/go-internal v1.12.1-0.20240709150035-ccf4b4329d21 // indirect
	golang.org/x/mod v0.20.0 // indirect
	golang.org/x/net v0.28.0 // indirect
	golang.org/x/oauth2 v0.22.0 // indirect
	golang.org/x/sys v0.23.0 // indirect
	golang.org/x/text v0.17.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

replace github.com/ajbouh/substrate/pkg/cueloader => ../../pkg/cueloader

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
