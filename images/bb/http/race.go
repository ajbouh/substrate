package http

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	"cuelang.org/go/cue"
	"github.com/elnormous/contenttype"

	"github.com/ajbouh/substrate/images/bb/blackboard"
	"github.com/ajbouh/substrate/images/bb/calldef"
)

func NewFirstMatchWinsHandler(blackboardFunc func() *blackboard.Blackboard) http.Handler {
	var responsePath = cue.MakePath(cue.Str("response"))

	return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		log.Printf("%s %s %s", req.RemoteAddr, req.Method, req.URL.String())

		var body any

		if req.Body != nil {
			bodyBytes, err := io.ReadAll(req.Body)
			if err != nil {
				req.Body.Close()
				jsonrw := NewJSONResponseWriter(rw)
				jsonrw(nil, http.StatusBadRequest, err)
				return
			}
			req.Body.Close()

			mediaType, err := contenttype.GetMediaType(req)
			if err != nil {
				log.Printf("err in getmediatype %s: %#v", err, req)
				jsonrw := NewJSONResponseWriter(rw)
				jsonrw(nil, http.StatusUnsupportedMediaType, err)
				return
			}

			switch mediaType.Type + "/" + mediaType.Subtype {
			case "application/json":
				err = json.Unmarshal(bodyBytes, &body)
				if err != nil {
					jsonrw := NewJSONResponseWriter(rw)
					log.Printf("error in application/json %s: %#v", err, req)
					jsonrw(nil, http.StatusBadRequest, err)
					return
				}
			default:
				jsonrw := NewJSONResponseWriter(rw)
				log.Printf("error in default %s: %#v", err, req)
				jsonrw(nil, http.StatusBadRequest, fmt.Errorf("bad Content-Type %s", mediaType.Type))
				return
			}
		}

		// log.Printf("breq body %#v", body)

		availableMediaTypes := []contenttype.MediaType{
			contenttype.NewMediaType("application/json"),
			contenttype.NewMediaType("application/json; charset=utf-8"),
		}

		accepted, _, err := contenttype.GetAcceptableMediaType(req, availableMediaTypes)
		if err != nil {
			log.Printf("err in GetAcceptableMediaType %s: %#v", err, req)
			jsonrw := NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusUnsupportedMediaType, err)
			return
		}

		call := &calldef.Call{
			Request: &calldef.Request{
				Method:  &req.Method,
				URL:     nil,
				Headers: req.Header,
				Body:    body,
			},
		}

		// use the *first* concrete Response
		match, ok := blackboardFunc().Call(
			req.Context(),
			blackboard.Input{Value: call},
			func(ctx context.Context, match cue.Value) (cue.Value, error) {
				response := match.LookupPath(responsePath)
				// demand we can convert to JSON. this is unfortunately a bit wasteful...
				_, err := response.MarshalJSON()
				return match, err
			},
		)

		if !ok {
			message := fmt.Sprintf("%#v %#v %#v", req, *call, *call.Request)
			if len(message) > 2048 {
				message = message[0:1024] + " (...) " + message[len(message)-1024:]
			}
			log.Printf("no match %s", message)
			jsonrw := NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, err)
			return
		}

		bres := calldef.Response{}
		err = match.Result.LookupPath(responsePath).Decode(&bres)
		if err != nil {
			log.Printf("error lookup response path %s: %#v", err, req)
			jsonrw := NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, err)
			return
		}

		header := rw.Header()
		for k, vs := range bres.Headers {
			for _, v := range vs {
				header.Add(k, v)
			}
		}

		// log.Printf("bres %#v", bres)

		var b []byte

		switch accepted.Type + "/" + accepted.Subtype {
		case "application/json", "":
			b, err = json.Marshal(bres.Body)
		default:
			jsonrw := NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusUnsupportedMediaType, fmt.Errorf("unsupported Accept media type"))
			return
		}

		if err != nil {
			jsonrw := NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, err)
			return
		}

		header.Set("Content-Length", strconv.Itoa(len(b)))
		rw.WriteHeader(*bres.Status)
		_, err = rw.Write(b)
		if err != nil {
			log.Printf("error while writing %s", err)
		}
	})
}
