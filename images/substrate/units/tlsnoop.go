package units

import (
	"crypto/tls"

	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
)

// A simple way to disable tls logic
type NoopTLSConfig struct{}

var _ httpframework.TLSConfig = (*NoopTLSConfig)(nil)

func (c *NoopTLSConfig) FrameworkTLSConfig() (*tls.Config, error) {
	return nil, nil
}
