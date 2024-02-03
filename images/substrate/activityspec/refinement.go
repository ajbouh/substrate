package activityspec

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"

	"cuelang.org/go/cue"

	"github.com/ajbouh/substrate/images/substrate/blackboard"
)

var requestPath = cue.MakePath(cue.Str("request"))
var responsePath = cue.MakePath(cue.Str("response"))

func ServiceDefRefinement(pc *ProvisionerCache, serviceName string, serviceDef cue.Value, callDef cue.Value) blackboard.Refinement {
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

		handler := pc.ProvisionReverseProxy(&ServiceSpawnRequest{
			ServiceName: serviceName,
			Parameters:  ServiceSpawnParameterRequests{},
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

		// log.Printf("bres %#v", bres)

		match = match.FillPath(
			responsePath,
			match.Context().Encode(bres, cue.NilIsAny(false)),
		)
		// log.Printf("match %#v", match)

		return match, nil
	}
}
