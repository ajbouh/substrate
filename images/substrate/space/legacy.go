package space

import (
	"archive/tar"
	"context"
	"log/slog"
	"os"
	"path"

	"cuelang.org/go/cue"
	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/containers/podman/v4/pkg/bindings/containers"
)

func (p *SpacesViaContainerFilesystems) resolveLegacySpaceView(ctx context.Context, spaceID string, readOnly bool) (*activityspec.SpaceView, error) {
	slog.Info("resolveLegacySpaceView", "spaceID", spaceID, "readOnly", readOnly)
	containerID, err, _ := p.containerLegacyGroup.Do(spaceID, func() (interface{}, error) {
		// look for matching container
		containerID, _, err := p.resolveExistingSpaceViewForSpaceID(ctx, spaceID, readOnly)
		if err != nil {
			return "", err
		}

		if containerID != "" {
			return p.spaceViewFor(ctx, containerID, spaceID, readOnly)
		}

		var newSpaceImage string
		err = p.DefSetLoader.Load().DecodeLookupPath(cue.MakePath(cue.Def("#var"), cue.Str("substrate"), cue.Str("new_space_image")), &newSpaceImage)
		if err != nil {
			return "", err
		}

		var legacySubstrateFSSpaceRoot string
		slog.Info("resolveLegacySpaceView waiting for legacySubstrateFSSpaceRoot", legacySubstrateFSSpaceRoot)
		err = p.DefSetLoader.Load().DecodeLookupPath(cue.MakePath(cue.Def("#var"), cue.Str("host_substratefs_root")), &legacySubstrateFSSpaceRoot)
		slog.Info("resolveLegacySpaceView waiting for legacySubstrateFSSpaceRoot", "legacySubstrateFSSpaceRoot", legacySubstrateFSSpaceRoot, "err", err)
		if err != nil {
			return "", err
		}
		baseID := path.Join(legacySubstrateFSSpaceRoot, "spaces", spaceID, "tip", "tree")

		slog.Info("resolveLegacySpaceView creating tar")
		tf, err := os.CreateTemp("", "*.tar")
		if err != nil {
			return "", err
		}
		defer os.Remove(tf.Name())
		defer tf.Close()

		tw := tar.NewWriter(tf)
		slog.Info("resolveLegacySpaceView writing dir to tar")
		err = tw.AddFS(os.DirFS(baseID))
		if err != nil {
			return "", err
		}
		slog.Info("resolveLegacySpaceView finishing tar")
		err = tw.Close()
		if err != nil {
			return "", err
		}

		slog.Info("resolveLegacySpaceView seeking to start of tar")
		_, err = tf.Seek(0, 0)
		if err != nil {
			return "", err
		}

		slog.Info("resolveLegacySpaceView seeking creating container")
		s, _ := p.createContainerSpecForSpace(newSpaceImage, spaceID)

		c, err := containers.CreateWithSpec(ctx, s, nil)
		if err != nil {
			return "", err
		}

		slog.Info("resolveLegacySpaceView prepping copy")
		copy, err := containers.CopyFromArchive(ctx, c.ID, "/", tf)
		if err != nil {
			return "", err
		}
		slog.Info("resolveLegacySpaceView copying")
		err = copy()
		if err != nil {
			return "", err
		}

		slog.Info("resolveLegacySpaceView done")
		return c.ID, nil
	})

	if err != nil {
		return nil, err
	}

	view, err := p.spaceViewFor(ctx, containerID.(string), spaceID, readOnly)
	if err == nil {
		view.Creation = &activityspec.SpaceViewCreation{}
	}
	return view, err

}
