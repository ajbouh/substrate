package substratehttp

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"cuelang.org/go/cue"
	"github.com/elnormous/contenttype"
	"github.com/julienschmidt/httprouter"

	"github.com/ajbouh/substrate/pkg/blackboard"
	"github.com/ajbouh/substrate/pkg/httputil"
	"github.com/ajbouh/substrate/pkg/substrate"
)

var responsePath = cue.MakePath(cue.Str("response"))

func newBlackboardHandler(sub *substrate.Substrate) ([]string, func(rw http.ResponseWriter, req *http.Request, p httprouter.Params)) {
	return []string{"/bb", "/bb/*rest"}, func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		log.Printf("%s %s %s", req.RemoteAddr, req.Method, req.URL.String())

		var body any

		if req.Body != nil {
			bodyBytes, err := io.ReadAll(req.Body)
			if err != nil {
				req.Body.Close()
				jsonrw := httputil.NewJSONResponseWriter(rw)
				jsonrw(nil, http.StatusBadRequest, err)
				return
			}
			req.Body.Close()

			mediaType, err := contenttype.GetMediaType(req)
			if err != nil {
				jsonrw := httputil.NewJSONResponseWriter(rw)
				jsonrw(nil, http.StatusUnsupportedMediaType, err)
				return
			}

			switch mediaType.Type + "/" + mediaType.Subtype {
			case "application/json":
				err = json.Unmarshal(bodyBytes, &body)
				if err != nil {
					jsonrw := httputil.NewJSONResponseWriter(rw)
					jsonrw(nil, http.StatusBadRequest, err)
					return
				}
			default:
				jsonrw := httputil.NewJSONResponseWriter(rw)
				jsonrw(nil, http.StatusBadRequest, fmt.Errorf("bad Content-Type %s", mediaType.Type))
				return
			}
		}

		// log.Printf("breq body %#v", body)

		availableMediaTypes := []contenttype.MediaType{
			contenttype.NewMediaType("application/json"),
		}

		accepted, _, err := contenttype.GetAcceptableMediaType(req, availableMediaTypes)
		if err != nil {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusUnsupportedMediaType, err)
			return
		}

		call := &blackboard.Call{
			Request: &blackboard.Request{
				Method:  &req.Method,
				URL:     nil,
				Headers: req.Header,
				Body:    body,
			},
		}
		rest := p.ByName("rest")
		if rest != "" {
			rest = "/" + strings.TrimPrefix(rest, "/")
			call.Request.URL = &blackboard.URLParts{Path: &rest}
		}

		// use the *first* concrete Response
		match, ok := sub.Blackboard.Call(
			req.Context(),
			blackboard.Input{Value: call},
			func(ctx context.Context, match cue.Value) (cue.Value, error) {
				response := match.LookupPath(responsePath)
				// demand we can convert to JSON. this is unfortunately a bit wasteful...
				_, err := response.MarshalJSON()
				return match, err

				// if blackboard.IsTransitivelyConcrete(match.LookupPath(responsePath)) {
				// 	return match, nil
				// }
				// return match, blackboard.NotTransitivelyConcrete
			},
		)

		if !ok {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, err)
			return
		}

		bres := blackboard.Response{}
		err = match.Result.LookupPath(responsePath).Decode(&bres)
		if err != nil {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, err)
			return
		}

		header := rw.Header()
		for k, vs := range bres.Headers {
			for _, v := range vs {
				header.Add(k, v)
			}
		}

		log.Printf("bres %#v", bres)

		var b []byte

		switch accepted.Type + "/" + accepted.Subtype {
		case "application/json":
			b, err = json.Marshal(bres.Body)
		default:
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusUnsupportedMediaType, fmt.Errorf("unsupported Accept media type"))
			return
		}

		if err != nil {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, err)
			return
		}

		header.Set("Content-Length", strconv.Itoa(len(b)))
		rw.WriteHeader(*bres.Status)
		_, err = rw.Write(b)
		if err != nil {
			log.Printf("error while writing %s", err)
		}
	}
}
