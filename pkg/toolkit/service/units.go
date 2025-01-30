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

	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/engine/daemon"
	"tractor.dev/toolkit-go/engine/cli"

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

	ExternalSubstrateBaseURL string
	InternalSubstrateBaseURL string
}

type UnifiedExports exports.Exports

func (s *Service) initialize() {
	log.Printf("Service.initialize()")

	if s.ExportsRoute == "" {
		s.ExportsRoute = "/exports"
	}

	if s.ExternalSubstrateBaseURL == "" {
		s.ExternalSubstrateBaseURL = os.Getenv("SUBSTRATE_ORIGIN")
	}
	if s.InternalSubstrateBaseURL == "" {
		s.InternalSubstrateBaseURL = os.Getenv("INTERNAL_SUBSTRATE_ORIGIN")
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
		links.AggregateQuerierCommand,

		&commands.Aggregate{},
		&ExportCommands{},
		&commands.TransformingDefRunner{},
		&commands.Interpreter{},
		&commands.HTTPCapability{
			// Since there's a different address for internal requests than external, we have to do that swap. It feels kinda gross to
			// need to do this at all...
			Rewrite: func(r *http.Request) (*http.Request, error) {
				// slog.Info("considering transform for command", "name", n, "d.Run.HTTP.Request.URL", d.Run.HTTP.Request.URL)
				urlStr := r.URL.String()
				if strings.HasPrefix(urlStr, s.ExternalSubstrateBaseURL) {
					trimmed := strings.TrimPrefix(urlStr, s.ExternalSubstrateBaseURL)
					var err error
					r.URL, err = url.Parse(s.InternalSubstrateBaseURL + trimmed)
					return r, err
					// slog.Info("considering transformed for command", "name", n, "d.Run.HTTP.Request.URL", d.Run.HTTP.Request.URL)
				}
				return r, nil
			},
		},
		&commands.ReflectCapability{
			BaseURL: s.InternalSubstrateBaseURL,
			DefTransform: func(ctx context.Context, name string, commandDef *commands.Msg) (string, *commands.Msg) {
				def := handle.FindMsgBasis(commandDef)
				if def == nil || def.Cap == nil || *def.Cap != "http" {
					return name, commandDef
				}

				u, err := commands.GetPath[string](def.Data, "request", "url")
				if err != nil {
					return name, commandDef
				}

				if !strings.HasPrefix(u, "//") {
					return name, commandDef
				}

				out := commandDef.MustClone()
				def = handle.FindMsgBasis(out)
				u = s.InternalSubstrateBaseURL + u
				if err := commands.SetPath(def.Data, []string{"request", "url"}, u); err != nil {
					return name, commandDef
				}

				return name, out
			},
		},
		&handle.HTTPResourceReflectHandler{
			Debug:   true,
			BaseURL: s.BaseURL,

			DefaultHTTPResourceReflectPath: "/",
		},
		&handle.HTTPRunHandler{
			Debug:                 true,
			CatchallRunnerPattern: "POST /{$}",
		},

		notify.NewQueue(),
		httpevents.NewJSONRequester[UnifiedExports]("PUT", os.Getenv("INTERNAL_SUBSTRATE_EXPORTS_URL")),
		httpevents.NewJSONEventStream[UnifiedExports]("GET "+s.ExportsRoute),
		notify.On(func(
			ctx context.Context,
			e exports.Changed,
			t *struct {
				NotifyQueue *notify.Queue
				Sources     []exports.Source
				Notifiers   []notify.Notifier[UnifiedExports]
			},
		) {
			if len(t.Notifiers) == 0 {
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

			notify.Later(t.NotifyQueue, t.Notifiers, UnifiedExports(union))
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
