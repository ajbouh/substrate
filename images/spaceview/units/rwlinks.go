package units

import (
	"context"
	"log/slog"
	"path"
	"path/filepath"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/links"

	"tractor.dev/toolkit-go/engine/fs"
)

type SpaceURLs struct {
	SpaceTreePathURL func(path string) string
	SpaceURL         func() string
}

type SpaceLinks struct {
	FS fs.FS

	Static links.Links
}

var _ links.Querier = (*SpaceLinks)(nil)

func (p *SpaceLinks) Write(ctx context.Context, m map[string]links.Link) error {
	return WriteJSONFiles(p.FS, filepath.Join(".substrate", "links"), ".json", m)
}

func (p *SpaceLinks) Remove(ctx context.Context, names []string) error {
	files := make([]string, 0, len(names))
	for _, name := range names {
		files = append(files, filepath.Join(".substrate", "links", name+".json"))
	}

	return RemoveFiles(p.FS, files...)
}

func (p *SpaceLinks) QueryLinks(ctx context.Context) (links.Links, error) {
	slog.Info("Query")

	l, err := readAllJSONFilesWithSuffix[links.Link](
		p.FS,
		path.Join(".substrate", "links"),
		".json",
	)
	if err != nil {
		return nil, err
	}

	for k, v := range p.Static {
		l[k], err = v.Clone()
		if err != nil {
			return l, err
		}
	}

	return l, nil
}

type LinksQueryReturns struct {
	Links links.Links `json:"links"`
}

var LinksWriteCommand = handle.Command(
	"links:write", "",
	func(ctx context.Context,
		spaceLinks *SpaceLinks,
		args struct {
			Links map[string]links.Link `json:"links"`
		},
	) (Void, error) {
		return Void{}, spaceLinks.Write(ctx, args.Links)
	},
)

var LinksRemoveCommand = handle.Command(
	"links:remove", "",
	func(ctx context.Context,
		spaceLinks *SpaceLinks,
		args struct {
			Links []string `json:"links"`
			Link  string   `json:"link"`
		},
	) (Void, error) {
		names := args.Links
		if args.Link != "" {
			names = append([]string(nil), names...)
			names = append(names, args.Link)
		}
		return Void{}, spaceLinks.Remove(ctx, names)
	},
)

var QueryLinksTreePathCommand = handle.HTTPCommand(
	"links:query", "List links",
	"GET /links/tree/{path...}", "/tree/{path...}",
	func(ctx context.Context,
		t *struct {
			FS        fs.FS
			SpaceURLs *SpaceURLs
		},
		args struct {
			Path string `json:"path" path:"path"`
		},
	) (LinksQueryReturns, error) {
		slog.Info("QueryLinksTreePathCommand", "t", t, "args", args)
		l := LinksQueryReturns{
			Links: links.Links{},
		}

		stat, err := fs.Stat(t.FS, args.Path)
		if err != nil {
			return l, err
		}

		if stat.IsDir() {
			entries, err := fs.ReadDir(t.FS, args.Path)
			if err != nil {
				return l, err
			}

			for _, entry := range entries {
				href := t.SpaceURLs.SpaceTreePathURL(strings.TrimSuffix(args.Path, "/") + "/" + entry.Name())
				if entry.IsDir() {
					href = href + "/"
				}
				l.Links["child/"+entry.Name()] = links.Link{
					Rel:  "child",
					HREF: href,
				}
			}
		}

		if args.Path != "/" && args.Path != "" {
			l.Links["parent"] = links.Link{
				Rel:  "parent",
				HREF: t.SpaceURLs.SpaceTreePathURL(path.Dir(args.Path) + "/"),
			}
		}

		l.Links["space"] = links.Link{
			Rel:  "space",
			HREF: t.SpaceURLs.SpaceURL(),
		}

		return l, nil
	})
