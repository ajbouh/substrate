package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"

	"cuelang.org/go/cue"
	"cuelang.org/go/cue/cuecontext"
	cueerrors "cuelang.org/go/cue/errors"
	"cuelang.org/go/cue/load"
	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"

	"github.com/ajbouh/substrate/images/bb/blackboard"
	"github.com/ajbouh/substrate/images/bb/calldef"
	bbhttp "github.com/ajbouh/substrate/images/bb/http"
	"github.com/ajbouh/substrate/pkg/cueloader"
)

type Main struct {
	listenAddr string

	Daemon *daemon.Framework
}

func main() {
	engine.Run(
		Main{
			listenAddr: ":" + os.Getenv("PORT"),
		},
	)
}

func (m *Main) InitializeCLI(root *cli.Command) {
	// a workaround for an unresolved issue in toolkit-go/engine
	// for figuring out if its a CLI or a daemon program...
	root.Run = func(ctx *cli.Context, args []string) {
		if err := m.Daemon.Run(ctx); err != nil {
			log.Fatal(err)
		}
	}
}

func (m *Main) Serve(ctx context.Context) {
	cc := cuecontext.New()
	cueMu := &sync.Mutex{}

	callDefLoader := calldef.NewLoader(
		cueloader.NewCueLoader(
			":defs",
			cueloader.LookupPathTransform(cue.MakePath(cue.Def("#out"), cue.Def("#lenses"))),
		),
	)

	mu := &sync.RWMutex{}
	var bb *blackboard.Blackboard

	// close when ready
	ready := make(chan struct{})
	markReady := func() { close(ready) }
	var markReadyOnce sync.Once

	go func() {
		err := cueloader.NewCueConfigWatcherFromURL(ctx, "http://substrate:8080/substrate/v1/defs", func(err error, files map[string]string, config *load.Config) {
			defer markReadyOnce.Do(markReady)

			if err != nil {
				errs := cueerrors.Errors(err)
				messages := make([]string, 0, len(errs))
				for _, err := range errs {
					messages = append(messages, err.Error())
				}
				log.Printf("err in watcher: %s", strings.Join(messages, "\n"))
				return
			}

			keys := []string{}
			for k := range files { keys = append(keys, k) }
			log.Printf("again ... %d files keys=%#v dir=%s tags=%#v", len(files), keys, config.Dir, config.Tags)

			callDefLoad := callDefLoader(cueMu, cc, config, func(serviceName string, serviceDef, callDef cue.Value) blackboard.Refinement {
				return calldef.Refinement("http://substrate:8080/" + serviceName)
			})

			// check for errors before applying. how should we handle it if there's an error?
			err = callDefLoad.Err
			if err != nil {
				errs := cueerrors.Errors(err)
				messages := make([]string, 0, len(errs))
				for _, err := range errs {
					messages = append(messages, err.Error())
				}
				log.Printf("err in defloader: %s", strings.Join(messages, "\n\t"))
				return
			}

			mu.Lock()
			defer mu.Unlock()
			bb = callDefLoad.Blackboard
		})
		if err != nil {
			log.Fatal(fmt.Errorf("error starting watcher (should this be optional?): %w", err))
		}
	}()

	handler := bbhttp.NewHandler(func() *blackboard.Blackboard {
		// Wait for first load
		select {
		case _, _ = <-ready:
		}

		mu.RLock()
		defer mu.RUnlock()
		return bb
	})

	log.Printf("running on http://%s ...", m.listenAddr)
	log.Fatal(http.ListenAndServe(m.listenAddr, handler))
}
