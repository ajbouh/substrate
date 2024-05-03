package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/containers/podman/v4/pkg/bindings"
	"github.com/containers/podman/v4/pkg/specgen"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/client"
	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"

	specs "github.com/opencontainers/runtime-spec/specs-go"

	"cuelang.org/go/cue"
	"cuelang.org/go/cue/cuecontext"
	"cuelang.org/go/cue/load"
	"github.com/sirupsen/logrus"

	cueerrors "cuelang.org/go/cue/errors"
	"github.com/ajbouh/substrate/images/substrate/activityspec"
	substratedb "github.com/ajbouh/substrate/images/substrate/db"
	"github.com/ajbouh/substrate/images/substrate/defset"
	substratefs "github.com/ajbouh/substrate/images/substrate/fs"
	substratehttp "github.com/ajbouh/substrate/images/substrate/http"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
	dockerprovisioner "github.com/ajbouh/substrate/images/substrate/provisioner/docker"
	podmanprovisioner "github.com/ajbouh/substrate/images/substrate/provisioner/podman"
	"github.com/ajbouh/substrate/pkg/cueloader"
)

func mustGetenv(name string) string {
	value := os.Getenv(name)
	if value == "" {
		log.Fatalf("%s not set", name)
	}
	return value
}

func newProvisioner(cudaAllowed bool) provisioner.Driver {
	switch os.Getenv("SUBSTRATE_PROVISIONER") {
	case "docker":
		return newDockerProvisioner(cudaAllowed)
	case "podman", "":
		return newPodmanProvisioner(cudaAllowed)
	}

	return nil
}

func newDockerProvisioner(cudaAllowed bool) *dockerprovisioner.P {
	cli, err := client.NewEnvClient()
	if err != nil {
		log.Fatalf("error starting client: %s", err)
	}

	mounts := []mount.Mount{}
	for _, m := range strings.Split(os.Getenv("SUBSTRATE_SERVICE_DOCKER_MOUNTS"), ",") {
		source, target, ok := strings.Cut(m, ":")
		if ok {
			mounts = append(mounts, mount.Mount{
				// Type:   mount.TypeBind,
				Type:   mount.TypeVolume,
				Source: source,
				Target: target,
			})
		}
	}

	prep := func(h *container.HostConfig) {
		h.Mounts = append(h.Mounts, mounts...)

		if cudaAllowed {
			h.DeviceRequests = append(h.DeviceRequests, container.DeviceRequest{
				Driver:       "nvidia",
				Count:        -1,
				Capabilities: [][]string{{"gpu"}},
			})
		}
	}

	p := dockerprovisioner.New(
		cli,
		mustGetenv("SUBSTRATE_NAMESPACE"),
		mustGetenv("SUBSTRATE_INTERNAL_NETWORK"),
		mustGetenv("SUBSTRATE_EXTERNAL_NETWORK"),
		mustGetenv("SUBSTRATE_RESOURCEDIRS_ROOT"),
		strings.Split(os.Getenv("SUBSTRATE_RESOURCEDIRS_PATH"), ":"),
		prep,
	)
	ctx := context.Background()
	go func() {
		log.Printf("cleaning up...")
		p.Cleanup(ctx)
		log.Printf("clean up done")
	}()
	return p
}

func newPodmanProvisioner(cudaAllowed bool) *podmanprovisioner.P {
	prep := func(s *specgen.SpecGenerator) {
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
	}

	p := podmanprovisioner.New(
		func(ctx context.Context) (context.Context, error) {
			return bindings.NewConnection(ctx, os.Getenv("DOCKER_HOST"))
		},
		mustGetenv("SUBSTRATE_NAMESPACE"),
		mustGetenv("SUBSTRATE_INTERNAL_NETWORK"),
		mustGetenv("SUBSTRATE_EXTERNAL_NETWORK"),
		mustGetenv("SUBSTRATE_RESOURCEDIRS_ROOT"),
		strings.Split(os.Getenv("SUBSTRATE_RESOURCEDIRS_PATH"), ":"),
		prep,
	)
	ctx := context.Background()
	go func() {
		log.Printf("cleaning up...")
		p.Cleanup(ctx)
		log.Printf("clean up done")
	}()
	return p
}

