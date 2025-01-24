package units

import (
	"context"
	"log"
	"log/slog"
	"net/http"

	"cuelang.org/go/cue"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"
)

type LinkToServices struct {
	DefSetLoader notify.Loader[*defset.DefSet]
}

func (m *LinkToServices) QueryLinks(ctx context.Context) (links.Links, error) {
	ds := m.DefSetLoader.Load()
	services := map[string]struct{}{}
	err := ds.DecodeLookupPath(cue.MakePath(cue.Str("services")), &services)
	if err != nil {
		log.Printf("err on update: %s", ds.FmtErr(err))
		return nil, err
	}

	l := links.Links{}
	for serviceName := range services {
		l["service/"+serviceName] = links.Link{
			Rel:  "service",
			HREF: "/substrate/v1/services/" + serviceName,
		}
	}

	return l, nil
}

type ServiceDescribeReturns struct {
	Description string `json:"description"`
}

var RootServiceDescribeCommand = commands.DefIndex{
	"describe": &commands.Msg{
		Description: "Describe the resource",
		Msg: commands.Cap("http", commands.Fields{
			"request": commands.Fields{
				"headers": map[string][]string{
					"Content-Type": {"application/json"},
				},
				"url":    "/substrate/v1/services/substrate/describe",
				"method": http.MethodGet,
			},
		}),
		MsgOut: commands.Bindings{
			commands.NewDataPointer("data", "returns", "description"): commands.NewDataPointer("msg", "data", "response", "body", "description"),
		},
	},
}

var ServiceDescribeCommand = handle.HTTPCommand(
	"describe", "Describe the resource",
	"GET /substrate/v1/services/{service}/describe", "/substrate/v1/services/{service}",
	func(ctx context.Context,
		t *struct {
			DefSetLoader notify.Loader[*defset.DefSet]
		},
		args struct {
			Service string `json:"service" path:"service"`
		},
	) (ServiceDescribeReturns, error) {
		returns := ServiceDescribeReturns{
			Description: "",
		}

		ds := t.DefSetLoader.Load()
		err := ds.DecodeLookupPath(cue.MakePath(cue.Str("services"), cue.Str(args.Service), cue.Str("description")), &returns.Description)
		if err != nil {
			return returns, err
		}

		return returns, nil
	},
)

type LinksQueryReturns struct {
	Links links.Links `json:"links"`
}

var ServiceLinksQueryCommand = handle.HTTPCommand(
	"links:query", "Query links",
	"GET /substrate/v1/services/{service}/links", "/substrate/v1/services/{service}",
	func(ctx context.Context,
		t *struct {
		},
		args struct {
		},
	) (LinksQueryReturns, error) {
		l := links.Links{}
		// TODO return links to instances OR a link to the default instance
		return LinksQueryReturns{
			Links: l,
		}, nil
	},
)

type ServiceCommands struct {
	DefSetLoader notify.Loader[*defset.DefSet]
	DefRunner    commands.DefRunner
}

var _ commands.Reflector = (*ServiceCommands)(nil)

func (m *ServiceCommands) GetHTTPResourceReflectPath() string {
	return "/substrate/v1/services/{service}"
}

func (m *ServiceCommands) Reflect(ctx context.Context) (commands.DefIndex, error) {
	di := commands.DefIndex{}
	if m == nil {
		return di, nil
	}

	slog.Info("ServiceCommands.Reflect")
	pv := handle.ContextPathValuer(ctx)
	if pv == nil {
		return di, nil
	}

	serviceName := pv.PathValue("service")
	if serviceName == "" {
		return di, nil
	}

	ds := m.DefSetLoader.Load()
	if ds == nil {
		return di, nil
	}

	ok, err := ds.DecodeLookupPathIfExists(cue.MakePath(cue.Str("commands"), cue.Str(serviceName)), &di)
	if ok {
		return di, err
	}

	return di, nil
}
