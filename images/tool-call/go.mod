module github.com/ajbouh/substrate/images/tool-call

go 1.22.2

require (
	github.com/adrg/frontmatter v0.2.0
	github.com/ajbouh/substrate/pkg/toolkit v0.0.0-20240808180218-f8f2851695f0
	gotest.tools v2.2.0+incompatible
	tractor.dev/toolkit-go v0.0.0-20240810203015-1b3d95b70efe
)

require (
	github.com/BurntSushi/toml v0.3.1 // indirect
	github.com/elnormous/contenttype v1.0.4 // indirect
	github.com/google/go-cmp v0.6.0 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/puzpuzpuz/xsync/v3 v3.4.0 // indirect
	golang.org/x/net v0.17.0 // indirect
	golang.org/x/sync v0.8.0 // indirect
	golang.org/x/text v0.13.0 // indirect
	gopkg.in/yaml.v2 v2.3.0 // indirect
)

replace github.com/ajbouh/substrate/pkg/toolkit => ../../pkg/toolkit
