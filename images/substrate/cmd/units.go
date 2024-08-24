package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
	"strings"
	"sync"

	"cuelang.org/go/cue"
	cueerrors "cuelang.org/go/cue/errors"
	"cuelang.org/go/cue/load"
	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

func mustGetenv(name string) string {
	value := os.Getenv(name)
	if value == "" {
		log.Fatalf("%s not set", name)
	}
	return value
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

type Loader[T any] interface {
	Load() T
}

type ServiceSpawned struct {
	Req *activityspec.ServiceSpawnRequest
	Res *activityspec.ServiceSpawnResponse
}

type SpawnWithCurrentDefSet struct {
	DefSetLoader    Loader[*defset.DefSet]
	ProvisionDriver provisioner.Driver
	ServiceSpawned  []notify.Notifier[ServiceSpawned]
}

func (l *SpawnWithCurrentDefSet) Spawn(ctx context.Context, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResponse, <-chan provisioner.Event, error) {
	s := l.DefSetLoader.Load()
	driver := l.ProvisionDriver

	serviceSpawnResolution, err := s.ResolveService(ctx, req)
	if err != nil {
		return nil, nil, err
	}

	serviceSpawnResponse, err := driver.Spawn(ctx, serviceSpawnResolution)
	if err != nil {
		return nil, nil, err
	}

	notify.Notify(ctx, l.ServiceSpawned, ServiceSpawned{Req: req, Res: serviceSpawnResponse})

	if err != nil {
		return serviceSpawnResponse, nil, err
	}
	ch, err := l.ProvisionDriver.StatusStream(ctx, serviceSpawnResponse.Name)
	return serviceSpawnResponse, ch, err
}

func (l *SpawnWithCurrentDefSet) Shutdown(ctx context.Context, name string, reason error) error {
	return l.ProvisionDriver.Kill(ctx, name)
}

func (l *SpawnWithCurrentDefSet) Peek(ctx context.Context, req *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResolution, error) {
	return l.DefSetLoader.Load().ResolveService(ctx, req)
}

type PinnedInstances struct {
	InternalSubstrateOrigin string

	ctx  context.Context
	mu   sync.Mutex
	pins map[string]func(err error)
}

func (l *PinnedInstances) Initialize() {
	l.pins = map[string]func(err error){}
}

func (l *PinnedInstances) Serve(ctx context.Context) {
	l.ctx = ctx
}

func (l *PinnedInstances) Refresh(defSet *defset.DefSet) {
	// copy forward, delete whatever's left in stale
	stale := l.pins
	pins := map[string]func(err error){}
	type freshPin struct {
		ctx    context.Context
		cancel func(err error)
	}
	fresh := map[string]freshPin{}

	l.mu.Lock()
	for _, serviceCueValue := range defSet.ServicesCueValues {
		instancesValue := serviceCueValue.LookupPath(cue.MakePath(cue.Str("instances")))

		instances, err := instancesValue.Fields()
		if err != nil {
			slog.Info("error looking up if service instances", "err", err.Error())
			continue
		}

		for instances.Next() {
			sel := instances.Selector()
			if !sel.IsString() {
				continue
			}
			instanceName := sel.Unquoted()

			pinnedValue := instances.Value().LookupPath(cue.MakePath(cue.Str("pinned")))
			if !pinnedValue.Exists() {
				continue
			}

			pinned, err := pinnedValue.Bool()
			if err != nil {
				slog.Info("error determining if service instance is pinned", "instanceName", instanceName, "err", err.Error())
				continue
			}

			cancel := l.pins[instanceName]
			if pinned {
				if cancel == nil {
					var ctx context.Context
					// TODO should this be l.ctx?
					ctx, cancel = context.WithCancelCause(context.Background())
					fresh[instanceName] = freshPin{ctx: ctx, cancel: cancel}
					go func() {
						<-ctx.Done()
						// TODO show this as an error if it is one.
						slog.Info("pinned service instance connection gone", "instanceName", instanceName, "err", ctx.Err())
					}()
				} else {
					// if it's still pinned, it's not stale!
					slog.Info("pinned service instance still here", "instanceName", instanceName)
					delete(stale, instanceName)
				}
				pins[instanceName] = cancel
			}
		}
	}

	// remember pins and cancel stales
	l.pins = pins
	for instanceName, cancel := range stale {
		slog.Info("cancelling now-unpinned service instance", "instanceName", instanceName)
		cancel(fmt.Errorf("unpinned"))
	}

	l.mu.Unlock()

	for instanceName, p := range fresh {
		go func() {
			url := l.InternalSubstrateOrigin + "/" + instanceName + "/"
			slog.Info("connecting to now-pinned service instance", "instanceName", instanceName, "url", url)
			req, err := http.NewRequestWithContext(p.ctx, "GET", url, nil)
			if err != nil {
				slog.Info("cancelling pinned context", "err", err)
				p.cancel(err)
				return
			}

			slog.Info("reading stream events", "instanceName", instanceName, "url", url)
			err = httpevents.ReadStreamEvents(http.DefaultClient, req, func(event *httpevents.Event) error {
				slog.Info("saw stream event", "instanceName", instanceName)
				return nil
			})
			slog.Info("cancelling pinned context", "err", err)
			p.cancel(err)
		}()
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
