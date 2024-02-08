package main

import (
	"context"
	"errors"
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

	"cuelang.org/go/cue/load"
	"github.com/sirupsen/logrus"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/http"
	dockerprovisioner "github.com/ajbouh/substrate/images/substrate/provisioner/docker"
	podmanprovisioner "github.com/ajbouh/substrate/images/substrate/provisioner/podman"
	"github.com/ajbouh/substrate/images/substrate/substrate"
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

func newProvisioner(cudaAllowed bool) activityspec.ProvisionDriver {
	switch os.Getenv("SUBSTRATE_PROVISIONER") {
	case "docker":
		return newDockerProvisioner(cudaAllowed)
	case "podman", "":
		return newPodmanProvisioner(cudaAllowed)
	}

	return nil
}

func newDockerProvisioner(cudaAllowed bool) *dockerprovisioner.P {
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

		if cudaAllowed {
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
		mustGetenv("SUBSTRATE_INTERNAL_NETWORK"),
		mustGetenv("SUBSTRATE_EXTERNAL_NETWORK"),
		mustGetenv("SUBSTRATE_RESOURCEDIRS_ROOT"),
		strings.Split(os.Getenv("SUBSTRATE_RESOURCEDIRS_PATH"), ":"),
		prep,
	)
}

func newPodmanProvisioner(cudaAllowed bool) *podmanprovisioner.P {
	prep := func(s *specgen.SpecGenerator) {
		s.SelinuxOpts = []string{
			"disable",
		}
		if cudaAllowed {
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
		mustGetenv("SUBSTRATE_INTERNAL_NETWORK"),
		mustGetenv("SUBSTRATE_EXTERNAL_NETWORK"),
		mustGetenv("SUBSTRATE_RESOURCEDIRS_ROOT"),
		strings.Split(os.Getenv("SUBSTRATE_RESOURCEDIRS_PATH"), ":"),
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

	cudaAllowed := cudaMemoryTotalMB > 0
	p := newProvisioner(cudaAllowed)

	cueDefsDir := mustGetenv("SUBSTRATE_CUE_DEFS")

	cueDefsLiveDir := os.Getenv("SUBSTRATE_CUE_DEFS_LIVE")
	if cueDefsLiveDir != "" {
		entries, err := os.ReadDir(cueDefsLiveDir)
		if err == nil {
			if len(entries) == 0 {
				fmt.Printf("SUBSTRATE_CUE_DEFS_LIVE (%s) is empty; loading from SUBSTRATE_CUE_DEFS (%s) instead\n", cueDefsLiveDir, cueDefsDir)
			} else {
				fmt.Printf("SUBSTRATE_CUE_DEFS_LIVE (%s) is nonempty; loading from it instead of SUBSTRATE_CUE_DEFS (%s)\n", cueDefsLiveDir, cueDefsDir)
				cueDefsDir = cueDefsLiveDir
			}
		} else {
			if errors.Is(err, os.ErrNotExist) {
				fmt.Printf("SUBSTRATE_CUE_DEFS_LIVE (%s) does not exist; loading from SUBSTRATE_CUE_DEFS (%s) instead\n", cueDefsLiveDir, cueDefsDir)
			} else {
				fmt.Printf("error while listing SUBSTRATE_CUE_DEFS_LIVE (%s): %s; loading from SUBSTRATE_CUE_DEFS (%s) instead\n", cueDefsLiveDir, err, cueDefsDir)
			}
		}
	} else {
		fmt.Printf("SUBSTRATE_CUE_DEFS_LIVE not set; loading from SUBSTRATE_CUE_DEFS (%s) instead\n", cueDefsDir)
	}

	ctx := context.Background()
	go func() {
		log.Printf("cleaning up...")
		p.Cleanup(ctx)
		log.Printf("clean up done")
	}()

	cueDefsLoadTags := []string{
		// Include enough config to interpret things again
		"namespace="+mustGetenv("SUBSTRATE_NAMESPACE"),
		"use_varset="+mustGetenv("SUBSTRATE_USE_VARSET"),
		"cue_defs="+mustGetenv("SUBSTRATE_CUE_DEFS"),
	}

	if os.Getenv("SUBSTRATE_SOURCE_DIRECTORY") != "" {
		cueDefsLoadTags = append(cueDefsLoadTags, "build_source_directory="+os.Getenv("SUBSTRATE_SOURCE_DIRECTORY"))
	}

	cueLoadConfig := &load.Config{
		Dir:  cueDefsDir,
		Tags: cueDefsLoadTags,
	}

	sub, err := substrate.New(
		ctx,
		mustGetenv("SUBSTRATE_DB"),
		substratefsMountpoint,
		cueLoadConfig,
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
