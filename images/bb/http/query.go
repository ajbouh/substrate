package http

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/elnormous/contenttype"

	"cuelang.org/go/cue"
	cueerrors "cuelang.org/go/cue/errors"
	cueeformat "cuelang.org/go/cue/format"

	"github.com/ajbouh/substrate/images/bb/blackboard"
	"github.com/ajbouh/substrate/images/bb/calldef"
)

func NewQueryMatchesHandler(blackboardFunc func() *blackboard.Blackboard) http.Handler {
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

		call := &calldef.Call{
			Request: &calldef.Request{
				Method:  &req.Method,
				URL:     nil,
				Headers: req.Header,
				Body:    body,
			},
		}

		type R struct {
			Path  string
			Match string
			Error string
			Offer string
		}

		pprint := func(v cue.Value) (string, error) {
			syn := v.Syntax(
				cue.Final(),         // close structs and lists
				cue.Concrete(false), // allow incomplete values
				cue.Definitions(false),
				cue.Hidden(true),
				cue.Optional(true),
				cue.Attributes(true),
				cue.Docs(true),
			)

			bs, err := cueeformat.Node(
				syn,
				cueeformat.TabIndent(false),
				cueeformat.UseSpaces(2),
			)

			return string(bs), err
		}

		errorFmt := func(err error) string {
			errs := cueerrors.Errors(err)
			messages := make([]string, 0, len(errs))
			for _, err := range errs {
				message := err.Error()
				if len(message) > 1024 {
					message = message[0:512] + " (...) " + message[len(message)-512:]
				}
				messages = append(messages, message)
			}
			return strings.Join(messages, "\n\t")
		}

		collected := []*R{}
		blackboardFunc().Stream(
			req.Context(),
			blackboard.Input{Value: call},
			func(m *blackboard.Match, _ func() *blackboard.Match) bool {
				var r R

				if m.Error != nil {
					r.Error = errorFmt(m.Error)
				}

				r.Path = m.Offer.SelectorValue.Path().String()
				r.Match, _ = pprint(m.Match)
				r.Offer, _ = pprint(m.Offer.SelectorValue)

				collected = append(collected, &r)
				return true
			},
			nil,
		)

		jsonrw := NewJSONResponseWriter(rw)
		jsonrw(map[string]any{
			"collected": collected,
		}, http.StatusOK, nil)
	})
}
