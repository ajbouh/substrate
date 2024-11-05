package commands

import (
	"fmt"
	"io"
	"net/http"
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
