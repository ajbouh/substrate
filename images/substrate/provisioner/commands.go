package provisioner

import (
	"context"
	"fmt"
	"io"
	"net/http"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
)

type NewReturns struct {
	Location string `json:"location"`
}

var NewCommand = commands.Command(
	"new:instance",
	"Spawn a new instance of the given service and parameters. Return the location of the new service.",
	func(ctx context.Context,
		t *struct {
			HTTPClient commands.HTTPClient
		},
		args struct {
			Service    string            `json:"service"`
			Parameters map[string]string `json:"parameters"`
		},
	) (NewReturns, error) {
		nr := NewReturns{}
		sreq := activityspec.NewSpawnRequest(args.Service, args.Parameters)

		// Anticipate a possible redirect, so make a HEAD request and look at the final (possibly redirected) URL

		req, err := http.NewRequestWithContext(ctx, http.MethodHead, sreq.URLPrefix+"/", nil)
		if err != nil {
			return nr, err
		}

		res, err := t.HTTPClient.Do(req)
		if err != nil {
			return nr, err
		}

		err = demandHTTPResponseOk(req, res)
		if err != nil {
			return nr, err
		}

		if res.Body != nil {
			defer res.Body.Close()
		}
		nr.Location = res.Request.URL.String()

		return nr, nil
	},
)

func demandHTTPResponseOk(req *http.Request, res *http.Response) error {
	if res.StatusCode >= 200 && res.StatusCode < 300 {
		return nil
	}
	defer res.Body.Close()
	b, err := io.ReadAll(res.Body)

	body := " body=" + string(b)
	if err != nil {
		body = "error reading body: " + err.Error()
	}
	return fmt.Errorf("non-200 status from %s %s: code=%d status=%s%s", req.Method, req.URL, res.StatusCode, res.Status, body)
}
