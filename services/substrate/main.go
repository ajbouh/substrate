package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/NVIDIA/go-nvml/pkg/dl"
	"github.com/containers/podman/v4/pkg/bindings"
	"github.com/containers/podman/v4/pkg/specgen"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/client"

	specs "github.com/opencontainers/runtime-spec/specs-go"

	"github.com/sirupsen/logrus"

	"github.com/ajbouh/substrate/pkg/activityspec"
	dockerprovisioner "github.com/ajbouh/substrate/pkg/provisioner/docker"
	podmanprovisioner "github.com/ajbouh/substrate/pkg/provisioner/podman"
	"github.com/ajbouh/substrate/pkg/substrate"
	"github.com/ajbouh/substrate/pkg/substratehttp"
)

func mustGetenv(name string) string {
	value := os.Getenv(name)
	if value == "" {
		log.Fatalf("%s not set", name)
	}
	return value
}

func testLoad() {
	l := dl.New("libnvidia-ml.so.1", dl.RTLD_LAZY|dl.RTLD_GLOBAL)

	err := l.Open()
	if err == nil {
		defer l.Close()
	}

	fmt.Printf("testLoad: %s\n", err)
}

func newProvisioner(cudaAvailable bool) activityspec.ProvisionDriver {
	switch os.Getenv("SUBSTRATE_PROVISIONER") {
	case "docker":
		return newDockerProvisioner(cudaAvailable)
	case "podman", "":
		return newPodmanProvisioner(cudaAvailable)
	}

	return nil
}

func newDockerProvisioner(cudaAvailable bool) *dockerprovisioner.P {
	cli, err := client.NewEnvClient()
	if err != nil {
		log.Fatalf("error starting client: %s", err)
	}

	mounts := []mount.Mount{}
	for _, m := range strings.Split(os.Getenv("SUBSTRATE_SERVICE_DOCKER_MOUNTS"), ",") {
		source, target, ok := strings.Cut(m, ":")
		if ok {
			mounts = append(mounts, mount.Mount{
				// Type:   mount.TypeBind,
				Type:   mount.TypeVolume,
				Source: source,
				Target: target,
			})
		}
	}

	prep := func(h *container.HostConfig) {
		h.Mounts = append(h.Mounts, mounts...)

		if os.Getenv("SUBSTRATE_NO_CUDA") == "" && cudaAvailable {
			h.DeviceRequests = append(h.DeviceRequests, container.DeviceRequest{
				Driver:       "nvidia",
				Count:        -1,
				Capabilities: [][]string{{"gpu"}},
			})
		}
	}

	return dockerprovisioner.New(
		cli,
		mustGetenv("SUBSTRATE_NAMESPACE"),
		mustGetenv("SUBSTRATE_DOCKER_NETWORK"),
		mustGetenv("SUBSTRATE_RESOURCEDIRS_ROOT"),
		prep,
	)
}

func newPodmanProvisioner(cudaAvailable bool) *podmanprovisioner.P {
	prep := func(s *specgen.SpecGenerator) {
		s.SelinuxOpts = []string{
			"label=disable",
		}
		// if os.Getenv("SUBSTRATE_NO_CUDA") == "" && cudaAvailable {
		if true {
			s.Devices = []specs.LinuxDevice{
				{
					Path: "nvidia.com/gpu=all",
				},
			}
		}
	}

	return podmanprovisioner.New(
		func(ctx context.Context) (context.Context, error) {
			return bindings.NewConnection(ctx, os.Getenv("DOCKER_HOST"))
		},
		mustGetenv("SUBSTRATE_NAMESPACE"),
		mustGetenv("SUBSTRATE_DOCKER_NETWORK"),
		mustGetenv("SUBSTRATE_RESOURCEDIRS_ROOT"),
		prep,
	)
}

func main() {
	debug := os.Getenv("DEBUG")
	if ok, _ := strconv.ParseBool(debug); ok {
		logrus.SetLevel(logrus.DebugLevel)
	}

	for _, env := range os.Environ() {
		fmt.Println(env)
	}

	testLoad()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	var err error

	var substratefsMountpoint string

	cpuMemoryTotalMB, err := substrate.MeasureCPUMemoryTotalMB()
	if err != nil {
		fmt.Printf("error measuring total cpu memory: %s\n", err)
	}
	fmt.Printf("cpuMemoryTotalMB %d\n", cpuMemoryTotalMB)

	cudaMemoryTotalMB, err := substrate.MeasureCUDAMemoryTotalMB()
	if err != nil {
		fmt.Printf("error measuring total cuda memory: %s\n", err)
	}
	fmt.Printf("cudaMemoryTotalMB %d\n", cudaMemoryTotalMB)

	p := newProvisioner(cudaMemoryTotalMB > 0)

	lensesExprPath := mustGetenv("SUBSTRATE_LENSES_EXPR_PATH")
	lensesExprB, err := os.ReadFile(lensesExprPath)
	if err != nil {
		log.Fatalf("error reading lenses expr: %s", err)
	}

	log.Printf("cleaning up...")
	ctx := context.Background()
	p.Cleanup(ctx)
	log.Printf("clean up done")

	sub, err := substrate.New(
		mustGetenv("SUBSTRATE_DB"),
		substratefsMountpoint,
		string(lensesExprB),
		p,
		os.Getenv("ORIGIN"),
		cpuMemoryTotalMB,
		cudaMemoryTotalMB,
	)
	if err != nil {
		log.Fatalf("error creating substrate: %s", err)
	}

	server := &http.Server{
		Addr: ":" + port,
	}

	server.Handler = substratehttp.NewHTTPHandler(sub)

	binaryPath, _ := os.Executable()
	if binaryPath == "" {
		binaryPath = "server"
	}
	log.Printf("%s listening on %q", filepath.Base(binaryPath), server.Addr)

	if server.TLSConfig == nil {
		log.Fatal(server.ListenAndServe())
	} else {
		log.Fatal(server.ListenAndServeTLS("", ""))
	}
}
