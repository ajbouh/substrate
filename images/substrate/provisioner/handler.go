package provisioner

import (
	"errors"
	"io"
	"log"
	"net/http"
	"strings"

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

func newDoomedHandler(status int, err error, w http.ResponseWriter) {
	if err != nil {
		errs := cueerrors.Errors(err)
		messages := make([]string, 0, len(errs))
		for _, err := range errs {
			messages = append(messages, err.Error())
		}
		log.Printf("err in handler: %s; %s", err, strings.Join(messages, "\n\t"))
	}
	w.WriteHeader(status)
}

func newBadGatewayHandler(err error, w http.ResponseWriter) {
	newDoomedHandler(http.StatusBadGateway, err, w)
}
