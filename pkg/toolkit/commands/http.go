package commands

import (
	"fmt"
	"io"
	"net/http"
)

type Request struct {
	Command    string `json:"command"`
	Parameters Fields `json:"parameters"`
}

type ResponseError struct {
	Message string `json:"message"`
}

type Response struct {
	Error   *ResponseError `json:"error,omitempty"`
	Returns Fields         `json:"returns,omitempty"`
}

func demandHTTPResponseOk(req *http.Request, res *http.Response) error {
	if res.StatusCode == http.StatusOK {
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
