package space

import (
	"context"
	"errors"
	"log/slog"
	"strings"

	"github.com/containers/podman/v4/pkg/bindings/containers"
	"github.com/containers/storage/types"
)

func checkContainerIDExists(ctx context.Context, containerID string) (bool, error) {
	_, err := containers.Inspect(ctx, containerID, nil)
	slog.Info("checkContainerIDExists", "containerID", containerID, "err", err)
	if errors.Is(err, types.ErrContainerUnknown) {
		return false, nil
	}
	if err != nil {
		return false, err
	}

	return true, nil
}

func spaceGetLabels(ctx context.Context, id string) (map[string]string, error) {
	inspect, err := containers.Inspect(ctx, id, nil)
	if err != nil {
		return nil, err
	}

	return inspect.Config.Labels, nil
}

func mightBeRemote(id string) bool {
	return strings.Contains(id, "/")
}
