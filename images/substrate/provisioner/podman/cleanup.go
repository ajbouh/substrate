package podmanprovisioner

import (
	"context"
	"errors"
	"log"

	"github.com/containers/podman/v5/pkg/bindings/containers"
	"github.com/containers/podman/v5/pkg/bindings/network"
	"github.com/containers/podman/v5/pkg/domain/entities"
)

func boolPtr(b bool) *bool {
	return &b
}

func (p *P) Kill(
	ctx context.Context,
	name string,
) error {
	ctx, err := p.Connect(ctx)
	if err != nil {
		return err
	}

	c, err := containers.Inspect(ctx, name, &containers.InspectOptions{})
	if err != nil {
		return err
	}

	errs := []error{}
	switch c.State.Status {
	case "running", "paused", "restarting":
		log.Printf("kill: stopping container %s", c.ID)
		err := containers.Stop(ctx, c.ID, nil)
		if err != nil {
			errs = append(errs, err)
		}
	default:
		log.Printf("kill: not stopping container %s; status: %s", c.ID, c.State.Status)
	}

	log.Printf("kill: removing container %s", c.ID)

	removes, err := containers.Remove(ctx, c.ID, &containers.RemoveOptions{
		// If we remove volumes then our caches will go away when the last container using it is stopped...
		// Volumes: true,
		Depend: boolPtr(true),
		Force:  boolPtr(true),
	})

	if err != nil {
		errs = append(errs, err)
	} else {
		for _, remove := range removes {
			if remove.Err != nil {
				errs = append(errs, remove.Err)
			}
		}
	}

	if len(errs) > 0 {
		return errors.Join(errs...)
	}

	return nil
}

func (p *P) Cleanup(
	ctx context.Context,
) error {
	ctx, err := p.Connect(ctx)
	if err != nil {
		return err
	}

	cntrs, err := containers.List(ctx, &containers.ListOptions{
		All: boolPtr(true),
	})
	if err != nil {
		return err
	}

	removeContainers := []entities.ListContainer{}
	for _, container := range cntrs {
		containerNamespace := container.Labels[LabelSubstrateNamespace]
		if containerNamespace == "" || containerNamespace != p.Namespace {
			continue
		}

		containerGeneration := container.Labels[LabelSubstrateGeneration]
		if containerGeneration == "" || containerGeneration == p.Generation {
			continue
		}

		removeContainers = append(removeContainers, container)
	}

	errs := []error{}
	for _, c := range removeContainers {
		switch c.State {
		case "running", "paused", "restarting":
			log.Printf("cleanup: stopping container %s", c.ID)
			err := containers.Stop(ctx, c.ID, nil)
			if err != nil {
				errs = append(errs, err)
			}
		}

		log.Printf("cleanup: removing container %s", c.ID)
		removes, err := containers.Remove(ctx, c.ID, &containers.RemoveOptions{
			// If we remove volumes then our caches will go away when the last container using it is stopped...
			// Volumes: true,
			Depend: boolPtr(true),
			Force:  boolPtr(true),
		})
		if err != nil {
			errs = append(errs, err)
		} else {
			for _, remove := range removes {
				if remove.Err != nil {
					errs = append(errs, remove.Err)
				}
			}
		}
	}

	networks, err := network.List(ctx, nil)
	if err != nil {
		return err
	}

	removeNetworks := []string{}
	for _, net := range networks {
		containerNamespace := net.Labels[LabelSubstrateNamespace]
		if containerNamespace == "" || containerNamespace != p.Namespace {
			continue
		}

		networkGeneration := net.Labels[LabelSubstrateGeneration]
		if networkGeneration == "" || networkGeneration == p.Generation {
			continue
		}

		removeNetworks = append(removeNetworks, net.ID)
	}

	for _, net := range removeNetworks {
		log.Printf("cleanup: removing network %s", net)
		removes, err := network.Remove(ctx, net, nil)
		if err != nil {
			errs = append(errs, err)
		} else {
			for _, remove := range removes {
				if remove.Err != nil {
					errs = append(errs, remove.Err)
				}
			}
		}
	}

	if len(errs) > 0 {
		return errors.Join(errs...)
	}

	return nil
}
