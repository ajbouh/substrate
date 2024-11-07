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
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"

	"cuelang.org/go/cue"
	"github.com/containers/podman/v4/pkg/bindings"
	"github.com/containers/podman/v4/pkg/specgen"
	"github.com/oklog/ulid/v2"
	specs "github.com/opencontainers/runtime-spec/specs-go"
	"github.com/rs/cors"
	"github.com/sirupsen/logrus"

	"github.com/ajbouh/substrate/images/substrate/defset"
	substratefs "github.com/ajbouh/substrate/images/substrate/fs"
	substratehttp "github.com/ajbouh/substrate/images/substrate/http"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
	podmanprovisioner "github.com/ajbouh/substrate/images/substrate/provisioner/podman"
	"github.com/ajbouh/substrate/images/substrate/space"
	"github.com/ajbouh/substrate/images/substrate/units"
	"github.com/ajbouh/substrate/pkg/cueloader"
	"github.com/ajbouh/substrate/pkg/toolkit/event"
	"github.com/ajbouh/substrate/pkg/toolkit/exports"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

func mustGetenv(name string) string {
	value := os.Getenv(name)
	if value == "" {
		log.Fatalf("%s not set", name)
	}
	return value
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

	machineIDData, err := os.ReadFile(mustGetenv("SUBSTRATE_MACHINE_ID_FILE"))
	if err != nil {
		log.Fatalf("couldn't read machine id file: %s", err)
	}
	machineID := strings.Trim(string(machineIDData), "\n")

	internalSubstrateOrigin := mustGetenv("INTERNAL_SUBSTRATE_ORIGIN")

	// Informed by https://github.com/golang/go/issues/6785
	ht := http.DefaultTransport.(*http.Transport)
	ht.MaxConnsPerHost = 32
	ht.DisableCompression = true

	origin := mustGetenv("ORIGIN")
	originURL, _ := url.Parse(origin)

	provisionerCache := &provisioner.Cache{
		InternalSubstrateOrigin: internalSubstrateOrigin,
	}

	servicesRootMapSlot := &notify.Slot[provisioner.ServicesRootMap]{}

	units := []engine.Unit{
		&service.Service{
			BaseURL:      origin,
			ExportsRoute: "/substrate/v1/exports",
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
		provisionerCache,
		httpevents.NewJSONEventStream[*defset.DefSet](""),
		&space.VSCodeEditingForSpace{},

		&units.RootSpacesLinkQuerier{
			SpaceURL: func(space string) string {
				return "/substrate/v1/spaces/" + space
			},
		},
		space.CommitCommand,
		space.LinksQueryCommand,
		space.QueryLinksTreePathCommand,
		space.DeleteCommand,
		space.GetCommand,
		space.WriteCommand,
		substratehttp.ViewspecLinksCommand,

		&space.SpacesFileTree{},

		provisioner.NewCommand,
		space.QueryCommand,
		space.NewCommand,
		space.CommandsRemoveCommand,
		space.CommandsWriteCommand,
		space.LinksRemoveCommand,
		space.LinksWriteCommand,
		substratehttp.EvalCommand,

		// TODO how do we want to handle authentication for this?
		&substratehttp.CORSMiddleware{
			Options: cors.Options{
				AllowCredentials: true,
				AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodPut, http.MethodHead, "REFLECT"},
				AllowOriginRequestFunc: func(r *http.Request, origin string) bool {
					// slog.Info("AllowOriginFunc", "origin", origin, "url", r.URL.String())

					// panic("CORS origin check not yet implemented")
					// TODO actually implement
					return true
				},
				// Enable Debugging for testing, consider disabling in production
				// Debug: true,
			},
		},

		&substratehttp.DefsHandler{
			Prefix: "/substrate",
		},
		&substratehttp.ProxyHandler{},
		&units.Broker{},

		&notify.Slot[units.DefSetCommands]{},
		&service.LoaderDelegate[*units.DefSetCommands]{},
		notify.On(func(ctx context.Context,
			e *defset.DefSet,
			t *struct {
				NotifyQueue    *notify.Queue
				Slot           *notify.Slot[units.DefSetCommands]
				ExportsChanged []notify.Notifier[exports.Changed]
				DefRunner      commands.DefRunner
			}) {
			commands := units.DefSetCommands{
				DefRunner: t.DefRunner,
			}
			err := e.DecodeLookupPath(cue.MakePath(cue.Str("commands")), &commands.DefsMap)
			if err != nil {
				log.Printf("err on update: %s", defset.FmtErr(err))
				t.Slot.StoreWithContext(ctx, nil)
				return
			}

			slog.Info("commands from defset", "commands", commands)
			t.Slot.StoreWithContext(ctx, &commands)
			slog.Info("stored commands from defset")

			// commands changed, so exports changed.
			notify.Later(t.NotifyQueue, t.ExportsChanged, exports.Changed{})
		}),

		servicesRootMapSlot,

		&space.SpacesViaContainerFilesystems{},
		&space.SpaceLinks{},
		&space.SpaceCommands{},
		notify.On(func(ctx context.Context, e units.SpawnEventFields, sl *space.SpaceLinks) {
			for name, p := range e.Links {
				if p.Rel != "space" {
					continue
				}
				spaceID, ok := p.Attributes["space:id"].(string)
				if !ok {
					continue
				}
				err := sl.WriteSpawn(ctx, e.ActivitySpec, e.HREF, name, spaceID)
				if err != nil {
					log.Printf("error notifying ServiceSpawned listener: %s", err)
				}
			}
		}),
		&units.InstanceLinks{},

		substratefs.NewLayout(mustGetenv("SUBSTRATEFS_ROOT")),

		&notify.Slot[defset.DefSet]{},
		&defset.Loader{
			ServiceDefPath: cue.MakePath(cue.Str("services")),
		},
		units.InitialCueLoadConfig(),
		&cueloader.CueConfigWatcher{
			ReadyFile: "ready",
		},
		cueloader.NewCueLoader(
			":defs",
			cueloader.FillPathEncodeTransformCurrent(
				cue.MakePath(cue.Str("services")),
				func() any {
					// need to make sure this is populated!
					servicesRootMap := servicesRootMapSlot.Peek()
					if servicesRootMap == nil {
						return map[string]any{}
					}
					return servicesRootMap
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
		&units.PinnedInstances{
			InternalSubstrateOrigin: internalSubstrateOrigin,
		},
		&units.SpawnWithCurrentDefSet{},
		&units.ServiceResolverWithCurrentDefSet{},
		notify.On(func(ctx context.Context, e *provisioner.ServicesRootMap, defSetLoader *defset.Loader) {
			go defSetLoader.LoadDefSet()
		}),
		notify.On(func(ctx context.Context, e *defset.DefSet, provisionerCache *provisioner.Cache) {
			provisionerCache.Refresh()
		}),
		notify.On(func(ctx context.Context, e *defset.DefSet, pinnedServices *units.PinnedInstances) {
			pinnedServices.Refresh(e)
		}),
		notify.On(func(ctx context.Context, e *cueloader.CueModuleChanged, defSetLoader *defset.Loader) {
			defSetLoader.LoadDefSet()
		}),

		// write spawns for others to see
		httpevents.NewJSONRequester[units.SpawnEventFields]("PUT", mustGetenv("SUBSTRATE_EVENT_WRITER_URL")+"/substrate/services/spawns"),
		httpevents.NewJSONSubscription(
			"POST",
			mustGetenv("SUBSTRATE_EVENT_STREAM_URL"),
			event.QueryLatestByPathPrefix("/substrate/services/exports"),
			notify.On(func(ctx context.Context, e event.Notification, t *struct{}) {
				exports, err := event.Unmarshal[provisioner.Fields](e.Events, true)
				if err != nil {
					slog.Info("error decoding event as provisioner.Fields", "err", err)
					return
				}

				srm := provisioner.ServicesRootMap{}
				for _, ex := range exports {
					p, ok := ex["path"].(string)
					if !ok {
						continue
					}

					p = strings.TrimPrefix(p, "/substrate/services/exports")
					split := filepath.SplitList(p)
					if len(split) < 2 {
						continue
					}

					serviceName := split[0]
					instanceName := split[1]
					if srm[serviceName] == nil {
						srm[serviceName] = &provisioner.InstancesRoot{
							Instances: map[string]*provisioner.Instance{},
						}
					}

					srm[serviceName].Instances[instanceName] = &provisioner.Instance{
						ServiceName: serviceName,
						Exports:     ex,
					}
				}

				servicesRootMapSlot.Store(&srm)
			}),
		),

		// TODO this should switch to just using the events service
		notify.On(func(ctx context.Context, e *cueloader.CueModuleChanged, defsAnnouncer *httpevents.EventStream[*defset.DefSet]) {
			// announce it
			if e.Error != nil {
				log.Printf("err on update: %s", defset.FmtErr(e.Error))
			} else {
				if b, err := cueloader.Marshal(e.Files, e.CueLoadConfigWithFiles); err == nil {
					defsAnnouncer.AnnounceRaw(b)
				} else {
					log.Printf("error encoding cue defs for announce: %s", err)
				}
			}
		}),
	}

	engine.Run(units...)
}
