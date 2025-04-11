package commands

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
)

type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

type CapReadURLBase struct {
	URLBase string
}

func (a *CapReadURLBase) Apply(env Env, m Fields) (Fields, error) {
	return Fields{
		"urlbase": a.URLBase,
	}, nil
}

type CapWithURLBase struct {
}

func (a *CapWithURLBase) Apply(env Env, m Fields) (Fields, error) {
	urlbase, err := GetPath[string](m, "urlbase")
	if err != nil {
		return nil, err
	}

	m, err = m.Clone()
	if err != nil {
		return nil, err
	}
	m["cap"] = "msg"

	return env.New(env.Context(), map[string]Cap{
		"read-urlbase": &CapReadURLBase{
			URLBase: urlbase,
		},
	}).Apply(nil, m)
}

type CapHTTP struct {
	HTTPClient HTTPClient

	Rewrite func(*http.Request) (*http.Request, error)
}

var _ Cap = (*CapHTTP)(nil)

func (a *CapHTTP) Apply(env Env, m Fields) (Fields, error) {
	method, err := GetPath[string](m, "http", "request", "method")
	if err != nil {
		return nil, err
	}

	urlStr, err := GetPath[string](m, "http", "request", "url")
	if err != nil {
		return nil, err
	}

	urlStr, err = resolveURLWithEnv(env, urlStr)
	if err != nil {
		return nil, err
	}

	var pathVars map[string]string
	pathVars, _, err = MaybeGetPath[map[string]string](m, "http", "request", "path")
	if err != nil {
		return nil, err
	}

	for pathVar, pathVal := range pathVars {
		urlStr = strings.ReplaceAll(urlStr, "{"+pathVar+"}", url.PathEscape(pathVal))
		// ... indicates it might have /s in it
		urlStr = strings.ReplaceAll(urlStr, "{"+pathVar+"...}", pathVal)
	}

	urlQuery, _, err := MaybeGetPath[map[string][]string](m, "http", "request", "query")
	if err != nil {
		return nil, err
	}
	if len(urlQuery) > 0 {
		if strings.Contains(urlStr, "?") {
			urlStr = urlStr + "?" + url.Values(urlQuery).Encode()
		} else {
			urlStr = urlStr + "&" + url.Values(urlQuery).Encode()
		}
	}

	body, _, err := MaybeGetPath[any](m, "http", "request", "body")
	if err != nil {
		return nil, err
	}
	headers, _, err := MaybeGetPath[map[string][]string](m, "http", "request", "headers")
	if err != nil {
		return nil, err
	}

	buf, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(env.Context(), method, urlStr, bytes.NewBuffer(buf))
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

	if a.Rewrite != nil {
		req, err = a.Rewrite(req)
		if err != nil {
			return nil, err
		}
	}

	client := a.HTTPClient
	if client == nil {
		client = http.DefaultClient
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	err = demandHTTPResponseOk(req, resp)
	if err != nil {
		return nil, err
	}

	respBody, err := unmarshal[Fields](resp)
	if err != nil {
		return nil, err
	}

	return Fields{
		"http": Fields{
			"response": Fields{
				"status":  resp.StatusCode,
				"url":     resp.Request.URL,
				"headers": resp.Header,
				"body":    respBody,
			},
		},
	}, nil
}
