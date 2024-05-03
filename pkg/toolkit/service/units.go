package service

import (
	"context"
	"log"
	"log/slog"
	"os"
	"strings"

	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/exports"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type Units struct {
	Units []engine.Unit
}

func NewUnits(us ...engine.Unit) *Units {
	units := &Units{}
	for _, u := range us {
		units.Units = append(units.Units, u)
		if dep, ok := u.(engine.Depender); ok {
			units.Units = append(units.Units, dep.Assembly()...)
		}
	}
	return units
}

func (u Units) Assembly() []engine.Unit {
	return u.Units
}

type Service struct {
	Daemon *daemon.Framework

	units []engine.Unit

	ExportsRoute  string
	CommandsRoute string
}

func (s *Service) initialize() {
	log.Printf("Service.initialize()")

	if s.CommandsRoute == "" {
		s.CommandsRoute = "/commands"
	}

	if s.ExportsRoute == "" {
		s.ExportsRoute = "/exports"
	}

	s.units = NewUnits(
		&httpframework.Framework{},
		&httpframework.RequestLogger{},
		&httpframework.StripPrefix{
			Prefix: strings.TrimSuffix(os.Getenv("SUBSTRATE_URL_PREFIX"), "/"),
		},

		&commands.Aggregate{},
		&commands.ExportCommands{},
		&commands.HTTPHandler{
			Debug: true,
			Route: s.CommandsRoute,
		},

		httpevents.NewJSONRequester[exports.Exports]("PUT", os.Getenv("INTERNAL_SUBSTRATE_EXPORTS_URL")),
		httpevents.NewJSONEventStream[exports.Exports]("GET "+s.ExportsRoute),
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
				log.Printf("error computing exports: %s", err.Error())
				return
			}
			if t.EventStream != nil {
				t.EventStream.Announce(union)
			}
			if t.Requester != nil {
				go t.Requester.Do(ctx, union)
			}
		}),
	).Units
}

func (s *Service) Assembly() []engine.Unit {
	if s.units == nil {
		s.initialize()
	}
	return s.units
}

func (m *Service) InitializeCLI(root *cli.Command) {
	// This is gross.
	slog.SetLogLoggerLevel(slog.LevelDebug)

	// a workaround for an unresolved issue in toolkit-go/engine
	// for figuring out if its a CLI or a daemon program...
	root.Run = func(ctx *cli.Context, args []string) {
		if err := m.Daemon.Run(ctx); err != nil {
			log.Printf("daemon failed with %#v", err)
			log.Fatal(err)
		}
	}
}
