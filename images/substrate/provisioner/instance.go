package provisioner

import "context"

type Fields map[string]any

type ServicesRootMap map[string]*InstancesRoot

type InstancesRoot struct {
	Instances map[string]*Instance `json:"instances"`
}

func (s *InstancesRoot) Exports(ctx context.Context) (any, error) {
	return map[string]any{"data": s}, nil
}

type Instance struct {
	ServiceName string `json:"service"`
	Exports     Fields `json:"exports"`
}
