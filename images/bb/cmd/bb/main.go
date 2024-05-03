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

	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
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
			cueloader.LookupPathTransform(cue.MakePath(cue.Def("#out"), cue.Str("calls"))),
		),
	)

	mu := &sync.RWMutex{}
	var bb *blackboard.Blackboard

	// close when ready
	readyCtx, markReady := context.WithCancel(context.Background())
	var markReadyOnce sync.Once

	go func() {
		err := NewCueConfigWatcherFromURL(ctx, "http://substrate:8080/substrate/v1/defs", func(err error, files map[string]string, config *load.Config) {
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
			for k := range files {
				keys = append(keys, k)
			}
			log.Printf("again ... %d files keys=%#v dir=%s tags=%#v", len(files), keys, config.Dir, config.Tags)

			callDefLoad := callDefLoader(cueMu, cc, config, func(callDef cue.Value) blackboard.Refinement {
				return calldef.Refinement("http://substrate:8080/")
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

	bbFunc := func() *blackboard.Blackboard {
		// Wait for first load
		<-readyCtx.Done()

		mu.RLock()
		defer mu.RUnlock()
		return bb
	}

	mux := http.NewServeMux()
	mux.Handle("/v1/race/", http.StripPrefix("/v1/race", bbhttp.NewFirstMatchWinsHandler(bbFunc)))
	mux.Handle("POST /v1/query/", bbhttp.NewQueryMatchesHandler(bbFunc))

	log.Printf("running on http://%s ...", m.listenAddr)
	log.Fatal(http.ListenAndServe(m.listenAddr, mux))
}

func NewCueConfigWatcherFromURL(ctx context.Context, url string, cb func(err error, files map[string]string, config *load.Config)) error {
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return err
	}
	log.Printf("making request of %s", url)
	return httpevents.ReadStreamEvents(http.DefaultClient, req, func(event *httpevents.Event) error {
		files, config, err := cueloader.Unmarshal(event.Data)
		log.Printf("%d files dir=%s tags=%#v", len(files), config.Dir, config.Tags)
		cb(err, files, config)
		return nil
	})
}
