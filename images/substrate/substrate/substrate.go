package substrate

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"sync"

	"cuelang.org/go/cue"
	"cuelang.org/go/cue/cuecontext"
	cueerrors "cuelang.org/go/cue/errors"
	"cuelang.org/go/cue/load"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/images/substrate/fs"
)

type Substrate struct {
	Driver           activityspec.ProvisionDriver
	ProvisionerCache *activityspec.ProvisionerCache

	defSet *defset.DefSet
	defSetMu *sync.RWMutex

	Origin string

	Mu *sync.RWMutex
	DB *sql.DB
}

func New(
	ctx context.Context,
	fileName, substratefsMountpoint string,
	cueLoadConfig *load.Config,
	driver activityspec.ProvisionDriver,
	origin string,
	cpuMemoryTotalMB, cudaMemoryTotalMB int,
) (*Substrate, error) {
	db, err := newDB(fileName)
	if err != nil {
		return nil, fmt.Errorf("error starting db: %w", err)
	}

	cc := cuecontext.New()
	cueMu := &sync.Mutex{}

	defLoader := defset.NewDefLoader(
		defset.NewCueLoader(
			cueLoadConfig,
			":defs",
			defset.LookupPathTransform(cue.MakePath(cue.Def("#out"), cue.Def("#lenses"))),
			defset.FillPathEncodeTransform(
				cue.MakePath(cue.AnyString, cue.Str("spawn").Optional(), cue.Str("parameters"), cue.Str("cpu_memory_total"), cue.Str("resource"), cue.Str("quantity")),
				cpuMemoryTotalMB,
			),
			defset.FillPathEncodeTransform(
				cue.MakePath(cue.AnyString, cue.Str("spawn").Optional(), cue.Str("parameters"), cue.Str("cuda_memory_total"), cue.Str("resource"), cue.Str("quantity")),
				cudaMemoryTotalMB,
			),
			defset.FillPathEncodeTransform(
				cue.MakePath(cue.AnyString, cue.Str("spawn").Optional(), cue.Str("environment")),
				map[string]string{
					"JAMSOCKET_IFRAME_DOMAIN":    origin,
					"JAMSOCKET_SUBSTRATE_ORIGIN": origin,
					"PUBLIC_EXTERNAL_ORIGIN":     origin,
					"ORIGIN":                     origin,
					// TODO stop hardcoding these
					"INTERNAL_SUBSTRATE_HOST":     "substrate:8080",
					"INTERNAL_SUBSTRATE_PROTOCOL": "http:",
				},
			),
		),
	)

	layout := substratefs.NewLayout(substratefsMountpoint)

	var s *Substrate
	pc := activityspec.NewProvisionerCache(
		func(asr *activityspec.ServiceSpawnRequest) activityspec.ProvisionFunc {
			return s.DefSet().NewProvisionFunc(driver, asr)
		},
	)
	mu := &sync.RWMutex{}
	defSet := defLoader(cueMu, cc, pc, layout)
	defSetMu := &sync.RWMutex{}

	s = &Substrate{
		Driver:           driver,
		ProvisionerCache: pc,
		defSet:           defSet,
		DB:               db,
		Mu:               mu,
		defSetMu:         defSetMu,
		Origin:           origin,
	}

	err = defset.NewCueWatcher(ctx, cueLoadConfig, func(err error) {
		if err != nil {
			errs := cueerrors.Errors(err)
			messages := make([]string, 0, len(errs))
			for _, err := range errs {
				messages = append(messages, err.Error())
			}
			log.Printf("err in watcher: %s", strings.Join(messages, "\n"))
			return
		}

		defSet := defLoader(cueMu, cc, s.ProvisionerCache, layout)

		// check for errors before applying. how should we handle it if there's an error?
		err = defSet.Err
		if err != nil {
			errs := cueerrors.Errors(err)
			messages := make([]string, 0, len(errs))
			for _, err := range errs {
				messages = append(messages, err.Error())
			}
			log.Printf("err in defloader (config %#v): %s", cueLoadConfig, strings.Join(messages, "\n\t"))
			return
		}

		s.defSetMu.Lock()
		defer s.defSetMu.Unlock()
		s.defSet = defSet
	})
	if err != nil {
		return nil, fmt.Errorf("error starting watcher (should this be optional?): %w", err)
	}

	return s, nil
}

func (s *Substrate) DefSet() *defset.DefSet {
	s.defSetMu.RLock()
	defer s.defSetMu.RUnlock()

	return s.defSet
}
