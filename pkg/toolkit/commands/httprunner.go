package commands

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

type DefIndexRunner struct {
	Defs   DefIndex
	Client HTTPClient
}

var _ Runner = (*DefIndexRunner)(nil)
var _ Reflector = (*DefIndexRunner)(nil)

func (h *DefIndexRunner) Reflect(ctx context.Context) (DefIndex, error) {
	return h.Defs.Reflect(ctx)
}

func (h *DefIndexRunner) String() string {
	return "*DefIndexRunner[" + h.Defs.String() + "]"
}

// Run implements Runner.
func (h *DefIndexRunner) Run(ctx context.Context, name string, params Fields) (Fields, error) {
	def, ok := h.Defs[name]
	if !ok {
		return nil, ErrNoSuchCommand
	}

	if def.Run == nil || def.Run.HTTP == nil {
		return nil, ErrNoImplementation
	}

	return RunCommandHTTP(ctx, h.Client, def.Run.Bind, def.Run.HTTP, params)
}

func RunCommandHTTP(ctx context.Context, client HTTPClient, rbd *RunBindDef, rhd *RunHTTPDef, params Fields) (Fields, error) {
	if client == nil {
		client = http.DefaultClient
	}

	req, err := MarshalHTTPRequest(ctx, rbd, rhd, params)
	if err != nil {
		return nil, err
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	return UnmarshalHTTPResponse(ctx, rbd, rhd, resp)
}

func MarshalHTTPRequest(ctx context.Context, rbd *RunBindDef, rhd *RunHTTPDef, params Fields) (*http.Request, error) {
	body := rhd.Request.Body
	headers := rhd.Request.Headers
	query := rhd.Request.Query
	request := Fields{
		"url":     rhd.Request.URL,
		"method":  rhd.Request.Method,
		"headers": headers,
		"query":   query,
		"body":    body,
	}

	scope := Fields{
		"request": request,
	}

	// def.Parameters
	for k, pdef := range rhd.Parameters {
		var v any

		bound := false
		if rbd.Parameters != nil {
			if val, ok := rbd.Parameters[k]; ok {
				bound = true
				v = val
			}
		}
		if !bound {
			if _, ok := params[k]; !ok {
				continue
			}
			v = params[k]
		}

		err := scope.Set(pdef.Path, v)
		if err != nil {
			return nil, err
		}
	}

	b, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	if len(query) > 0 {
		return nil, fmt.Errorf("setting query based on parameters not yet supported")
	}

	req, err := http.NewRequestWithContext(ctx, request.String("method"), request.String("url"), bytes.NewBuffer(b))
	if err != nil {
		return nil, err
	}

	if len(headers) == 0 {
		req.Header.Set("Content-Type", "application/json")
	} else {
		for k, v := range headers {
			req.Header[k] = v
		}
	}

	return req, nil
}

func UnmarshalHTTPResponse(ctx context.Context, rbd *RunBindDef, rhd *RunHTTPDef, r *http.Response) (Fields, error) {
	if r.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: %s", r.Status)
	}

	body, err := unmarshal[Fields](r)
	if err != nil {
		return nil, err
	}

	scope := Fields{
		"response": Fields{
			"status":  r.StatusCode,
			"headers": r.Header,
			"body":    body,
		},
	}

	returns := Fields{}
	var errs []error
	// def.Returns
	for k, rdef := range rhd.Returns {
		var v any
		bound := false
		if rbd.Returns != nil {
			if val, ok := rbd.Returns[k]; ok {
				bound = true
				v = val
			}
		}

		if !bound {
			v, err = scope.Get(rdef.Path)
			if err != nil {
				errs = append(errs, err)
				continue
			}
		}

		returns[k] = v
	}

	return returns, errors.Join(errs...)

}