func cueDefsLoadTags() []string {
	liveEdit := "false"
	if os.Getenv("SUBSTRATE_CUE_DEFS_LIVE") != "" {
		liveEdit = "true"
	}
	cueDefsLoadTags := []string{
		// Include enough config to interpret things again
		"live_edit=" + liveEdit,
		"namespace=" + mustGetenv("SUBSTRATE_NAMESPACE"),
		"use_varset=" + mustGetenv("SUBSTRATE_USE_VARSET"),
		"cue_defs=" + mustGetenv("SUBSTRATE_CUE_DEFS"),
	}

	if os.Getenv("SUBSTRATE_SOURCE_DIRECTORY") != "" {
		cueDefsLoadTags = append(cueDefsLoadTags, "build_source_directory="+os.Getenv("SUBSTRATE_SOURCE_DIRECTORY"))
	}

	return cueDefsLoadTags
}

func initialCueLoadConfig() *load.Config {
	cueDefsDir := mustGetenv("SUBSTRATE_CUE_DEFS")

	cueDefsLiveDir := os.Getenv("SUBSTRATE_CUE_DEFS_LIVE")
	if cueDefsLiveDir != "" {
		entries, err := os.ReadDir(cueDefsLiveDir)
		if err == nil {
			if len(entries) == 0 {
				fmt.Printf("SUBSTRATE_CUE_DEFS_LIVE (%s) is empty; loading from SUBSTRATE_CUE_DEFS (%s) instead\n", cueDefsLiveDir, cueDefsDir)
			} else {
				fmt.Printf("SUBSTRATE_CUE_DEFS_LIVE (%s) is nonempty; loading from it instead of SUBSTRATE_CUE_DEFS (%s)\n", cueDefsLiveDir, cueDefsDir)
				cueDefsDir = cueDefsLiveDir
			}
		} else {
			if errors.Is(err, os.ErrNotExist) {
				fmt.Printf("SUBSTRATE_CUE_DEFS_LIVE (%s) does not exist; loading from SUBSTRATE_CUE_DEFS (%s) instead\n", cueDefsLiveDir, cueDefsDir)
			} else {
				fmt.Printf("error while listing SUBSTRATE_CUE_DEFS_LIVE (%s): %s; loading from SUBSTRATE_CUE_DEFS (%s) instead\n", cueDefsLiveDir, err, cueDefsDir)
			}
		}
	} else {
		fmt.Printf("SUBSTRATE_CUE_DEFS_LIVE not set; loading from SUBSTRATE_CUE_DEFS (%s) instead\n", cueDefsDir)
	}

	return &load.Config{
		Dir:  cueDefsDir,
		Tags: cueDefsLoadTags(),
	}
}

func newCueLoader(internalSubstrateOrigin string) []engine.Unit {
	origin := mustGetenv("ORIGIN")

	// TODO stop hardcoding these
	sigarLoader := cueloader.NewStreamLoader(context.Background(), internalSubstrateOrigin+"/sigar")
	nvmlLoader := cueloader.NewStreamLoader(context.Background(), internalSubstrateOrigin+"/nvml")

	return []engine.Unit{
		sigarLoader,
		nvmlLoader,
		cueloader.NewCueLoader(
			":defs",
			cueloader.FillPathEncodeTransformCurrent(
				cue.MakePath(cue.Str("system"), cue.Str("metrics"), cue.Str("sigar")),
				sigarLoader.Get,
			),
			cueloader.FillPathEncodeTransformCurrent(
				cue.MakePath(cue.Str("system"), cue.Str("metrics"), cue.Str("nvml")),
				nvmlLoader.Get,
			),
			cueloader.LookupPathTransform(cue.MakePath(cue.Def("#out"), cue.Str("services"))),
			cueloader.FillPathEncodeTransform(
				cue.MakePath(cue.AnyString, cue.Str("spawn").Optional(), cue.Str("environment")),
				map[string]string{
					"JAMSOCKET_IFRAME_DOMAIN":   origin,
					"SUBSTRATE_ORIGIN":          origin,
					"PUBLIC_EXTERNAL_ORIGIN":    origin,
					"ORIGIN":                    origin,
					"INTERNAL_SUBSTRATE_ORIGIN": internalSubstrateOrigin,
				},
			),
		),
	}
}

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

	// TODO stop hardcoding these
	internalSubstrateOrigin := "http://substrate:8080"

	listenAddress := ":" + os.Getenv("PORT")
	ln, err := net.Listen("tcp", listenAddress)
	if err != nil {
		log.Fatalf("couldn't listen: %s", err)
	}

	units := []engine.Unit{
		Main{
			listen:        ln,
			listenAddress: listenAddress,
		},
		newProvisioner(cudaAllowed),
		db,
		&defset.CueMutex{},
		provisioner.NewCache(),
		cuecontext.New(),
		initialCueLoadConfig(),
		&AnnounceDefsOnSourcesLoaded{},
		cueloader.NewAnnouncer("application/json"),
		substratefs.NewLayout(mustGetenv("SUBSTRATEFS_ROOT")),
		&substratehttp.Handler{
			User:                    "user",
			InternalSubstrateOrigin: internalSubstrateOrigin,
		},
		&ProvisionWithCurrentDefSet{},
		&RefreshServicesOnSourcesLoaded{},
		&cueloader.CueConfigWatcher{
			ReadyFile: "ready",
		},
		&LoadDefSetOnCueModuleChanged{},
		&defset.Loader{},
		&RefreshCurrentDefSetOnStreamUpdate{},
	}
	units = append(units, newCueLoader(internalSubstrateOrigin)...)
	engine.Run(units...)
}

