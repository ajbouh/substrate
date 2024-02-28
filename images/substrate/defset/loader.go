package defset

import (
	"fmt"
	"log"
	"strings"
	"sync"

	"cuelang.org/go/cue"
	cueerrors "cuelang.org/go/cue/errors"
	"cuelang.org/go/cue/load"

	substratefs "github.com/ajbouh/substrate/images/substrate/fs"
	"github.com/ajbouh/substrate/pkg/cueloader"
)

type SourcesLoaded interface {
	DefSetSourcesLoaded(err error, files map[string]string, cueLoadConfigWithFiles *load.Config)
}

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
	Layout    *substratefs.Layout

	CueMu      *CueMutex
	CueContext *cue.Context

	ServiceSpawned      []ServiceSpawned
	DefSetSourcesLoaded []SourcesLoaded

	defSetMu sync.RWMutex
	defSet   *DefSet
}

type CurrentDefSet interface {
	CurrentDefSet() *DefSet
}

func (l *Loader) CurrentDefSet() *DefSet {
	l.defSetMu.RLock()
	defer l.defSetMu.RUnlock()
	if l.defSet == nil {
		panic("called CurrentDefSet() before it was loaded.")
	}
	return l.defSet
}

func (l *Loader) Initialize() {
	log.Printf("Loader Initialize() %#v", l)
	l.LoadDefSet()
}

func (l *Loader) loadDefSet() *DefSet {
	files, cueLoadConfigWithFiles, err := cueloader.CopyConfigAndReadFilesIntoOverrides(l.Config)
	for _, l := range l.DefSetSourcesLoaded {
		l.DefSetSourcesLoaded(err, files, cueLoadConfigWithFiles)
	}

	load := l.CueLoader.LoadCue(l.CueMu, l.CueContext, cueLoadConfigWithFiles)

	sds := &DefSet{
		Services:   map[string]cue.Value{},
		CueMu:      l.CueMu,
		CueContext: l.CueContext,
		Layout:     l.Layout,

		ServiceSpawned: l.ServiceSpawned,
	}
	if load.Err != nil {
		sds.Err = fmt.Errorf("error loading cue defs: %w", load.Err)
		return sds
	}

	value := load.Value

	sds.CueMu.Lock()
	defer sds.CueMu.Unlock()

	err = value.Validate()
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
		// fmt.Println("found service", serviceName, "->", serviceDef)
		sds.Services[serviceName] = serviceDef
	}

	return sds
}

func (l *Loader) LoadDefSet() (*DefSet, bool) {
	defer log.Printf("Loader LoadDefSet() %#v", l)
	sds := l.loadDefSet()

	l.defSetMu.Lock()
	defer l.defSetMu.Unlock()

	commit := false
	if sds.Err == nil {
		commit = true
		log.Printf("committing new defset without error")
	} else if l.defSet == nil {
		commit = true
		log.Printf("committing new defset with error because we need *something*; err=%s", fmtErr(sds.Err))
	} else if l.defSet.Err != nil {
		commit = true
		log.Printf("committing new defset with error because the one we had did not have an error; err=%s", fmtErr(sds.Err))
	} else {
		log.Printf("skipping commit of new defset with error (because we already had one without an err); err=%s", fmtErr(sds.Err))
	}

	if commit {
		l.defSet = sds
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
