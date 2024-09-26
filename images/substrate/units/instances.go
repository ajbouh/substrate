package units

import (
	"context"

	"github.com/ajbouh/substrate/images/substrate/provisioner"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

type Peeker[T any] interface {
	Peek() T
}

type InstanceLinks struct {
	ServicesRootMapLoader Peeker[*provisioner.ServicesRootMap]
}

var _ links.Querier = (*InstanceLinks)(nil)

func (m *InstanceLinks) QueryLinks(ctx context.Context) (links.Links, error) {
	root := m.ServicesRootMapLoader.Peek()
	ents := links.Links{}

	if root == nil {
		return ents, nil
	}

	for _, service := range *root {
		for k, v := range service.Instances {
			ents["instance/"+k] = links.Link{
				Rel:  "instance",
				HREF: "/" + k + "/",
				Attributes: map[string]any{
					"instance:service": v.ServiceName,
				},
			}
		}
	}

	return ents, nil
}
