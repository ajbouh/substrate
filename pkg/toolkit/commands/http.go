package commands

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

type RunHTTPDef struct {
	Parameters map[string]RunFieldDef `json:"parameters,omitempty"`
	Returns    map[string]RunFieldDef `json:"returns,omitempty"`
	Request    RunHTTPRequestDef      `json:"request,omitempty"`
}

type RunHTTPRequestDef struct {
	URL     string              `json:"url,omitempty"`
	Method  string              `json:"method,omitempty"`
	Headers map[string][]string `json:"headers,omitempty"`
	Body    any                 `json:"body,omitempty"`
	Query   map[string]string   `json:"query,omitempty"`
}

type RunFieldDef struct {
	Path  string `json:"path,omitempty"`
	Value *any   `json:"value,omitempty"`
}
