package podmanprovisioner

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/defset"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
	"github.com/ajbouh/substrate/pkg/toolkit/notify"

	nettypes "github.com/containers/common/libnetwork/types"
	"github.com/containers/podman/v4/pkg/bindings/containers"
	"github.com/containers/podman/v4/pkg/specgen"
	specs "github.com/opencontainers/runtime-spec/specs-go"
)

type P struct {
	Connect func(ctx context.Context) (context.Context, error)

	Namespace  string
	Generation string

	InternalNetwork string
	ExternalNetwork string

	WaitForReadyTimeout time.Duration
	WaitForReadyTick    time.Duration

	Prep func(h *specgen.SpecGenerator)

	DefSetLoader notify.Loader[*defset.DefSet]
}

var _ provisioner.Driver = (*P)(nil)

func (p *P) Serve(ctx context.Context) {
	go func() {
		log.Printf("cleaning up...")
		p.Cleanup(ctx)
		log.Printf("clean up done")
	}()
}

const LabelSubstrateGeneration = "substrate.generation"
const LabelSubstrateNamespace = "substrate.namespace"
const LabelSubstrateActivity = "substrate.activity"
const SubstrateNetworkNamePrefix = "substrate_network_"

func (p *P) dumpLogs(ctx context.Context, prefix, containerID string) error {
	ctx, err := p.Connect(ctx)
	if err != nil {
		return err
	}

	ch := make(chan string)
	go func(ch chan string) {
		for s := range ch {
			os.Stderr.WriteString(prefix + s)
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

func (p *P) appendMount(ctx context.Context, s *specgen.SpecGenerator, m activityspec.ServiceInstanceDefSpawnMount) error {
	switch m.Type {
	case "image":
		iv := &specgen.ImageVolume{
			Source:      m.Source,
			Destination: m.Destination,
		}
		if m.Mode == "rw" {
			iv.ReadWrite = true
		}
		s.ImageVolumes = append(s.ImageVolumes, iv)
		return nil
	}

	s.Mounts = append(s.Mounts, specs.Mount{
		Type:        m.Type,
		Source:      m.Source,
		Destination: m.Destination,
		Options:     []string{m.Mode},
	})
	return nil
}

func (p *P) includeView(ctx context.Context, s *specgen.SpecGenerator, viewName string, includeSpaceIDInTarget bool, view *activityspec.SpaceView) error {
	targetPrefix := "/spaces/" + viewName
	if includeSpaceIDInTarget {
		targetPrefix += "/" + view.SpaceID
	}

	err := view.Await()
	if err != nil {
		return fmt.Errorf("error creating view err=%s", err)
	}

	for _, m := range view.Mounts(targetPrefix) {
		err := p.appendMount(ctx, s, m)
		if err != nil {
			return fmt.Errorf("error appending mount %#v: %w", err)
		}
	}

	return nil
}

func (p *P) Spawn(ctx context.Context, as *activityspec.ServiceSpawnResolution) (*activityspec.ServiceSpawnResponse, error) {
	ctx, err := p.Connect(ctx)
	if err != nil {
		return nil, fmt.Errorf("error connecting: %w", err)
	}

	imageID := as.ServiceInstanceDef.Image

	spec, _ := as.Format()
	labels := map[string]string{
		LabelSubstrateNamespace:  p.Namespace,
		LabelSubstrateGeneration: p.Generation,
		LabelSubstrateActivity:   spec,
	}

	s := specgen.NewSpecGenerator(imageID, false)
	s.Remove = true
	s.Env = map[string]string{}
	s.Labels = labels
	s.Command = append([]string{}, as.ServiceInstanceDef.Command...)

	s.Privileged = as.ServiceInstanceDef.Privileged

	// Recognized resource types include:
	// - "core": maximum core dump size (ulimit -c)
	// - "cpu": maximum CPU time (ulimit -t)
	// - "data": maximum size of a process’s data segment (ulimit -d)
	// - "fsize": maximum size of new files (ulimit -f)
	// - "locks": maximum number of file locks (ulimit -x)
	// - "memlock": maximum amount of locked memory (ulimit -l)
	// - "msgqueue": maximum amount of data in message queues (ulimit -q)
	// - "nice": niceness adjustment (nice -n, ulimit -e)
	// - "nofile": maximum number of open files (ulimit -n)
	// - "nproc": maximum number of processes (ulimit -u)
	// - "rss": maximum size of a process’s (ulimit -m)
	// - "rtprio": maximum real-time scheduling priority (ulimit -r)
	// - "rttime": maximum amount of real-time execution between blocking syscalls
	// - "sigpending": maximum number of pending signals (ulimit -i)
	// - "stack": maximum stack size (ulimit -s)

	s.Rlimits = append(s.Rlimits, specs.POSIXRlimit{
		Type: "nofile",
		Hard: uint64(65000),
		Soft: uint64(65000),
	})
	s.Init = as.ServiceInstanceDef.Init

	if p.Prep != nil {
		p.Prep(s)
	}
	s.Networks = map[string]nettypes.PerNetworkOptions{
		p.InternalNetwork: nettypes.PerNetworkOptions{},
		p.ExternalNetwork: nettypes.PerNetworkOptions{},
	}

	for _, m := range as.ServiceInstanceDef.Mounts {
		err := p.appendMount(ctx, s, m)
		if err != nil {
			return nil, fmt.Errorf("error appending mount %#v: %w", err)
		}
	}

	for k, v := range as.ServiceInstanceDef.Environment {
		s.Env[k] = v
	}

	// Pull PORT out of env, so it can be used for port forwarding.
	// TODO consider using configured portmappings instead of this weird approach.
	portStr := s.Env["PORT"]
	if portStr != "" {
		port, err := strconv.Atoi(portStr)
		if err != nil {
			return nil, fmt.Errorf("bad PORT value: %w", err)
		}
		s.PortMappings = append(s.PortMappings, nettypes.PortMapping{
			ContainerPort: uint16(port),
			Protocol:      "tcp",
		})
	}

	// TODO need to check schema before we know how to interpret a given parameter...
	// Maybe write a method for each interpretation? Can return an error if it's impossible...
	for parameterName, parameterValue := range as.Parameters {
		switch {
		case parameterValue.Space != nil:
			p.includeView(ctx, s, parameterName, false, parameterValue.Space)
		case parameterValue.Spaces != nil:
			for _, v := range *parameterValue.Spaces {
				p.includeView(ctx, s, parameterName, true, &v)
			}
		}
	}

	cResp, err := containers.CreateWithSpec(ctx, s, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating: %w", err)
	}

	if err := containers.Start(ctx, cResp.ID, nil); err != nil {
		return nil, fmt.Errorf("error starting %s: %#v %w", cResp.ID, s, err)
	}

	// Stream logs to stderr
	go p.dumpLogs(ctx, "["+as.ServiceName+" "+cResp.ID+"] ", cResp.ID)

	inspect, err := containers.Inspect(ctx, cResp.ID, nil)
	if err != nil {
		return nil, fmt.Errorf("error inspecting: %w", err)
	}

	// backendIP := inspect.NetworkSettings.Networks[networkName].IPAddress
	backendURL := "http://" + inspect.Config.Hostname + ":" + portStr
	// backendPortMap := inspect.NetworkSettings.Ports[natPort][0]
	// backendURL := "http://host.docker.internal:" + backendPortMap.HostPort

	return &activityspec.ServiceSpawnResponse{
		Name: cResp.ID,

		PID: inspect.State.Pid,

		BackendURL: backendURL + as.ServiceInstanceDef.URLPrefix,

		ServiceSpawnResolution: *as,
	}, nil
}
