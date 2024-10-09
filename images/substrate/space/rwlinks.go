package space

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"io/fs"
	"log/slog"
	"path"
	"path/filepath"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

type SpaceLinks struct {
	SpaceAsFS SpaceAsFS
}

func (p *SpaceLinks) WriteSpawn(ctx context.Context, activityspec, href, parameterName, spaceID string) error {
	linkNameDigest := sha256.New()
	linkNameDigest.Write([]byte(activityspec))
	linkName := hex.EncodeToString(linkNameDigest.Sum(nil))

	return p.Write(ctx, spaceID, map[string]links.Link{
		linkName: links.Link{
			Rel:  "spawn",
			HREF: href,
			Attributes: map[string]any{
				"spawn:parameter": parameterName,
			},
		},
	})
}

func (p *SpaceLinks) Write(ctx context.Context, spaceID string, m map[string]links.Link) error {
	fsys, err := p.SpaceAsFS.SpaceAsFS(ctx, spaceID, false)
	if err != nil {
		return err
	}

	return WriteJSONFiles(fsys, filepath.Join(".substrate", "links"), ".json", m)
}

func (p *SpaceLinks) Remove(ctx context.Context, spaceID string, names []string) error {
	fsys, err := p.SpaceAsFS.SpaceAsFS(ctx, spaceID, false)
	if err != nil {
		return err
	}

	files := make([]string, 0, len(names))
	for _, name := range names {
		files = append(files, filepath.Join(".substrate", "links", name+".json"))
	}

	return RemoveFiles(fsys, files...)
}

func (p *SpaceLinks) Query(ctx context.Context, spaceID string) (map[string]links.Link, error) {
	slog.Info("Query", "spaceID", spaceID)

	fsys, err := p.SpaceAsFS.SpaceAsFS(ctx, spaceID, false)
	if err != nil {
		return nil, err
	}

	return readAllJSONFilesWithSuffix[links.Link](
		fsys,
		path.Join(".substrate", "links"),
		".json",
	)
}

type LinksQueryReturns struct {
	Links links.Links `json:"links"`
}

var LinksWriteCommand = commands.HTTPCommand(
	"links:write", "",
	"POST /substrate/v1/spaces/{space}/links/write", "/substrate/v1/spaces/{space}",
	func(ctx context.Context,
		spaceLinks *SpaceLinks,
		args struct {
			SpaceID string                `json:"space" path:"space"`
			Links   map[string]links.Link `json:"links"`
		},
	) (Void, error) {
		return Void{}, spaceLinks.Write(ctx, args.SpaceID, args.Links)
	},
)

var LinksRemoveCommand = commands.HTTPCommand(
	"links:remove", "",
	"POST /substrate/v1/spaces/{space}/links/remove", "/substrate/v1/spaces/{space}",
	func(ctx context.Context,
		spaceLinks *SpaceLinks,
		args struct {
			SpaceID string   `json:"space" path:"space"`
			Links   []string `json:"links"`
			Link    string   `json:"link"`
		},
	) (Void, error) {
		names := args.Links
		if args.Link != "" {
			names = append([]string(nil), names...)
			names = append(names, args.Link)
		}
		return Void{}, spaceLinks.Remove(ctx, args.SpaceID, names)
	},
)

var LinksQueryCommand = commands.HTTPCommand(
	"links:query", "",
	"GET /substrate/v1/spaces/{space}/links", "/substrate/v1/spaces/{space}",
	func(ctx context.Context,
		t *struct {
			SpaceLinks SpaceLinks
			SpaceURLs  SpaceURLs
		},
		args struct {
			SpaceID string `json:"space" path:"space"`
		},
	) (LinksQueryReturns, error) {
		l := LinksQueryReturns{}
		var err error
		l.Links, err = t.SpaceLinks.Query(ctx, args.SpaceID)
		if err != nil {
			return l, err
		}

		l.Links["tree"] = links.Link{
			Rel:  "tree",
			HREF: t.SpaceURLs.SpaceTreePathURLFunc(args.SpaceID, ""),
		}

		return l, nil
	},
)

var QueryLinksTreePathCommand = commands.HTTPCommand(
	"links:query", "List links",
	"GET /substrate/v1/spaces/{space}/links/tree", "/substrate/v1/spaces/{space}/tree",
	func(ctx context.Context,
		t *struct {
			SpaceAsFS SpaceAsFS
			SpaceURLs SpaceURLs
		},
		args struct {
			Space string `json:"space" path:"space"`
			Path  string `json:"path" path:"path"`
		},
	) (LinksQueryReturns, error) {
		slog.Info("QueryLinksTreePathCommand", "t", t, "t.SpaceAsFS", t.SpaceAsFS, "args", args)
		l := LinksQueryReturns{
			Links: links.Links{},
		}

		fsys, err := t.SpaceAsFS.SpaceAsFS(ctx, args.Space, false)
		if err != nil {
			return l, err
		}

		stat, err := fs.Stat(fsys, args.Path)
		if err != nil {
			return l, err
		}

		if stat.IsDir() {
			entries, err := fs.ReadDir(fsys, args.Path)
			if err != nil {
				return l, err
			}

			for _, entry := range entries {
				l.Links["child/"+entry.Name()] = links.Link{
					Rel:  "child",
					HREF: t.SpaceURLs.SpaceTreePathURLFunc(args.Space, args.Path+"/"+entry.Name()),
				}
			}
		}

		if args.Path != "/" && args.Path != "" {
			l.Links["parent"] = links.Link{
				Rel:  "parent",
				HREF: t.SpaceURLs.SpaceTreePathURLFunc(args.Space, path.Dir(args.Path)),
			}
		}

		l.Links["space"] = links.Link{
			Rel:  "space",
			HREF: t.SpaceURLs.SpaceURLFunc(args.Space),
		}

		return l, nil
	})
