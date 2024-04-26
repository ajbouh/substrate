package calldef

import (
	"context"
	"fmt"
	"log"
	"strings"
	"sync"

	"cuelang.org/go/cue"
	cueerrors "cuelang.org/go/cue/errors"
	"cuelang.org/go/cue/load"

	"github.com/ajbouh/substrate/pkg/cueloader"

	"github.com/ajbouh/substrate/images/bb/blackboard"
)

type CallDefRefinmentAdapter func(callDef cue.Value) blackboard.Refinement

type CallDefLoader func(cueMu *sync.Mutex, cc *cue.Context, config *load.Config, adapter CallDefRefinmentAdapter) *CallDefLoad

type CallDefLoad struct {
	Blackboard *blackboard.Blackboard
	CueMu      *sync.Mutex
	CueContext *cue.Context
	Err        error
}

func NewLoader(cueLoader *cueloader.Loader) CallDefLoader {
	return func(
		cueMu *sync.Mutex,
		cc *cue.Context,
		config *load.Config,
		adapter CallDefRefinmentAdapter,
	) *CallDefLoad {
		load := cueLoader.LoadCue(cueMu, cc, config)

		l := &CallDefLoad{
			Blackboard: blackboard.New(cc, cueMu),
			CueMu:      cueMu,
			CueContext: cc,
		}
		if load.Err != nil {
			l.Err = fmt.Errorf("error loading cue defs: %w", load.Err)
			return l
		}

		value := load.Value

		l.CueMu.Lock()
		defer l.CueMu.Unlock()

		err := value.Validate()
		if err != nil {
			l.Err = fmt.Errorf("error validating cue defs: %w", err)
			return l
		}

		ctx := context.Background()

		fields, err := value.Fields()
		if err != nil {
			l.Err = fmt.Errorf("error decoding calls fields: %w", err)
			return l
		}

		for fields.Next() {
			sel := fields.Selector()
			if !sel.IsString() {
				continue
			}
			callDefs, err := fields.Value().Fields()
			if err != nil {
				continue
			}
			for callDefs.Next() {
				callDef := callDefs.Value()
				err := callDef.Validate()
				if err != nil {
					errs := cueerrors.Errors(err)
					messages := make([]string, 0, len(errs))
					for _, err := range errs {
						messages = append(messages, err.Error())
					}
					log.Printf("call definition error: %s", strings.Join(messages, "\n"))
					continue
				}

				l.Blackboard.Offer(ctx, blackboard.Input{Value: callDef}, adapter(callDef))
			}
		}

		return l
	}
}
