package activityspec

import (
	"context"
	"errors"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"sync"

	cueerrors "cuelang.org/go/cue/errors"
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

func newDoomedHandler(status int, err error) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		if err != nil {
			errs := cueerrors.Errors(err)
			messages := make([]string, 0, len(errs))
			for _, err := range errs {
				messages = append(messages, err.Error())
			}
			log.Printf("err in handler: %s", strings.Join(messages, "\n\t"))
		}
		rw.WriteHeader(status)
	})
}

func newBadGatewayHandler(err error) http.Handler {
	return newDoomedHandler(http.StatusBadGateway, err)
}

type ProvisionerCache struct {
	mu               *sync.Mutex
	provisionerFuncs map[string]ProvisionFunc

	MakeProvisionFunc MakeProvisionFunc
}

type MakeProvisionFunc interface {
	MakeProvisionFunc(req *ServiceSpawnRequest) ProvisionFunc
}

func NewProvisionerCache() *ProvisionerCache {
	return &ProvisionerCache{
		mu:               &sync.Mutex{},
		provisionerFuncs: map[string]ProvisionFunc{},
	}
}

type ProvisionFunc func(context.Context) (*url.URL, bool, func(error), error)

type ProvisionEvent interface {
	Error() error
	IsPending() bool
	IsReady() bool
	IsGone() bool
	String() string
}

type ProvisionDriver interface {
	Spawn(ctx context.Context, req *ServiceSpawnResolution) (*ServiceSpawnResponse, error)
	Status(ctx context.Context, name string) (ProvisionEvent, error)
	StatusStream(ctx context.Context, name string) (<-chan ProvisionEvent, error)
	Cleanup(ctx context.Context) error
}
