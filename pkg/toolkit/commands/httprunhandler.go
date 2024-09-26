package commands

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
)

type HTTPResource interface {
	GetHTTPPattern() string
	GetHTTPHandler() http.Handler
}

type HTTPRunHandler struct {
	Debug     bool
	Aggregate *Aggregate

	CatchallRunnerPattern string
}

var _ httpframework.MuxContributor = (*HTTPRunHandler)(nil)

func (c *HTTPRunHandler) CatchallRunnerMethod() string {
	pattern := strings.TrimSuffix(c.CatchallRunnerPattern, "{$}")
	method, _, _ := strings.Cut(pattern, " ")
	return method
}

func (c *HTTPRunHandler) CatchallRunnerPath() string {
	pattern := strings.TrimSuffix(c.CatchallRunnerPattern, "{$}")
	_, path, _ := strings.Cut(pattern, " ")
	return path
}

func (c *HTTPRunHandler) ContributeHTTP(mux *http.ServeMux) {
	grouped := Group(c.Aggregate.GatherRunners(context.Background()), func(r Runner) string {
		if resource, ok := r.(HTTPResource); ok {
			pattern := resource.GetHTTPPattern()
			if pattern != "" {
				return pattern
			}
		}
		return ""
	})

	for pattern, runners := range grouped {
		runners := runners
		if pattern == "" {
			mux.Handle(c.CatchallRunnerPattern, CatchallRunnersHandler(c.Debug, runners))
		} else {
			// there shouldn't be more than one runner per (non-catchall) pattern, but
			// we expect mux.Handle will panic if there's more than one.
			for i, runner := range runners {
				mux.Handle(pattern, runner.(HTTPResource).GetHTTPHandler())
				if i > 0 {
					panic(fmt.Errorf("more than one runner for pattern %s: %#v", pattern, runners))
				}
			}
		}
	}
}

// Returns a http.Handler to run any command handled by Runner
func CatchallRunnersHandler(debug bool, runners []Runner) http.Handler {
	runner := &DynamicRunner{
		Runners: func() []Runner { return runners },
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var commandRequest Request
		var errMsg map[string]any
		defer r.Body.Close()
		b, err := io.ReadAll(r.Body)
		if err != nil {
			serveError(debug, w, err, http.StatusBadRequest, errMsg)
			return
		}

		err = json.Unmarshal(b, &commandRequest)
		if err != nil {
			serveError(debug, w, err, http.StatusBadRequest, errMsg)
			return
		}

		res, err := runner.Run(r.Context(), commandRequest.Command, commandRequest.Parameters)
		if err != nil {
			serveError(debug, w, err, http.StatusInternalServerError, errMsg)
			return
		}

		b, err = json.Marshal(res)
		if err != nil {
			serveError(debug, w, fmt.Errorf("error marshaling %#v: %w", res, err), http.StatusInternalServerError, errMsg)
			return
		}
		w.Write(b)
	})
}
