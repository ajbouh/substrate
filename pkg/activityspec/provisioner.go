package activityspec

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"sync"
)

// lazily boot machine
// - service
// - initial data

// Buffer incoming request.
// Hash, look up instance.
// If we have an instance:
// - proxy traffic to it
// - if instance is gone or something goes wrong, pretend we never had one
// If we don't have one, start one and remember it.

type doomedReadCloser struct {
	r   io.Reader
	err error
}

func (d *doomedReadCloser) Close() error {
	return nil
}

func (d *doomedReadCloser) Read(b []byte) (int, error) {
	n, err := d.r.Read(b)
	if errors.Is(err, io.EOF) {
		return n, d.err
	}

	return n, nil
}

func newBadGatewayHandler(err error) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		if err != nil {
			fmt.Printf("err=%s\n", err)
		}
		rw.WriteHeader(http.StatusBadGateway)
	})
}

type Provisioner struct {
	mu               *sync.Mutex
	provisionerFuncs map[string]ProvisionFunc
}

func NewProvisioner() *Provisioner {
	return &Provisioner{
		mu: &sync.Mutex{},

		provisionerFuncs: map[string]ProvisionFunc{},
	}
}

type ProvisionFunc func(context.Context) (AuthenticatedURLJoinerFunc, bool, func(error), error)

type ProvisionEvent interface {
	Error() error
	IsPending() bool
	IsReady() bool
	IsGone() bool
	String() string
}

type ProvisionDriver interface {
	Spawn(ctx context.Context, req *ActivitySpec) (*ActivitySpawnResponse, error)
	Status(ctx context.Context, name string) (ProvisionEvent, error)
	StatusStream(ctx context.Context, name string) (<-chan ProvisionEvent, error)
}
