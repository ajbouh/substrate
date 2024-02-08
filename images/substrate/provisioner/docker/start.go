package dockerprovisioner

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path"
	"time"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/fs"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
	"github.com/docker/go-connections/nat"
	ulid "github.com/oklog/ulid/v2"
)

type P struct {
	cli *client.Client

	namespace  string
	generation string

	internalNetworkName string
	externalNetworkName string

	hostResourceDirsRoot string
	hostResourceDirsPath []string
	containerResourceDir string

	waitForReadyTimeout time.Duration
	waitForReadyTick    time.Duration

	prep func(h *container.HostConfig)
}

var _ activityspec.ProvisionDriver = (*P)(nil)

func New(cli *client.Client, namespace, internalNetworkName, externalNetworkName, hostResourceDirsRoot string, hostResourceDirsPath []string, prep func(h *container.HostConfig)) *P {
	return &P{
		cli:                  cli,
		namespace:            namespace,
		internalNetworkName:  internalNetworkName,
		externalNetworkName:  externalNetworkName,
		hostResourceDirsRoot: hostResourceDirsRoot,
		hostResourceDirsPath: hostResourceDirsPath,
		containerResourceDir: "/res",
		waitForReadyTimeout:  2 * time.Minute,
		waitForReadyTick:     500 * time.Millisecond,
		generation:           ulid.Make().String(),
		prep:                 prep,
	}
}

const LabelSubstrateGeneration = "substrate.generation"
const LabelSubstrateNamespace = "substrate.namespace"
const LabelSubstrateActivity = "substrate.activity"
const SubstrateNetworkNamePrefix = "substrate_network_"

func (p *P) dumpLogs(ctx context.Context, containerID string) error {
	rd, err := p.cli.ContainerLogs(ctx, containerID, types.ContainerLogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Follow:     true,
		// Since      string
		// Until      string
		// Timestamps bool
		// Tail       string
		// Details    bool
	})
	if err != nil {
		return err
	}
	defer rd.Close()

	_, err = stdcopy.StdCopy(os.Stderr, os.Stderr, rd)
	if err != nil {
		fmt.Printf("err tailing stderr: %s", err)
	}

	return err
}

func (p *P) findResourceDir(rd activityspec.ResourceDirDef) (string, error) {
	rdMainPath := path.Join(p.hostResourceDirsRoot, rd.SHA256)
	if _, err := os.Stat(rdMainPath); err == nil {
		return rdMainPath, nil
	} else if errors.Is(err, os.ErrNotExist) {
		return rdMainPath, err
	}

	// Use existing from path, otherwise fallback to main
	for _, rdRoot := range p.hostResourceDirsPath {
		rdPath := path.Join(rdRoot, rd.SHA256)
		if _, err := os.Stat(rdPath); err == nil {
			return rdPath, nil
		} else if errors.Is(err, os.ErrNotExist) {
			return rdPath, err
		}
	}

	return rdMainPath, nil
}

func (p *P) prepareResourceDirsMounts(as *activityspec.ServiceSpawnResolution) ([]mount.Mount, error) {
	mounts := make([]mount.Mount, 0, len(as.ServiceDefSpawn.ResourceDirs))
	for alias, rd := range as.ServiceDefSpawn.ResourceDirs {
		rdPath, err := p.findResourceDir(rd)
		if err != nil {
			return nil, err
		}
		mounts = append(mounts, mount.Mount{
			Type:     mount.TypeBind,
			Source:   rdPath,
			Target:   path.Join(p.containerResourceDir, alias),
			ReadOnly: true,
		})
	}

	return mounts, nil
}

func (p *P) Spawn(ctx context.Context, as *activityspec.ServiceSpawnResolution) (*activityspec.ServiceSpawnResponse, error) {
	cli := p.cli

	spec, _ := as.Format()
	labels := map[string]string{
		LabelSubstrateNamespace:  p.namespace,
		LabelSubstrateGeneration: p.generation,
		LabelSubstrateActivity:   spec,
	}

	c := &container.Config{
		Image:        as.ServiceDefSpawn.Image,
		ExposedPorts: nat.PortSet{},
		Labels:       labels,
	}

	h := &container.HostConfig{
		AutoRemove: true,
	}
	if p.prep != nil {
		p.prep(h)
	}
	n := &network.NetworkingConfig{
		EndpointsConfig: map[string]*network.EndpointSettings{
			p.internalNetworkName: &network.EndpointSettings{},
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

	for _, m := range as.ServiceDefSpawn.Mounts {
		h.Mounts = append(h.Mounts,
			mount.Mount{
				Type:     mount.TypeBind,
				Source:   m.Source,
				Target:   m.Destination,
				ReadOnly: true,
			},
		)
	}

	resourcedirMounts, err := p.prepareResourceDirsMounts(as)
	if err != nil {
		return nil, err
	}

	h.Mounts = append(h.Mounts, resourcedirMounts...)

	// Pull PORT out of env, so it can be used for port forwarding.
	// TODO consider using configured portmappings instead of this weird approach.
	portStr := as.ServiceDefSpawn.Environment["PORT"]

	natPort, err := nat.NewPort("tcp", portStr)
	if err != nil {
		return nil, err
	}
	c.ExposedPorts[natPort] = struct{}{}

	c.Cmd = append([]string{}, as.ServiceDefSpawn.Command...)

	for k, v := range as.ServiceDefSpawn.Environment {
		c.Env = append(c.Env, k+"="+v)
	}
	for k, v := range as.ExtraEnvironment {
		c.Env = append(c.Env, k+"="+v)
	}
	// TODO need to check schema before we know how to interpret a given parameter...
	// Maybe write a method for each interpretation? Can return an error if it's impossible...
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

	cResp, err := cli.ContainerCreate(ctx, c, h, n, nil, "")
	if err != nil {
		return nil, err
	}

	if err := cli.NetworkConnect(ctx, p.externalNetworkName, cResp.ID, nil); err != nil {
		return nil, err
	}

	if err := cli.ContainerStart(ctx, cResp.ID, types.ContainerStartOptions{}); err != nil {
		return nil, err
	}

	// Stream logs to stderr
	go p.dumpLogs(ctx, cResp.ID)

	inspect, err := cli.ContainerInspect(ctx, cResp.ID)
	if err != nil {
		return nil, err
	}

	// backendIP := inspect.NetworkSettings.Networks[networkName].IPAddress
	backendURL := "http://" + inspect.Config.Hostname + ":" + portStr
	// backendPortMap := inspect.NetworkSettings.Ports[natPort][0]
	// backendURL := "http://host.docker.internal:" + backendPortMap.HostPort

	var bearerToken *string
	// bearerToken = r.BearerToken

	return &activityspec.ServiceSpawnResponse{
		Name: cResp.ID,

		BackendURL:  backendURL,
		BearerToken: bearerToken,
	}, nil
}
