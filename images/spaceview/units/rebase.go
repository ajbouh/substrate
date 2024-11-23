package units

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
	"tractor.dev/toolkit-go/engine/fs"
)

// Serves FileTree, but nested under servicespec.
// /rebase/{servicespec}/tree/{path...}
// The links:query command for rebase/{servicespec}/tree/{path...} contains everything in /tree/{path...}, but *also* has a link to "base", which is /{servicespec}/
// Files served here can use this to "get back to" the thing they are a UI for

type Rebase struct {
	FileTree *FileTree
}

func (s *Rebase) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	// use "path" here to match filetree routes
	mux.Handle("GET /rebase/{servicespec}/tree/{path...}", s)
	mux.Handle("HEAD /rebase/{servicespec}/tree/{path...}", s)
}

func (s *Rebase) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	servicespec := r.PathValue("servicespec")
	http.StripPrefix("/rebase/"+servicespec, s.FileTree).ServeHTTP(w, r)
}

var QueryLinksRebaseTreePathCommand = handle.HTTPCommand(
	"links:query", "List links",
	"GET /links/rebase/{servicespec}", "/rebase/{servicespec}/tree/{path...}",
	func(ctx context.Context,
		t *struct {
			FS        fs.FS
			SpaceURLs *SpaceURLs
		},
		args struct {
			Path        string `json:"path" path:"path"`
			Servicespec string `json:"servicespec" path:"servicespec"`
		},
	) (lqr LinksQueryReturns, err error) {
		l, err := QueryLinksTreePathCommand.Run(ctx, "", commands.Fields{
			"path": args.Path,
		})
		if err != nil {
			return lqr, err
		}
		slog.Info("QueryLinksRebaseTreePathCommand", "t", t, "args", args)

		lqr.Links, err = commands.GetPath[links.Links](l, "links")
		if err != nil {
			return lqr, err
		}

		lqr.Links["base"] = links.Link{
			Rel:  "base",
			HREF: "/" + args.Servicespec + "/",
		}

		return lqr, nil
	})
