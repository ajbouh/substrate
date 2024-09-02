package service

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"strings"

	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/exports"
	"github.com/ajbouh/substrate/pkg/toolkit/httpevents"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
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

	BaseURL      string
	ExportsRoute string
}

func (s *Service) initialize() {
	log.Printf("Service.initialize()")

	if s.ExportsRoute == "" {
		s.ExportsRoute = "/exports"
	}

	originURL, _ := url.Parse(s.BaseURL)

	s.units = NewUnits(
		&httpframework.Framework{},
		&httpframework.HairpinHTTPClient{
			Fallback: http.DefaultClient,
			Match: func(r *http.Request) bool {
				return r.URL.Host == "" || (originURL != nil && originURL.Scheme == r.URL.Scheme && originURL.Host == r.URL.Host)
			},
		},
		&httpframework.RequestLogger{},
		&httpframework.StripPrefix{
			Prefix: strings.TrimSuffix(os.Getenv("SUBSTRATE_URL_PREFIX"), "/"),
		},

		&links.Aggregate{},
		&links.AggregateQuerierCommand{},

		&commands.Aggregate{},
		&commands.ExportCommands{},
		&commands.HTTPResourceReflectHandler{
			Debug:   true,
			BaseURL: s.BaseURL,

			DefaultHTTPResourceReflectPath: "/",
		},
		&commands.HTTPRunHandler{
			Debug:                 true,
			CatchallRunnerPattern: "POST /{$}",
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
				ute := &json.UnmarshalTypeError{}
				if errors.As(err, &ute) {
					log.Printf("error computing exports: %s: UnmarshalTypeError %v - %v - %v", err.Error(), ute.Value, ute.Type, ute.Offset)
				} else {
					log.Printf("error computing exports: %s", err.Error())
				}
				return
			}

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
