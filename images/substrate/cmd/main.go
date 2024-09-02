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

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	substratedb "github.com/ajbouh/substrate/images/substrate/db"
	"github.com/ajbouh/substrate/images/substrate/defset"
	substratefs "github.com/ajbouh/substrate/images/substrate/fs"
	substratehttp "github.com/ajbouh/substrate/images/substrate/http"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
	podmanprovisioner "github.com/ajbouh/substrate/images/substrate/provisioner/podman"
	"github.com/ajbouh/substrate/images/substrate/space"
	"github.com/ajbouh/substrate/pkg/cueloader"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/exports"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
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

	units := []engine.Unit{
		&service.Service{
			BaseURL:       origin,
			ExportsRoute:  "/substrate/v1/exports",
			CommandsRoute: "/",
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

		&InstanceLinks{},

		&SpacesLinkQuerier{
			SpaceURL: func(space string) string {
				return "/substrate/v1/spaces/" + space
			},
		},
		&commands.HTTPResourceCommand{
			Pattern: "GET /substrate/v1/spaces",
			Handler: space.QueryCommand,
		},
		&commands.HTTPResourceCommand{
			Pattern: "POST /substrate/v1/spaces",
			Handler: space.NewCommand,
		},
		&commands.HTTPResourceCommand{
			ReflectPath: "/substrate/v1/spaces/{space}",
			Pattern:     "POST /substrate/v1/spaces/{space}/commit",
			Handler:     space.CommitCommand,
		},
		&commands.HTTPResourceCommand{
			ReflectPath: "/substrate/v1/spaces/{space}",
			Pattern:     "GET /substrate/v1/spaces/{space}/links",
			Handler:     space.LinksQueryCommand,
		},
		&commands.HTTPResourceCommand{
			Pattern: "DELETE /substrate/v1/spaces/{space}",
			Handler: space.DeleteCommand,
		},
		&commands.HTTPResourceCommand{
			Pattern: "GET /substrate/v1/spaces/{space}",
			Handler: space.GetCommand,
		},

		// TODO how do we want to handle authentication for this?
		&substratehttp.CORSMiddleware{
			Options: cors.Options{
				AllowCredentials: true,
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
		&substratehttp.ProxyHandler{
			User:                    "user",
			InternalSubstrateOrigin: internalSubstrateOrigin,
		},

		&notify.Slot[DefSetCommands]{},
		&commands.LoaderDelegate[*DefSetCommands]{},
		notify.On(func(ctx context.Context,
			e *defset.DefSet,
			t *struct {
				Slot           *notify.Slot[DefSetCommands]
				ExportsChanged []notify.Notifier[exports.Changed]
				HTTPClient     httpframework.HTTPClient
			}) {
			commands := DefSetCommands{
				HTTPClient: t.HTTPClient,
			}
			err := e.DecodeLookupPath(cue.MakePath(cue.Str("commands")), &commands.DefsMap)
			if err != nil {
				log.Printf("err on update: %s", fmtErr(err))
				t.Slot.StoreWithContext(ctx, nil)
				return
			}

			slog.Info("commands from defset", "commands", commands)
			t.Slot.StoreWithContext(ctx, &commands)
			slog.Info("stored commands from defset")

			// commands changed, so exports changed.
			notify.Notify(ctx, t.ExportsChanged, exports.Changed{})
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

		&space.SpacesViaContainerFilesystems{},
		notify.On(func(ctx context.Context, e ServiceSpawned, svcf *space.SpacesViaContainerFilesystems) {
			for name, p := range e.Res.ServiceSpawnResolution.Parameters {
				switch {
				case p.Space != nil:
					spec, _ := e.Res.ServiceSpawnResolution.Format()
					err = svcf.WriteSpawnLink(ctx, spec, name, p.Space.SpaceID)
				case p.Spaces != nil:
					// TODO
				}
			}
			if err != nil {
				log.Printf("error notifying ServiceSpawned listener: %s", err)
			}
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
	}

	evalHandler := &substratehttp.EvalHandler{
		Prefix: "/substrate",
	}
	units = append(units, evalHandler)
	units = append(units, evalHandler.Units()...)

	engine.Run(units...)
}

type SpacesLinkQuerier struct {
	SpaceURL      func(space string) string
	SpaceQueriers []activityspec.SpaceQuerier
}

func (s *SpacesLinkQuerier) QueryLinks(ctx context.Context) (links.Links, error) {
	e := links.Links{}

	for _, lister := range s.SpaceQueriers {
		spaces, err := lister.QuerySpaces(ctx)
		if err != nil {
			return nil, err
		}

		for _, space := range spaces {
			e["space/"+space.SpaceID] = links.Link{
				Rel: "space",
				URL: s.SpaceURL(space.SpaceID),
				Attributes: map[string]any{
					"space:created_at": space.CreatedAt,
				},
			}
		}
	}

	return e, nil
}

var _ links.Querier = (*SpacesLinkQuerier)(nil)

type DefSetCommands struct {
	DefsMap map[string]commands.DefIndex

	HTTPClient httpframework.HTTPClient
}

var _ commands.Delegate = (*DefSetCommands)(nil)

func (m *DefSetCommands) Commands(ctx context.Context) commands.Source {
	return commands.Dynamic(nil, func() []commands.Source {
		sources := []commands.Source{}
		if m != nil {
			for k, v := range m.DefsMap {
				sources = append(sources, commands.Prefixed(
					k+":",
					&commands.DefIndexRunner{
						Defs:   v,
						Client: m.HTTPClient,
					},
				))
			}
		}
		return sources
	})
}

type InstanceLinks struct {
	ProvisionerCache *provisioner.Cache
}

var _ links.Querier = (*InstanceLinks)(nil)

func (m *InstanceLinks) QueryLinks(ctx context.Context) (links.Links, error) {
	root := m.ProvisionerCache.AllInstanceExports()
	ents := links.Links{}
	for k, v := range root.Instances {
		ents["instance/"+k] = links.Link{
			Rel: "instance",
			URL: "/" + k,
			Attributes: map[string]any{
				"instance:service": v.ServiceName,
			},
		}
	}

	return ents, nil
}
