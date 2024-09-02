package space

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log/slog"
	"os"
	"path"
	"strings"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

func (p *SpacesViaContainerFilesystems) WriteSpawnLink(ctx context.Context, activityspec, parameterName, spaceID string) error {
	link := links.Link{
		Rel: "spawn",
		URL: "/" + activityspec + "/",
		Attributes: map[string]any{
			"spawn:parameter": parameterName,
		},
	}

	linkData, err := json.Marshal(link)
	if err != nil {
		return err
	}

	ctx, err = p.P.Connect(ctx)
	if err != nil {
		return err
	}

	containerID, _, err := p.resolveExistingSpaceViewForSpaceID(ctx, spaceID, false)

	// write this entity as a .json file into the space's root/.substrate/links/{hash}.json
	mountPath, err := p.resolveContainerIDMountPath(ctx, containerID)
	if err != nil {
		return err
	}

	linkNameDigest := sha256.New()
	linkNameDigest.Write([]byte(activityspec))
	linkName := hex.EncodeToString(linkNameDigest.Sum(nil))

	linkPath := path.Join(mountPath, ".substrate", "links", linkName+".json")
	err = os.MkdirAll(path.Dir(linkPath), 0755)
	if err != nil {
		return err
	}

	return os.WriteFile(linkPath, linkData, 0644)
}

func (p *SpacesViaContainerFilesystems) QuerySpawnLinks(ctx context.Context, spaceID string) (links.Links, error) {
	slog.Info("QuerySpawnLinks", "spaceID", spaceID)
	ctx, err := p.P.Connect(ctx)
	if err != nil {
		return nil, err
	}

	containerID, _, err := p.resolveExistingSpaceViewForSpaceID(ctx, spaceID, false)
	if err != nil {
		return nil, err
	}

	if containerID == "" {
		return nil, activityspec.ErrNotFound
	}

	// TODO write this entity as a .json file into the space's root/.substrate/links/{rel}/{hash}.json
	mountPath, err := p.resolveContainerIDMountPath(ctx, containerID)
	if err != nil {
		return nil, err
	}

	linksDir := path.Join(mountPath, ".substrate", "links")
	linkEntries, err := os.ReadDir(linksDir)
	if err != nil {
		return nil, err
	}

	l := links.Links{}
	var errs []error
	for _, entry := range linkEntries {
		if entry.IsDir() {
			continue
		}
		linkFileName := entry.Name()
		if !strings.HasSuffix(linkFileName, ".json") {
			continue
		}
		linkName := strings.TrimSuffix(linkFileName, ".json")
		b, err := os.ReadFile(path.Join(linksDir, linkFileName))
		if err != nil {
			errs = append(errs, err)
			continue
		}

		var link links.Link
		err = json.Unmarshal(b, &link)
		if err != nil {
			errs = append(errs, err)
			continue
		}

		l[linkName] = link
	}

	return l, errors.Join(errs...)
}
