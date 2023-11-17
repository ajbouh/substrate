package substrate

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"

	"cuelang.org/go/cue"

	"github.com/ajbouh/substrate/pkg/activityspec"
	"github.com/ajbouh/substrate/pkg/blackboard"
)

var requestPath = cue.MakePath(cue.Str("request"))
var responsePath = cue.MakePath(cue.Str("response"))

func (s *Substrate) serviceDefRefinement(serviceName string, serviceDef cue.Value, callDef cue.Value) blackboard.Refinement {
	return func(ctx context.Context, match cue.Value) (cue.Value, error) {
		request := match.LookupPath(requestPath)
		// if !blackboard.IsTransitivelyConcrete(request) {
		// 	return match, blackboard.NotTransitivelyConcrete
		// }

		breq := &blackboard.Request{}
		err := request.Decode(&breq)
		if err != nil {
			return match, err
		}

		b, err := json.Marshal(breq.Body)
		if err != nil {
			return match, err
		}

		hreq, err := http.NewRequestWithContext(ctx, *breq.Method, "http://0.0.0.0"+*breq.URL.Path, bytes.NewReader(b))
		if err != nil {
			return match, err
		}

		header := hreq.Header
		for k, vs := range breq.Headers {
			for _, v := range vs {
				header.Add(k, v)
			}
		}

		handler := s.ProvisionReverseProxy(&activityspec.ServiceSpawnRequest{
			ServiceName: serviceName,
			Parameters:  activityspec.ServiceSpawnParameterRequests{},
		})

		rec := httptest.NewRecorder()
		handler.ServeHTTP(rec, hreq)
		hres := rec.Result()

		// log.Printf("hres %#v", hres)

		bres := blackboard.Response{
			Status:  &hres.StatusCode,
			Headers: hres.Header,
		}
		if hres.Body != nil {
			err = json.NewDecoder(hres.Body).Decode(&bres.Body)
			if err != nil {
				return match, err
			}
		}

		log.Printf("bres %#v", bres)

		match = match.FillPath(
			responsePath,
			match.Context().Encode(bres, cue.NilIsAny(false)),
		)
		// log.Printf("match %#v", match)

		return match, nil
	}
}
