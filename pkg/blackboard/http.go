package blackboard

import (
	"errors"
	"log"
	"net/http"
	"net/url"

	"cuelang.org/go/cue"
)

var NotTransitivelyConcrete = errors.New("not concrete")

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

func IsTransitivelyConcrete(o cue.Value) bool {
	concrete := o.IsConcrete()
	if !concrete {
		log.Printf("not concrete! %s %#v", o.Path(), o)
	}

	// log.Printf("IsTransitivelyConcrete %#v", o)
	if concrete {
		o.Walk(func(v cue.Value) bool {
			// log.Printf("checking concreteness %#v", v)
			if !v.IsConcrete() {
				concrete = false
				log.Printf("not concrete! %s %#v", v.Path(), v)
				return false
			}
			return true
		}, func(v cue.Value) {})
	}
	return concrete
}

// type HTTPHandler struct {
// 	Blackboard *Blackboard
// }

// var _ http.Handler = &HTTPHandler{}

// func (h *HTTPHandler) ServeHTTP(rw http.ResponseWriter, httpReq *http.Request) {
// 	availableMediaTypes := []contenttype.MediaType{
// 		contenttype.NewMediaType("application/json"),
// 	}

// 	accepted, _, err := contenttype.GetAcceptableMediaType(httpReq, availableMediaTypes)
// 	if err != nil {
// 		if err != nil {
// 			// TODO
// 			return
// 		}
// 	}

// 	req := &Request{
// 		Method: httpReq.Method,
// 		URL: &URLParts{
// 			Path:  httpReq.URL.Path,
// 			Query: httpReq.URL.Query(),
// 		},
// 		Headers: httpReq.Header,
// 	}

// 	if httpReq.Body != nil {
// 		mediaType, err := contenttype.GetMediaType(httpReq)
// 		if err != nil {
// 			// Failure should yield an HTTP 415 (`http.StatusUnsupportedMediaType`)
// 			// TODO
// 			return
// 		}
// 		body, err := io.ReadAll(httpReq.Body)
// 		if err != nil {
// 			// TODO
// 			return
// 		}

// 		switch mediaType.Type {
// 		case "application/json":
// 			req.Body = map[string]any{}
// 			err = json.Unmarshal(body, &req.Body)
// 			if err != nil {
// 				// TODO
// 				return
// 			}
// 		}
// 	}

// 	// use the *first* concrete Response
// 	match, ok := h.Blackboard.Call(
// 		httpReq.Context(),
// 		Input{Value: req},
// 		func(ctx context.Context, match cue.Value) (cue.Value, error) {
// 			if IsTransitivelyConcrete(match) {
// 				return match, nil
// 			}
// 			return match, NotTransitivelyConcrete
// 		},
// 	)

// 	if !ok {
// 		// TODO
// 		return
// 	}

// 	res := &Response{}
// 	err = match.Result.Decode(&res)
// 	if err != nil {
// 		// TODO
// 		return
// 	}

// 	header := rw.Header()
// 	for k, vs := range res.Headers {
// 		for _, v := range vs {
// 			header.Add(k, v)
// 		}
// 	}

// 	var b []byte

// 	switch accepted.Type {
// 	case "application/json":
// 		b, err = res.Body.MarshalJSON()
// 	}

// 	if err != nil {
// 		// TODO
// 		return
// 	}

// 	header.Set("Content-Length", strconv.Itoa(len(b)))
// 	rw.WriteHeader(res.Status)
// 	rw.Write(b)
// }