type LoadDefSetOnCueModuleChanged struct {
	DefSetLoader *defset.Loader
}

func (c *LoadDefSetOnCueModuleChanged) CueModuleChanged(err error, files map[string]string, cueLoadConfigWithFiles *load.Config) {
	c.DefSetLoader.LoadDefSet()
}

type RefreshCurrentDefSetOnStreamUpdate struct {
	StreamLoader     []*cueloader.StreamLoader
	DefSetLoader     *defset.Loader
	ProvisionerCache *provisioner.Cache
}

func (o *RefreshCurrentDefSetOnStreamUpdate) Serve(ctx context.Context) {
	for _, l := range o.StreamLoader {
		l.Listen(ctx, func(v any) { o.DefSetLoader.LoadDefSet() })
	}
}

type ProvisionWithCurrentDefSet struct {
	CurrentDefSet   defset.CurrentDefSet
	ProvisionDriver provisioner.Driver
}

func (l *ProvisionWithCurrentDefSet) Spawn(ctx context.Context, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResponse, <-chan provisioner.Event, error) {
	res, err := l.CurrentDefSet.CurrentDefSet().SpawnService(ctx, l.ProvisionDriver, req)
	if err != nil {
		return res, nil, err
	}
	ch, err := l.ProvisionDriver.StatusStream(ctx, res.Name)
	return res, ch, err
}

func (l *ProvisionWithCurrentDefSet) Shutdown(ctx context.Context, name string, reason error) error {
	return l.ProvisionDriver.Kill(ctx, name)
}

func (l *ProvisionWithCurrentDefSet) Peek(ctx context.Context, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResolution, error) {
	return l.CurrentDefSet.CurrentDefSet().ResolveService(ctx, req)
}

type RefreshServicesOnSourcesLoaded struct {
	ProvisionerCache *provisioner.Cache
	ctx              context.Context
}

func (l *RefreshServicesOnSourcesLoaded) Serve(ctx context.Context) {
	l.ctx = ctx
}

func (l *RefreshServicesOnSourcesLoaded) DefSetLoaded(defSet *defset.DefSet) {
	l.ProvisionerCache.Refresh(l.ctx)
}

type AnnounceDefsOnSourcesLoaded struct {
	DefsAnnouncer *cueloader.Announcer
}

func (l *AnnounceDefsOnSourcesLoaded) DefSetSourcesLoaded(err error, files map[string]string, cueLoadConfigWithFiles *load.Config) {
	if err != nil {
		log.Printf("err on update: %s", fmtErr(err))
		return
	}

	if b, err := cueloader.Marshal(files, cueLoadConfigWithFiles); err == nil {
		l.DefsAnnouncer.Announce(b)
	} else {
		log.Printf("error encoding cue defs for announce: %s", err)
	}
}

func fmtErr(err error) string {
	errs := cueerrors.Errors(err)
	messages := make([]string, 0, len(errs))
	for _, err := range errs {
		messages = append(messages, err.Error())
	}
	return strings.Join(messages, "\n")
}

func (m *Main) Serve(ctx context.Context) {
	server := &http.Server{
		Addr:    m.listenAddress,
		Handler: m.Handler,
	}

	binaryPath, _ := os.Executable()
	if binaryPath == "" {
		binaryPath = "server"
	}
	log.Printf("%s listening on %q", filepath.Base(binaryPath), server.Addr)

	if server.TLSConfig == nil {
		log.Fatal(server.Serve(m.listen))
	} else {
		log.Fatal(server.ServeTLS(m.listen, "", ""))
	}
}
