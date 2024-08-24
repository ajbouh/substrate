package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"

	"tractor.dev/toolkit-go/engine"

	"cuelang.org/go/cue"
	"github.com/containers/podman/v4/pkg/bindings"
	"github.com/containers/podman/v4/pkg/specgen"
	"github.com/oklog/ulid/v2"
	specs "github.com/opencontainers/runtime-spec/specs-go"
	"github.com/rs/cors"
	"github.com/sirupsen/logrus"

	substratedb "github.com/ajbouh/substrate/images/substrate/db"
	"github.com/ajbouh/substrate/images/substrate/defset"
	substratefs "github.com/ajbouh/substrate/images/substrate/fs"
	substratehttp "github.com/ajbouh/substrate/images/substrate/http"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
	podmanprovisioner "github.com/ajbouh/substrate/images/substrate/provisioner/podman"
	"github.com/ajbouh/substrate/pkg/cueloader"
	"github.com/ajbouh/substrate/pkg/toolkit/exports"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

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

	// Informed by https://github.com/golang/go/issues/6785
	ht := http.DefaultTransport.(*http.Transport)
	ht.MaxConnsPerHost = 32
	ht.DisableCompression = true

	origin := mustGetenv("ORIGIN")
	originURL, _ := url.Parse(origin)

	provisionerCache := &provisioner.Cache{}

	engine.Run(
		&service.Service{
			ExportsRoute:  "/substrate/v1/exports",
			CommandsRoute: "/substrate",
		},
		&podmanprovisioner.P{
			Connect: func(ctx context.Context) (context.Context, error) {
				return bindings.NewConnection(ctx, os.Getenv("DOCKER_HOST"))
			},
			Namespace:           mustGetenv("SUBSTRATE_NAMESPACE"),
			InternalNetwork:     mustGetenv("SUBSTRATE_INTERNAL_NETWORK"),
			ExternalNetwork:     mustGetenv("SUBSTRATE_EXTERNAL_NETWORK"),
			WaitForReadyTimeout: 2 * time.Minute,
			WaitForReadyTick:    500 * time.Millisecond,
			Generation:          ulid.Make().String(),
			Prep: func(s *specgen.SpecGenerator) {
				s.SelinuxOpts = []string{
					"disable",
				}
				if cudaAllowed {
					s.Devices = []specs.LinuxDevice{
						{
							Path: "nvidia.com/gpu=all",
						},
					}
				}
			},
		},
		db,
		provisionerCache,
		&httpevents.EventStream[*defset.DefSet]{
			ContentType: "application/json",
		},

		// TODO how do we want to handle authentication for this?
		&substratehttp.CORSMiddleware{
			Options: cors.Options{
				AllowCredentials: true,
				AllowOriginRequestFunc: func(r *http.Request, origin string) bool {
					slog.Info("AllowOriginFunc", "origin", origin, "url", r.URL.String())

					// panic("CORS origin check not yet implemented")
					// TODO actually implement
					return true
				},
				// Enable Debugging for testing, consider disabling in production
				Debug: true,
			},
		},

		&substratehttp.ActivitesHandler{
			Prefix: "/substrate",
		},
		&substratehttp.CollectionsHandler{
			Prefix: "/substrate",
		},
		&substratehttp.DefsHandler{
			Prefix: "/substrate",
		},
		&substratehttp.EventsHandler{
			Prefix: "/substrate",
		},
		&substratehttp.ExportsHandler{
			Prefix: "/substrate",
		},
		&substratehttp.SpaceHandler{
			Prefix: "/substrate",
			User:   "user",
		},
		&substratehttp.ProxyHandler{
			User:                    "user",
			InternalSubstrateOrigin: internalSubstrateOrigin,
		},

		&notify.Slot[DefSetExports]{},
		&exports.LoaderSource[*DefSetExports]{},
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
		&notify.Slot[defset.DefSet]{},
		&defset.Loader{
			ServiceDefPath: cue.MakePath(cue.Str("services")),
		},
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
					"ORIGIN_HOSTNAME":           originURL.Hostname(),
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
		notify.On(func(ctx context.Context, e *defset.DefSet, exportsSlot *notify.Slot[DefSetExports]) {
			exports := map[string]any{}
			err := e.DecodeLookupPath(cue.MakePath(cue.Str("exports")), &exports)
			if err != nil {
				log.Printf("err on update: %s", fmtErr(err))
				exportsSlot.StoreWithContext(ctx, nil)
				return
			}

			slog.Info("exports from defset", "exports", exports)
			dse := DefSetExports(exports)
			exportsSlot.StoreWithContext(ctx, &dse)
			slog.Info("stored exports from defset")
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

type DefSetExports map[string]any

func (m *DefSetExports) Exports(ctx context.Context) (any, error) {
	if m == nil {
		return nil, nil
	}
	return *m, nil
}
