package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"strconv"
	"strings"

	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"

	"cuelang.org/go/cue"
	"github.com/sirupsen/logrus"

	substratedb "github.com/ajbouh/substrate/images/substrate/db"
	"github.com/ajbouh/substrate/images/substrate/defset"
	substratefs "github.com/ajbouh/substrate/images/substrate/fs"
	substratehttp "github.com/ajbouh/substrate/images/substrate/http"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
	"github.com/ajbouh/substrate/pkg/cueloader"
	"github.com/ajbouh/substrate/pkg/toolkit/exports"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type Main struct {
	listen        net.Listener
	listenAddress string

	Daemon  *daemon.Framework
	Handler *substratehttp.Handler
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

func main() {
	// This is gross.
	slog.SetLogLoggerLevel(slog.LevelDebug)

	debug := os.Getenv("DEBUG")
	if ok, _ := strconv.ParseBool(debug); ok {
		logrus.SetLevel(logrus.DebugLevel)
	}

	for _, env := range os.Environ() {
		fmt.Println(env)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	var err error

	cudaAllowed := false
	if _, err := exec.LookPath("nvidia-smi"); err == nil {
		cudaAllowed = true
	}

	db, err := substratedb.New(mustGetenv("SUBSTRATE_DB"))
	if err != nil {
		log.Fatalf("couldn't open db: %s", err)
	}

	machineIDData, err := os.ReadFile(mustGetenv("SUBSTRATE_MACHINE_ID_FILE"))
	if err != nil {
		log.Fatalf("couldn't read machine id file: %s", err)
	}
	machineID := strings.Trim(string(machineIDData), "\n")

	// TODO stop hardcoding these
	internalSubstrateOrigin := "http://substrate:8080"

	listenAddress := ":" + os.Getenv("PORT")
	ln, err := net.Listen("tcp", listenAddress)
	if err != nil {
		log.Fatalf("couldn't listen: %s", err)
	}

	// Informed by https://github.com/golang/go/issues/6785
	ht := http.DefaultTransport.(*http.Transport)
	ht.MaxConnsPerHost = 32
	ht.DisableCompression = true

	origin := mustGetenv("ORIGIN")

	originURL, _ := url.Parse(origin)
	originHostname := originURL.Hostname()

	provisionerCache := &provisioner.Cache{}

	engine.Run(
		Main{
			listen:        ln,
			listenAddress: listenAddress,
		},
		newProvisioner(cudaAllowed),
		db,
		provisionerCache,
		&httpevents.EventStream[*defset.DefSet]{
			ContentType: "application/json",
		},

		httpevents.NewJSONRequester[exports.Exports]("PUT", os.Getenv("INTERNAL_SUBSTRATE_EXPORTS_URL")),
		httpevents.NewJSONEventStream[exports.Exports](""),
		notify.On(func(
			ctx context.Context,
			e exports.Changed,
			t *struct {
				Sources     []exports.Source
				EventStream *httpevents.EventStream[exports.Exports]
				Requester   *httpevents.Requester[exports.Exports]
			},
		) {
			if t.EventStream == nil && t.Requester == nil {
				return
			}

			union, err := exports.Union(ctx, t.Sources)
			if err != nil {
				log.Printf("error computing exports: %#v", err)
				return
			}
			slog.Info("preparing export union", "union", union)
			if t.EventStream != nil {
				t.EventStream.Announce(union)
			}
			if t.Requester != nil {
				go func() {
					err := t.Requester.Do(ctx, union)
					if err != nil {
						slog.Info("Requester.Do", "err", err)
					}
				}()
			}
		}),
		&notify.Slot[provisioner.InstancesRoot]{},
		&exports.LoaderSource[*provisioner.InstancesRoot]{},
		notify.On(func(
			ctx context.Context,
			e *provisioner.InstancesRoot,
			t *struct {
				ExportsChanged []notify.Notifier[exports.Changed]
			},
		) {
			slog.Info("*provisioner.InstancesRoot")
			notify.Notify(ctx, t.ExportsChanged, exports.Changed{})
		}),
		notify.On(func(
			ctx context.Context,
			e provisioner.FieldsExported,
			t *struct {
				ProvisionerCache  *provisioner.Cache
				InstancesRootSlot *notify.Slot[provisioner.InstancesRoot]
			},
		) {
			v := t.ProvisionerCache.AllInstanceExports()
			slog.Info("t.InstancesRootSlot.StoreWithContext", "len(v.Instances)", len(v.Instances))
			t.InstancesRootSlot.StoreWithContext(ctx, v)
		}),

		substratefs.NewLayout(mustGetenv("SUBSTRATEFS_ROOT")),
		&substratehttp.Handler{
			User:                    "user",
			InternalSubstrateOrigin: internalSubstrateOrigin,
		},
		&notify.Slot[defset.DefSet]{},
		&defset.Loader{
			ServiceDefPath: cue.MakePath(cue.Str("services")),
		},
		&substratehttp.PProfHandler{},
		initialCueLoadConfig(),
		&cueloader.CueConfigWatcher{
			ReadyFile: "ready",
		},
		cueloader.NewCueLoader(
			":defs",
			cueloader.FillPathEncodeTransformCurrent(
				cue.MakePath(cue.Str("services")),
				func() any {
					return provisionerCache.AllServiceExports()
				},
			),
			cueloader.FillPathEncodeTransform(
				cue.MakePath(cue.Str("services"), cue.AnyString, cue.Str("instances").Optional(), cue.AnyString, cue.Str("environment")),
				map[string]string{
					"JAMSOCKET_IFRAME_DOMAIN":   origin,
					"SUBSTRATE_ORIGIN":          origin,
					"PUBLIC_EXTERNAL_ORIGIN":    origin,
					"ORIGIN":                    origin,
					"ORIGIN_HOSTNAME":           originHostname,
					"SUBSTRATE_MACHINE_ID":      machineID,
					"INTERNAL_SUBSTRATE_ORIGIN": internalSubstrateOrigin,
				},
			),
		),
		&PinnedInstances{
			InternalSubstrateOrigin: internalSubstrateOrigin,
		},
		&SpawnWithCurrentDefSet{},
		notify.On(func(ctx context.Context, e provisioner.FieldsExported, defSetLoader *defset.Loader) {
			go defSetLoader.LoadDefSet()
		}),
		notify.On(func(ctx context.Context, e *defset.DefSet, provisionerCache *provisioner.Cache) {
			provisionerCache.Refresh()
		}),
		notify.On(func(ctx context.Context, e *defset.DefSet, pinnedServices *PinnedInstances) {
			pinnedServices.Refresh(e)
		}),
		notify.On(func(ctx context.Context, e *cueloader.CueModuleChanged, defSetLoader *defset.Loader) {
			defSetLoader.LoadDefSet()
		}),
		notify.On(func(ctx context.Context, e ServiceSpawned, db *substratedb.DB) {
			err := db.ServiceSpawned(ctx, e.Req, e.Res)
			if err != nil {
				log.Printf("error notifying ServiceSpawned listener: %s", err)
			}
		}),
		notify.On(func(ctx context.Context, e *cueloader.CueModuleChanged, defsAnnouncer *httpevents.EventStream[*defset.DefSet]) {
			// announce it
			if e.Error != nil {
				log.Printf("err on update: %s", fmtErr(e.Error))
			} else {
				if b, err := cueloader.Marshal(e.Files, e.CueLoadConfigWithFiles); err == nil {
					defsAnnouncer.AnnounceRaw(b)
				} else {
					log.Printf("error encoding cue defs for announce: %s", err)
				}
			}
		}),
	)
}
