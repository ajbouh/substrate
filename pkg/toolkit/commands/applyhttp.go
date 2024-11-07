package commands

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
)

type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

type HTTPCapability struct {
	HTTPClient HTTPClient

	Rewrite func(*http.Request) (*http.Request, error)
}

var _ Capability = (*HTTPCapability)(nil)

func (a *HTTPCapability) CapabilityName() string {
	return "http"
}

func (a *HTTPCapability) Apply(ctx context.Context, m Fields) (*Msg, Fields, error) {
	method, err := GetPath[string](m, "request", "method")
	if err != nil {
		return nil, nil, err
	}

	urlStr, err := GetPath[string](m, "request", "url")
	if err != nil {
		return nil, nil, err
	}

	var pathVars map[string]string
	pathVars, err = GetPath[map[string]string](m, "request", "path")
	if err != nil {
		return nil, nil, err
	}

	for pathVar, pathVal := range pathVars {
		urlStr = strings.ReplaceAll(urlStr, "{"+pathVar+"}", url.PathEscape(pathVal))
		// ... indicates it might have /s in it
		urlStr = strings.ReplaceAll(urlStr, "{"+pathVar+"...}", pathVal)
	}

	urlQuery, err := GetPath[map[string][]string](m, "request", "query")
	if err != nil {
		return nil, nil, err
	}
	if len(urlQuery) > 0 {
		if strings.Contains(urlStr, "?") {
			urlStr = urlStr + "?" + url.Values(urlQuery).Encode()
		} else {
			urlStr = urlStr + "&" + url.Values(urlQuery).Encode()
		}
	}

	body, err := GetPath[any](m, "request", "body")
	if err != nil {
		return nil, nil, err
	}
	headers, err := GetPath[map[string][]string](m, "request", "headers")
	if err != nil {
		return nil, nil, err
	}

	buf, err := json.Marshal(body)
	if err != nil {
		return nil, nil, err
	}

	req, err := http.NewRequestWithContext(ctx, method, urlStr, bytes.NewBuffer(buf))
	if err != nil {
		return nil, nil, err
	}

	if len(headers) == 0 {
		req.Header.Set("Content-Type", "application/json")
	} else {
		for k, v := range headers {
			req.Header[k] = v
		}
	}

	if a.Rewrite != nil {
		req, err = a.Rewrite(req)
		if err != nil {
			return nil, nil, err
		}
	}

	client := a.HTTPClient
	if client == nil {
		client = http.DefaultClient
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, nil, err
	}

	err = demandHTTPResponseOk(req, resp)
	if err != nil {
		return nil, nil, err
	}

	respBody, err := unmarshal[Fields](resp)
	if err != nil {
		return nil, nil, err
	}

	return nil, Fields{
		"response": Fields{
			"status":  resp.StatusCode,
			"headers": resp.Header,
			"body":    respBody,
		},
	}, nil
}
