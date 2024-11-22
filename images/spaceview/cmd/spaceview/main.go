package main

import (
	"fmt"
	"log"
	"net/url"
	"os"
	"strings"

	"github.com/ajbouh/substrate/images/spaceview/units"

	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
	"github.com/ajbouh/substrate/pkg/toolkit/service"

	"tractor.dev/toolkit-go/engine/fs/localfs"
	"tractor.dev/toolkit-go/engine/fs/workingpathfs"
)

func main() {
	fsys := workingpathfs.New(localfs.New(), "/spaces/space")

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
			return urlPrefix + "/tree" + path
		},
		SpaceURL: func() string {
			return urlPrefix
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

		&units.FileTree{
			// Prefix: urlPrefix,
			FS: fsys,
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
