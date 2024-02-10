package calldef

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/url"

	"cuelang.org/go/cue"

	"github.com/ajbouh/substrate/images/bb/blackboard"
)

type Call struct {
	Response *Response `json:"response"`
	Request  *Request  `json:"request"`
}

type Response struct {
	Status  *int        `json:"status"`
	Headers http.Header `json:"headers"`
	Body    any         `json:"body"`
}

type URLParts struct {
	Path  *string     `json:"path"`
	Query *url.Values `json:"query"`
}

type Request struct {
	Method  *string     `json:"method"`
	URL     *URLParts   `json:"url"`
	Headers http.Header `json:"headers"`
	Body    any         `json:"body"`
}

var requestPath = cue.MakePath(cue.Str("request"))
var responsePath = cue.MakePath(cue.Str("response"))

func Refinement(baseURL string) blackboard.Refinement {
	return func(ctx context.Context, match cue.Value) (cue.Value, error) {
		request := match.LookupPath(requestPath)
		breq := &Request{}
		err := request.Decode(&breq)
		if err != nil {
			return match, err
		}

		b, err := json.Marshal(breq.Body)
		if err != nil {
			return match, err
		}

		hreq, err := http.NewRequestWithContext(ctx, *breq.Method, baseURL+*breq.URL.Path, bytes.NewReader(b))
		if err != nil {
			return match, err
		}

		header := hreq.Header
		for k, vs := range breq.Headers {
			for _, v := range vs {
				header.Add(k, v)
			}
		}

		hres, err := http.DefaultClient.Do(hreq)
		if err != nil {
			return match, err
		}

		// log.Printf("hres %#v", hres)

		bres := Response{
			Status:  &hres.StatusCode,
			Headers: hres.Header,
		}
		if hres.Body != nil {
			err = json.NewDecoder(hres.Body).Decode(&bres.Body)
			if err != nil {
				return match, err
			}
		}

		// log.Printf("bres %#v", bres)

		match = match.FillPath(
			responsePath,
			match.Context().Encode(bres, cue.NilIsAny(false)),
		)
		// log.Printf("match %#v", match)

		return match, nil
	}
}
