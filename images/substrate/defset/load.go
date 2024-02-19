package defset

import (
	"fmt"
	"log"
	"strings"
	"sync"

	"cuelang.org/go/cue"
	cueerrors "cuelang.org/go/cue/errors"
	"cuelang.org/go/cue/load"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/fs"
	"github.com/ajbouh/substrate/pkg/cueloader"
)

type DefSetLoader func(
	cueMu *sync.Mutex,
	cc *cue.Context,
	config *load.Config,
	pc *activityspec.ProvisionerCache,
	layout *substratefs.Layout,
	serviceSpawned ServiceSpawnedFunc,
) *DefSet

func NewDefLoader(cueLoader cueloader.Loader) DefSetLoader {
	return func(
		cueMu *sync.Mutex,
		cc *cue.Context,
		config *load.Config,
		pc *activityspec.ProvisionerCache,
		layout *substratefs.Layout,
		serviceSpawned ServiceSpawnedFunc,
	) *DefSet {
		load := cueLoader(cueMu, cc, config)

		sds := &DefSet{
			Services:   map[string]cue.Value{},
			CueMu:      cueMu,
			CueContext: cc,
			Layout:     layout,

			ServiceSpawned: serviceSpawned,
		}
		if load.Err != nil {
			sds.Err = fmt.Errorf("error loading cue defs: %w", load.Err)
			return sds
		}

		value := load.Value

		sds.CueMu.Lock()
		defer sds.CueMu.Unlock()

		err := value.Validate()
		if err != nil {
			sds.Err = fmt.Errorf("error validating cue defs: %w", err)
			return sds
		}

		fields, err := value.Fields()
		if err != nil {
			sds.Err = fmt.Errorf("error decoding service fields: %w", err)
			return sds
		}

		for fields.Next() {
			sel := fields.Selector()
			if !sel.IsString() {
				continue
			}
			serviceName := sel.Unquoted()
			serviceDef := fields.Value()

			err := serviceDef.Validate()
			if err != nil {
				errs := cueerrors.Errors(err)
				messages := make([]string, 0, len(errs))
				for _, err := range errs {
					messages = append(messages, err.Error())
				}
				log.Printf("service definition error: %s", strings.Join(messages, "\n"))
			}
			fmt.Println("found service", serviceName, "->", serviceDef)
			sds.Services[serviceName] = serviceDef
		}
		return sds
	}
}
