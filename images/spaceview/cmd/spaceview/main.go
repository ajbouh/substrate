package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/url"
	"os"
	"strings"

	"github.com/containers/podman/v4/libpod/define"
	"github.com/containers/podman/v4/pkg/bindings"
	"github.com/containers/podman/v4/pkg/specgen"
	specs "github.com/opencontainers/runtime-spec/specs-go"

	"github.com/ajbouh/substrate/images/spaceview/units"

	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
	"github.com/ajbouh/substrate/pkg/toolkit/service"

	"tractor.dev/toolkit-go/engine/fs/localfs"
	"tractor.dev/toolkit-go/engine/fs/workingpathfs"
)

func main() {
	spaceDir := "/spaces/space"
	spacePTYDir := spaceDir
	spaceHostDir := os.Getenv("SUBSTRATE_SPACE_space_HOST_DIR")
	slog.Info("spaceview", "spaceHostDir", spaceHostDir)

	fsys := workingpathfs.New(localfs.New(), spaceDir)

	// HACK don't let this be available.
	urlPrefix := strings.TrimSuffix(os.Getenv("SUBSTRATE_URL_PREFIX"), "/")
	// os.Setenv("SUBSTRATE_URL_PREFIX", "")

	originURL, err := url.Parse(os.Getenv("ORIGIN"))
	if err != nil {
		log.Fatal(fmt.Errorf("invalid ORIGIN: %w", err))
	}

	spaceID := os.Getenv("SPACE_ID")

	urls := &units.SpaceURLs{
		SpaceTreePathURL: func(path string) string {
			return urlPrefix + "/tree/" + strings.TrimPrefix(path, "/")
		},
		SpaceURL: func() string {
			return urlPrefix + "/"
		},
	}

	engine.Run(
		// &httpframework.IdleTracker{
		// 	IdleAfter: 10 * time.Second,
		// 	IdleNow: func(at time.Time) {
		// 		log.Printf("idle at %s; terminating...", at)
		// 		engine.Terminate()
		// 	},
		// },

		fsys,
		urls,

		units.ReadCommand,
		units.WriteCommand,

		&units.SpaceCommands{},
		units.CommandsWriteCommand,
		units.CommandsRemoveCommand,

		&units.SpaceLinks{
			Static: links.Links{
				"tree": links.Link{
					Rel:  "tree",
					HREF: urls.SpaceTreePathURL(""),
				},
				"eventstore": links.Link{
					Rel:  "eventstore",
					HREF: "/events;data=" + spaceID + "/",
				},
			},
		},
		units.LinksWriteCommand,
		units.LinksRemoveCommand,
		units.QueryLinksTreePathCommand,

		&units.Rebase{},
		units.QueryLinksRebaseTreePathCommand,

		&units.FileTree{
			FS: fsys,
		},

		&units.PodmanContainerPTY{
			Image:    "docker.io/library/alpine:latest",
			StartCmd: []string{"sh", "-c", "sleep infinity"},

			Connect: func(ctx context.Context) (context.Context, error) {
				return bindings.NewConnection(context.Background(), os.Getenv("DOCKER_HOST"))
			},
			Prepare: func(ctx context.Context, s *specgen.SpecGenerator) error {
				s.Annotations = map[string]string{}
				s.Annotations[define.RunOCIKeepOriginalGroups] = "1"

				s.SelinuxOpts = []string{
					"disable",
				}

				// if cudaAllowed {
				// 	s.Devices = []specs.LinuxDevice{
				// 		{
				// 			Path: "nvidia.com/gpu=all",
				// 		},
				// 	}
				// }

				// mount the space
				s.Mounts = append(s.Mounts, specs.Mount{
					Type:        "bind",
					Source:      spaceHostDir,
					Destination: spacePTYDir,
					Options:     []string{"rw"},
				})
				return nil
			},

			PTYUser: "root",
			PTYCmd:  []string{"sh"},
			PTYDir:  "/",
		},

		&units.VSCodeEditingForFS{
			Prefix: urlPrefix,
			Host:   originURL.Host,
			Scheme: originURL.Scheme,
			FS:     fsys,
		},

		&service.Service{
			ExportsRoute: "/{$}",
		},
	)
}
