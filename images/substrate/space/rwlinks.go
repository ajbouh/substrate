package space

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"path/filepath"

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
