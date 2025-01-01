package handle

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
)

type HTTPResource interface {
	GetHTTPPattern() string
	GetHTTPHandler() http.Handler
}

type HTTPRunHandler struct {
	Debug     bool
	Aggregate *commands.Aggregate

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

func (c *HTTPRunHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	grouped := commands.Group(c.Aggregate.GatherRunners(context.Background()), func(r commands.Runner) string {
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
			runner := &commands.DynamicRunner{
				Runners: func(ctx context.Context) []commands.Runner { return runners },
			}
			mux.Handle(c.CatchallRunnerPattern, RunnerHandler(c.Debug, runner))
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

// Returns a http.Handler to run any command handled by commands.Runner
func RunnerHandler(debug bool, runner commands.Runner) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var commandRequest commands.Request
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

		ctx := r.Context()
		ctx = WithPathValuer(ctx, r)

		res, err := runner.Run(ctx, commandRequest.Command, commandRequest.Parameters)
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
