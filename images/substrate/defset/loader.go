package defset

import (
	"context"
	"fmt"
	"log"
	"strings"
	"sync"

	"cuelang.org/go/cue"
	"cuelang.org/go/cue/cuecontext"
	cueerrors "cuelang.org/go/cue/errors"
	"cuelang.org/go/cue/load"

	"github.com/ajbouh/substrate/pkg/cueloader"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type CueMutex sync.Mutex

func (m *CueMutex) Lock() {
	(*sync.Mutex)(m).Lock()
}

func (m *CueMutex) Unlock() {
	(*sync.Mutex)(m).Unlock()
}

type Loader struct {
	CueLoader *cueloader.Loader
	Config    *load.Config

	ServiceDefPath cue.Path

	DefSetSlot *notify.Slot[DefSet]

	ctx context.Context
}

func (l *Loader) Serve(ctx context.Context) {
	l.ctx = ctx
	log.Printf("Loader Serve() %#v", l)
	l.LoadDefSet()
}

func (l *Loader) loadDefSet(files map[string]string, cueLoadConfigWithFiles *load.Config, err error) *DefSet {
	sds := &DefSet{
		ServicesCueValues: map[string]cue.Value{},
		CueMu:             &CueMutex{},
		// TODO Try EvalV3 again in the next cuelang release after v0.10.0
		// cueContext := cuecontext.New(cuecontext.EvaluatorVersion(cuecontext.EvalV3))
		CueContext: cuecontext.New(),
	}
	sds.Initialize()
	if err != nil {
		sds.Err = err
		return sds
	}

	load := l.CueLoader.LoadCue(sds.CueMu, sds.CueContext, cueLoadConfigWithFiles)
	if load.Err != nil {
		sds.Err = fmt.Errorf("error loading cue defs: %w", load.Err)
		return sds
	}

	sds.CueMu.Lock()
	defer sds.CueMu.Unlock()

	sds.RootValue = load.Value
	value := sds.RootValue.LookupPath(l.ServiceDefPath)

	err = value.Validate()
	if err != nil {
		sds.Err = fmt.Errorf("error validating cue defs: %w", err)
		return sds
	}

	fields, err := value.Fields()
	if err != nil {
		sds.Err = fmt.Errorf("error discovering service fields: %w", err)
		return sds
	}

	for fields.Next() {
		sel := fields.Selector()
		if !sel.IsString() {
			continue
		}
		serviceName := sel.Unquoted()
		serviceDefCueValue := fields.Value()

		err := serviceDefCueValue.Validate()
		if err != nil {
			errs := cueerrors.Errors(err)
			messages := make([]string, 0, len(errs))
			for _, err := range errs {
				messages = append(messages, err.Error())
			}
			log.Printf("service definition error: %s", strings.Join(messages, "\n"))
		}

		// fmt.Println("found service", serviceName, "->", serviceDefCueValue)
		sds.ServicesCueValues[serviceName] = serviceDefCueValue
	}

	return sds
}

func (l *Loader) LoadDefSet() (*DefSet, bool) {
	log.Printf("Loader LoadDefSet()... %#v", l)
	defer log.Printf("Loader LoadDefSet() %#v", l)
	files, cueLoadConfigWithFiles, err := cueloader.CopyConfigAndReadFilesIntoOverrides(l.Config)

	sds := l.loadDefSet(files, cueLoadConfigWithFiles, err)

	defSet := l.DefSetSlot.Peek()

	commit := false
	if sds.Err == nil {
		commit = true
		log.Printf("committing new defset without error")
	} else if defSet == nil {
		commit = true
		log.Printf("committing new defset with error because we need *something*; err=%s", fmtErr(sds.Err))
	} else if defSet.Err != nil {
		commit = true
		log.Printf("committing new defset with error because the one we had did not have an error; err=%s", fmtErr(sds.Err))
	} else {
		log.Printf("skipping commit of new defset with error (because we already had one without an err); err=%s", fmtErr(sds.Err))
	}

	if commit {
		if !l.DefSetSlot.CompareAndSwap(defSet, sds) {
			log.Printf("did not commit new defset because it changed too quickly")
			commit = false
		}
	}

	return sds, commit
}

func fmtErr(err error) string {
	errs := cueerrors.Errors(err)
	messages := make([]string, 0, len(errs))
	for _, err := range errs {
		messages = append(messages, err.Error())
	}
	return strings.Join(messages, "\n")
}
