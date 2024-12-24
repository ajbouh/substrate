package units

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

// RouteAliasHandler matches /{alias}/ requests and responds to them with either a 404 or a redirect to
// the linked href with name "{alias}" and rel="redirect". Here, {alias} is a placeholder for any valid
// path fragment.
type RouteAliasHandler struct {
	DefRunner commands.DefRunner
}

var _ httpframework.MuxContributor = (*RouteAliasHandler)(nil)

func (h *RouteAliasHandler) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	handler := func(w http.ResponseWriter, r *http.Request) {
		alias := r.PathValue("alias")

		// TODO use rest
		// rest := r.PathValue("rest")

		if alias == "" {
			http.Error(w, "", http.StatusNotFound)
			return
		}

		returns, err := h.DefRunner.RunDef(ctx,
			commands.Cap("reflect", commands.Fields{
				// TODO somehow inherit space name from environment
				"url":  "//spaceview;space=substrate-bootstrap-0/",
				"name": "links:query",
				"parameters": commands.Fields{
					"rel":  "redirect",
					"name": alias,
				},
			}), nil)
		slog.Info("RouteAliasHandler links:query", "alias", alias, "returns", returns, "err", err)

		l, err := commands.GetPath[links.Links](returns, "response", "body", "links")
		slog.Info("RouteAliasHandler links:query GetPath", "l", l, "err", err)
		if err != nil {
			http.Error(w, "", http.StatusInternalServerError)
			return
		}

		match, ok := l[alias]
		slog.Info("RouteAliasHandler links:query GetPath", "match", match, "ok", ok)
		if !ok {
			http.Error(w, "", http.StatusNotFound)
			return
		}

		http.Redirect(w, r, match.HREF, http.StatusTemporaryRedirect)
	}

	mux.HandleFunc("/{alias}", handler)
	mux.HandleFunc("/{alias}/{rest...}", handler)
}
