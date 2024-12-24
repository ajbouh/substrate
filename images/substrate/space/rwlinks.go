package space

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io/fs"
	"log/slog"
	"os"
	"path"
	"path/filepath"
	"strings"

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

type LinkMatchFunc func(string, links.Link) bool

func LinkMatchRel(rel string) LinkMatchFunc {
	return func(s string, l links.Link) bool {
		return l.Rel == rel
	}
}

func LinkMatchName(name string) LinkMatchFunc {
	return func(s string, l links.Link) bool {
		return s == name
	}
}

func (p *SpaceLinks) QueryLinks(ctx context.Context, spaceID string, and ...LinkMatchFunc) (links.Links, error) {
	slog.Info("Query")

	fsys, err := p.SpaceAsFS.SpaceAsFS(ctx, spaceID, false)
	if err != nil {
		return nil, err
	}

	l, err := readAllJSONFilesWithSuffix[links.Link](
		fsys,
		path.Join(".substrate", "links"),
		".json",
	)
	if err != nil {
		return nil, err
	}

	keep := func(s string, l links.Link) bool {
		for _, e := range and {
			if !e(s, l) {
				return false
			}
		}
		return true
	}

	if len(and) > 0 {
		m := links.Links{}
		for k, v := range l {
			if keep(k, v) {
				m[k] = v
			}
		}
		l = m
	}

	return l, nil
}

func readAllJSONFilesWithSuffix[T any](fsys fs.FS, baseDir string, suffix string) (map[string]T, error) {
	m := map[string]T{}
	var errs []error
	err := fs.WalkDir(fsys, baseDir, func(p string, d fs.DirEntry, err error) error {
		if err != nil && errors.Is(err, fs.ErrNotExist) {
			return nil
		}

		if err != nil {
			errs = append(errs, err)
			return nil
		}

		if d.IsDir() {
			return nil
		}

		linkFileName := filepath.Join(p, d.Name())
		if !strings.HasSuffix(linkFileName, suffix) {
			return nil
		}

		b, err := os.ReadFile(filepath.Join(baseDir, linkFileName))
		if errors.Is(err, fs.ErrNotExist) {
			return nil
		}

		if err != nil {
			errs = append(errs, err)
			return nil
		}

		var t T
		err = json.Unmarshal(b, &t)
		if err != nil {
			errs = append(errs, err)
		}

		key := strings.TrimPrefix(strings.TrimSuffix(linkFileName, suffix), baseDir)
		m[key] = t

		return nil
	})
	if err != nil && errors.Is(err, fs.ErrNotExist) {
		err = nil
	}

	if err != nil {
		errs = append(errs, err)
	}

	return m, errors.Join(errs...)
}
