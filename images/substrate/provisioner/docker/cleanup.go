package dockerprovisioner

import (
	"context"
	"errors"
	"log"

	"github.com/containers/podman/v4/pkg/bindings/containers"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
)

func (p *P) Kill(
	ctx context.Context,
	name string,
) error {
	c, err := p.cli.ContainerInspect(ctx, name)
	if err != nil {
		return err
	}

	errs := []error{}
	switch c.State.Status {
	case "running", "paused", "restarting":
		log.Printf("stopping container %s", c.ID)
		err := containers.Stop(ctx, c.ID, nil)
		if err != nil {
			errs = append(errs, err)
		}
	default:
		log.Printf("not stopping container %s; status: %s", c.ID, c.State.Status)
	}

	log.Printf("removing container %s", c.ID)
	err = p.cli.ContainerRemove(ctx, c.ID, types.ContainerRemoveOptions{
		// If we remove volumes then our caches will go away when the last container using it is stopped...
		// RemoveVolumes: true,
		RemoveLinks: true,
		Force:       true,
	})
	if err != nil {
		errs = append(errs, err)
	}

	if len(errs) > 0 {
		return errors.Join(errs...)
	}

	return nil
}

func (p *P) Cleanup(
	ctx context.Context,
) error {
	containers, err := p.cli.ContainerList(ctx, types.ContainerListOptions{
		All: true,
	})
	if err != nil {
		return err
	}

	removeContainers := []types.Container{}
	for _, container := range containers {
		containerNamespace := container.Labels[LabelSubstrateNamespace]
		if containerNamespace == "" || containerNamespace != p.namespace {
			continue
		}

		containerGeneration := container.Labels[LabelSubstrateGeneration]
		if containerGeneration == "" || containerGeneration == p.generation {
			continue
		}

		removeContainers = append(removeContainers, container)
	}

	errs := []error{}
	for _, c := range removeContainers {
		switch c.State {
		case "running", "paused", "restarting":
			log.Printf("stopping container %s", c.ID)
			err := p.cli.ContainerStop(ctx, c.ID, container.StopOptions{})
			if err != nil {
				errs = append(errs, err)
			}
		}

		log.Printf("removing container %s", c.ID)
		err := p.cli.ContainerRemove(ctx, c.ID, types.ContainerRemoveOptions{
			// If we remove volumes then our caches will go away when the last container using it is stopped...
			// RemoveVolumes: true,
			RemoveLinks: true,
			Force:       true,
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
		containerNamespace := network.Labels[LabelSubstrateNamespace]
		if containerNamespace == "" || containerNamespace != p.namespace {
			continue
		}

		networkGeneration := network.Labels[LabelSubstrateGeneration]
		if networkGeneration == "" || networkGeneration == p.generation {
			continue
		}

		removeNetworks = append(removeNetworks, network.ID)
	}

	for _, network := range removeNetworks {
		log.Printf("removing network %s", network)
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
