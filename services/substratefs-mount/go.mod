module github.com/ajbouh/substrate/services/substratefs-mount

go 1.18

require (
	github.com/ajbouh/substrate/pkg v0.0.0-00010101000000-000000000000
	github.com/sirupsen/logrus v1.9.0
)

require golang.org/x/sys v0.5.0 // indirect

replace github.com/ajbouh/substrate/pkg => ../../pkg
