package handle

import "fmt"

type HTTPStatusError struct {
	Err     error
	Status  int
	Message string
}

var _ error = (*HTTPStatusError)(nil)

func (h *HTTPStatusError) Error() string {
	var message string
	if h.Message != "" {
		message = ": " + h.Message
	}
	if h.Err == nil {
		return fmt.Sprintf("HTTP Status %d%s", h.Status, message)
	}
	return fmt.Sprintf("HTTP Status %d%s: %s", h.Status, message, h.Err.Error())
}

func (h *HTTPStatusError) Unwrap() error {
	return h.Err
}
