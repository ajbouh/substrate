package blackboard_test

import (
	"context"
	"reflect"
	"sync"
	"testing"
	"time"

	"cuelang.org/go/cue"
	"cuelang.org/go/cue/cuecontext"

	"github.com/stretchr/testify/assert"

	"github.com/ajbouh/substrate/images/bb/blackboard"
)

type FuncOffer struct {
	P string
	S cue.Path
	F any
}

type ExpectJSON struct {
	In     string
	Call   string
	CallOk bool
	Stream []string
}

func funcAsRefinement(fn any) blackboard.Refinement {
	return func(ctx context.Context, request cue.Value) (cue.Value, error) {
		f := reflect.ValueOf(fn)
		argType := f.Type().In(0)
		argPtrRef := reflect.New(argType)

		err := request.Decode(argPtrRef.Interface())
		if err != nil {
			return cue.Value{}, err
		}

		resultRef := f.Call([]reflect.Value{argPtrRef.Elem()})[0]
		resultPtr := resultRef.Interface()
		return request.Context().Encode(resultPtr, cue.NilIsAny(false)), nil
	}
}

func TestBlackboard(t *testing.T) {
	tcs := []struct {
		Offers []FuncOffer
		Expect []ExpectJSON
	}{
		{
			Offers: []FuncOffer{
				{
					P: `{task: "double", in: {x: number}, out: number}`,
					F: func(arg struct{ In struct{ X float32 } }) any {
						return map[string]any{"out": arg.In.X * 2}
					},
				},
				{
					P: `{task: "repeat", in: {x: string}, out: string}`,
					F: func(arg struct{ In struct{ X string } }) any {
						return map[string]any{"out": arg.In.X + arg.In.X}
					},
				},
			},
			Expect: []ExpectJSON{
				{
					In:     `{in: {x: "1"}}`,
					CallOk: true,
					Call:   `{"task":"repeat","in":{"x":"1"},"out":"11"}`,
					Stream: []string{`{"task":"repeat","in":{"x":"1"},"out":"11"}`},
				},
				{
					In:     `{in: {x: 1.0}}`,
					CallOk: true,
					Call:   `{"task":"double","in":{"x":1.0},"out":2}`,
					Stream: []string{`{"task":"double","in":{"x":1.0},"out":2}`},
				},
			},
		},
	}

	for _, tc := range tcs {
		s := blackboard.New(cuecontext.New(), &sync.Mutex{})

		baseCtx := context.Background()
		cancels := []func(){}
		for i, o := range tc.Offers {
			o := o
			ctx, cancel := context.WithCancel(baseCtx)
			cancels = append(cancels, cancel)
			s.Offer(ctx, blackboard.Input{Source: o.P}, funcAsRefinement(o.F))

			assert.Equal(t, i+1, s.Len(), "blackboard.Len() is wrong %s")
		}

		for _, e := range tc.Expect {
			// test call for each
			stream := []string{}
			s.Stream(
				baseCtx,
				blackboard.Input{Source: e.In},
				func(m *blackboard.Match) bool {
					if m.Error == nil {
						resultJSON, err := m.Result.MarshalJSON()
						assert.NoError(t, err)
						stream = append(stream, string(resultJSON))
					}
					return true
				},
				nil,
			)
			assert.Equal(t, e.Stream, stream)

			m, ok := s.Call(baseCtx, blackboard.Input{Source: e.In}, nil)
			resultJSON, err := m.Result.MarshalJSON()
			assert.Equal(t, e.CallOk, ok)
			assert.NoError(t, err)
			if ok {
				assert.Equal(t, e.Call, string(resultJSON))
			}
		}

		// cancel one at a time and confirm cleanup work
		remaining := len(cancels)
		for _, cancel := range cancels {
			remaining--
			cancel()
			assert.EventuallyWithT(t, func(c *assert.CollectT) {
				assert.Equal(t, remaining, s.Len(), "cancel didn't cleanup")
			}, 1*time.Second, 10*time.Millisecond, "incomplete cleanup")
		}

		assert.Equal(t, 0, s.Len(), "unstable cleanup")
	}
}
