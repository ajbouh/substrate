package space

import (
	"context"
	"errors"
	"log/slog"
	"strings"

	"github.com/containers/podman/v4/pkg/bindings/containers"
	"github.com/containers/storage/types"
)

func checkContainerIDExists(ctx context.Context, containerNameOrID string) (string, bool, error) {
	c, err := containers.Inspect(ctx, containerNameOrID, nil)
	slog.Info("checkContainerIDExists", "containerNameOrID", containerNameOrID, "err", err, "errors.Is(err, types.ErrContainerUnknown)", errors.Is(err, types.ErrContainerUnknown))
	if errors.Is(err, types.ErrContainerUnknown) {
		return "", false, nil
	}
	// ignore error for now.
	if err != nil {
		return "", false, nil
	}

	return c.ID, true, nil
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
