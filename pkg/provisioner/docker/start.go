package dockerprovisioner

import (
	"context"
	"net/url"
	"time"

	"github.com/ajbouh/substrate/pkg/activityspec"
	"github.com/ajbouh/substrate/pkg/substratefs"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
	ulid "github.com/oklog/ulid/v2"
)

type P struct {
	cli *client.Client

	generation string
	network    string

	waitForReadyTimeout time.Duration
	waitForReadyTick    time.Duration

	mounts []mount.Mount
}

func New(cli *client.Client, network string, mounts []mount.Mount) *P {
	return &P{
		cli:                 cli,
		network:             network,
		waitForReadyTimeout: 2 * time.Minute,
		waitForReadyTick:    500 * time.Millisecond,
		generation:          ulid.Make().String(),
		mounts:              mounts,
	}
}

const LabelSubstrateGeneration = "substrate.generation"
const LabelSubstrateActivity = "substrate.activity"
const SubstrateNetworkNamePrefix = "substrate_network_"

func (p *P) Spawn(ctx context.Context, as *activityspec.ActivitySpec) (*activityspec.ActivitySpawnResponse, error) {
	cli := p.cli

	spec, _ := as.ActivitySpec()
	labels := map[string]string{
		LabelSubstrateGeneration: p.generation,
		LabelSubstrateActivity:   spec,
	}

	port := "8000"
	natPort, err := nat.NewPort("tcp", port)
	if err != nil {
		return nil, err
	}

	c := &container.Config{
		Image: as.Image,
		Env: []string{
			"PORT=" + port,
		},
		ExposedPorts: nat.PortSet{
			natPort: struct{}{},
		},
		Labels: labels,
	}

	// networkName := SubstrateNetworkNamePrefix + ulid.Make().String()
	// _, err := cli.NetworkCreate(ctx,
	// 	networkName,
	// 	types.NetworkCreate{
	// 		// Driver: "bridge",
	// 		// Internal: true,
	// 		// Ingress:    true,
	// 		// Attachable: true,
	// 		Labels: labels,
	// 	},
	// )
	// if err != nil {
	// 	return nil, err
	// }

	networkName := p.network
	h := &container.HostConfig{
		AutoRemove: true,
		Mounts:     append([]mount.Mount{}, p.mounts...),
		Resources: container.Resources{
			DeviceRequests: []container.DeviceRequest{
				{
					Driver:       "nvidia",
					Count:        -1,
					Capabilities: [][]string{{"gpu"}},
				},
			},
		},
	}
	n := &network.NetworkingConfig{
		EndpointsConfig: map[string]*network.EndpointSettings{
			networkName: &network.EndpointSettings{},
		},
	}

	includeView := func(viewName string, includeSpaceIDInTarget bool, view *substratefs.SpaceView) {
		targetPrefix := "/spaces/" + viewName
		if includeSpaceIDInTarget {
			targetPrefix += "/" + view.Tip.SpaceID.String()
		}

		h.Mounts = append(h.Mounts,
			mount.Mount{
				Type:     mount.TypeBind,
				Source:   view.TreePath(),
				Target:   targetPrefix + "/tree",
				ReadOnly: view.IsReadOnly,
			},
			mount.Mount{
				Type:     mount.TypeBind,
				Source:   view.OwnerFilePath(),
				Target:   targetPrefix + "/owner",
				ReadOnly: true,
			},
			mount.Mount{
				Type:     mount.TypeBind,
				Source:   view.AliasFilePath(),
				Target:   targetPrefix + "/alias",
				ReadOnly: true,
			},
		)
	}

	// TODO need to check schema before we know how to interpret a given parameter...
	// Maybe write a method for each interpretation? Can return an error if it's impossible...
	for parameterName, parameterValue := range as.Parameters {
		switch {
		case parameterValue.EnvVars != nil:
			for k, v := range parameterValue.EnvVars {
				c.Env = append(c.Env, k+"="+v)
			}
		case parameterValue.Space != nil:
			includeView(parameterName, false, parameterValue.Space)
		case parameterValue.Spaces != nil:
			for _, v := range *parameterValue.Spaces {
				includeView(parameterName, true, &v)
			}
		}
	}

	cResp, err := cli.ContainerCreate(ctx, c, h, n, nil, "")
	if err != nil {
		return nil, err
	}

	if err := cli.ContainerStart(ctx, cResp.ID, types.ContainerStartOptions{}); err != nil {
		return nil, err
	}

	inspect, err := cli.ContainerInspect(ctx, cResp.ID)
	if err != nil {
		return nil, err
	}

	// backendIP := inspect.NetworkSettings.Networks[networkName].IPAddress
	backendURL := "http://" + inspect.Config.Hostname + ":" + port
	// backendPortMap := inspect.NetworkSettings.Ports[natPort][0]
	// backendURL := "http://host.docker.internal:" + backendPortMap.HostPort

	// TODO should ProvisionerCookieAuthenticationMode be a parameter?
	u, err := url.Parse(backendURL)
	if err != nil {
		return nil, err
	}

	pathURL, err := url.Parse(as.Path)
	if err != nil {
		return nil, err
	}

	var bearerToken *string
	// bearerToken = r.BearerToken

	viewspec, _ := as.ActivitySpec()

	return &activityspec.ActivitySpawnResponse{
		Name:         cResp.ID,
		ActivitySpec: viewspec,

		URLJoiner: activityspec.MakeJoiner(u, bearerToken),
		PathURL:   pathURL,

		BackendURL:  backendURL,
		Path:        as.Path,
		BearerToken: bearerToken,
	}, nil
}
