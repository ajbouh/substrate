package dockerprovisioner

import (
	"context"
	"errors"

	"github.com/docker/docker/api/types"
)

func (p *P) cleanup(
	ctx context.Context,
	generation string,
) error {
	containers, err := p.cli.ContainerList(ctx, types.ContainerListOptions{})
	if err != nil {
		return err
	}

	removeContainers := []string{}
	for _, container := range containers {
		containerGeneration := container.Labels[LabelSubstrateGeneration]
		if containerGeneration == "" || containerGeneration == generation {
			continue
		}

		removeContainers = append(removeContainers, container.ID)
	}

	errs := []error{}
	for _, container := range removeContainers {
		err := p.cli.ContainerRemove(ctx, container, types.ContainerRemoveOptions{
			RemoveVolumes: true,
			RemoveLinks:   true,
			Force:         true,
		})
		if err != nil {
			errs = append(errs, err)
		}
	}

	networks, err := p.cli.NetworkList(ctx, types.NetworkListOptions{})
	if err != nil {
		return err
	}

	removeNetworks := []string{}
	for _, network := range networks {
		networkGeneration := network.Labels[LabelSubstrateGeneration]
		if networkGeneration == "" || networkGeneration == generation {
			continue
		}

		removeNetworks = append(removeNetworks, network.ID)
	}

	for _, network := range removeNetworks {
		err := p.cli.NetworkRemove(ctx, network)
		if err != nil {
			errs = append(errs, err)
		}
	}

	if len(errs) > 0 {
		return errors.Join(errs...)
	}

	return nil
}
