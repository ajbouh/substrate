package podmanprovisioner

import (
	"context"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/ajbouh/substrate/pkg/activityspec"
	"github.com/ajbouh/substrate/pkg/substratefs"

	nettypes "github.com/containers/common/libnetwork/types"
	"github.com/containers/podman/v4/pkg/bindings/containers"
	"github.com/containers/podman/v4/pkg/specgen"
	specs "github.com/opencontainers/runtime-spec/specs-go"

	ulid "github.com/oklog/ulid/v2"
)

type P struct {
	connect func(ctx context.Context) (context.Context, error)

	namespace  string
	generation string
	network    string

	waitForReadyTimeout time.Duration
	waitForReadyTick    time.Duration

	prep func(h *specgen.SpecGenerator)

	// mounts []mount.Mount

	// deviceMappings []container.DeviceMapping
	// deviceRequests []container.DeviceRequest
}

func New(connect func(ctx context.Context) (context.Context, error), namespace, network string, prep func(h *specgen.SpecGenerator)) *P {
	return &P{
		connect:             connect,
		namespace:           namespace,
		network:             network,
		waitForReadyTimeout: 2 * time.Minute,
		waitForReadyTick:    500 * time.Millisecond,
		generation:          ulid.Make().String(),
		prep:                prep,
	}
}

const LabelSubstrateGeneration = "substrate.generation"
const LabelSubstrateNamespace = "substrate.namespace"
const LabelSubstrateActivity = "substrate.activity"
const SubstrateNetworkNamePrefix = "substrate_network_"

func (p *P) dumpLogs(ctx context.Context, containerID string) error {
	ctx, err := p.connect(ctx)
	if err != nil {
		return err
	}

	ch := make(chan string)
	go func(ch chan string) {
		for s := range ch {
			os.Stderr.WriteString(s)
		}
	}(ch)

	defer close(ch)

	err = containers.Logs(ctx, containerID, &containers.LogOptions{
		Stdout: boolPtr(true),
		Stderr: boolPtr(true),
		Follow: boolPtr(true),
	}, ch, ch)
	return err
}

func (p *P) Spawn(ctx context.Context, as *activityspec.ServiceSpawnResolution) (*activityspec.ServiceSpawnResponse, error) {
	ctx, err := p.connect(ctx)
	if err != nil {
		return nil, err
	}

	spec, _ := as.Format()
	labels := map[string]string{
		LabelSubstrateNamespace:  p.namespace,
		LabelSubstrateGeneration: p.generation,
		LabelSubstrateActivity:   spec,
	}

	port := uint16(8000)
	portStr := strconv.Itoa(int(port))

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

	s := specgen.NewSpecGenerator(as.Image, false)
	s.Remove = true
	s.Env["PORT"] = portStr
	s.Labels = labels
	s.PortMappings = []nettypes.PortMapping{
		{
			ContainerPort: port,
			Protocol:      "tcp",
		},
	}

	if p.prep != nil {
		p.prep(s)
	}
	s.Networks[networkName] = nettypes.PerNetworkOptions{}

	includeView := func(viewName string, includeSpaceIDInTarget bool, view *substratefs.SpaceView) {
		targetPrefix := "/spaces/" + viewName
		if includeSpaceIDInTarget {
			targetPrefix += "/" + view.Tip.SpaceID.String()
		}

		treeMountOptions := []string{}
		if view.IsReadOnly {
			treeMountOptions = append(treeMountOptions, "ro")
		}

		s.Mounts = append(s.Mounts,
			specs.Mount{
				Type:        "bind",
				Source:      view.TreePath(),
				Destination: targetPrefix + "/tree",
				Options:     treeMountOptions,
			},
			specs.Mount{
				Type:        "bind",
				Source:      view.OwnerFilePath(),
				Destination: targetPrefix + "/owner",
				Options:     []string{"ro"},
			},
			specs.Mount{
				Type:        "bind",
				Source:      view.AliasFilePath(),
				Destination: targetPrefix + "/alias",
				Options:     []string{"ro"},
			},
		)
	}

	// TODO need to check schema before we know how to interpret a given parameter...
	// Maybe write a method for each interpretation? Can return an error if it's impossible...
	for k, v := range as.Environment {
		s.Env[k] = v
	}
	for parameterName, parameterValue := range as.Parameters {
		switch {
		case parameterValue.Space != nil:
			includeView(parameterName, false, parameterValue.Space)
		case parameterValue.Spaces != nil:
			for _, v := range *parameterValue.Spaces {
				includeView(parameterName, true, &v)
			}
		}
	}

	cResp, err := containers.CreateWithSpec(ctx, s, nil)
	if err != nil {
		return nil, err
	}

	if err := containers.Start(ctx, cResp.ID, nil); err != nil {
		return nil, err
	}

	// Stream logs to stderr
	go p.dumpLogs(ctx, cResp.ID)

	inspect, err := containers.Inspect(ctx, cResp.ID, nil)
	if err != nil {
		return nil, err
	}

	// backendIP := inspect.NetworkSettings.Networks[networkName].IPAddress
	backendURL := "http://" + inspect.Config.Hostname + ":" + portStr
	// backendPortMap := inspect.NetworkSettings.Ports[natPort][0]
	// backendURL := "http://host.docker.internal:" + backendPortMap.HostPort

	// TODO should ProvisionerCookieAuthenticationMode be a parameter?
	u, err := url.Parse(backendURL)
	if err != nil {
		return nil, err
	}

	var bearerToken *string
	// bearerToken = r.BearerToken

	return &activityspec.ServiceSpawnResponse{
		Name: cResp.ID,

		URLJoiner: activityspec.MakeJoiner(u, bearerToken),

		BackendURL:  backendURL,
		BearerToken: bearerToken,
	}, nil
}
