package space

import (
	"context"
	"log/slog"

	"cuelang.org/go/cue"
	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/containers/podman/v5/pkg/bindings/containers"
)

func (p *SpacesViaContainerFilesystems) resolveBootstrapSpaceView(ctx context.Context, spaceID string, readOnly bool) (*activityspec.SpaceView, error) {
	slog.Info("resolveBootstrapSpaceView", "spaceID", spaceID, "readOnly", readOnly)
	containerID, err, _ := p.containerBootstrapGroup.Do(spaceID, func() (interface{}, error) {
		var newSpaceImage string
		var err error

		err = p.DefSetLoader.Load().DecodeLookupPath(cue.MakePath(cue.Def("#var"), cue.Str("substrate"), cue.Str("image_ids"), cue.Str("new-space")), &newSpaceImage)
		if err != nil {
			return "", err
		}

		slog.Info("resolveBootstrapSpaceView seeking creating container")
		s, _ := p.createContainerSpecForSpace(newSpaceImage, spaceID)

		c, err := containers.CreateWithSpec(ctx, s, nil)
		if err != nil {
			return "", err
		}

		slog.Info("resolveBootstrapSpaceView done")
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
