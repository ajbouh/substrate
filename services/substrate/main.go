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

	"github.com/docker/docker/client"

	"github.com/sirupsen/logrus"

	dockerprovisioner "github.com/ajbouh/substrate/pkg/provisioner/docker"
	"github.com/ajbouh/substrate/pkg/substrate"
	"github.com/ajbouh/substrate/pkg/substratehttp"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
)

func mustGetenv(name string) string {
	value := os.Getenv(name)
	if value == "" {
		log.Fatalf("%s not set", name)
	}
	return value
}

func main() {
	debug := os.Getenv("DEBUG")
	if ok, _ := strconv.ParseBool(debug); ok {
		logrus.SetLevel(logrus.DebugLevel)
	}

	for _, env := range os.Environ() {
		fmt.Println(env)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	var err error

	var substratefsMountpoint string

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

	var deviceRequests []container.DeviceRequest
	if os.Getenv("SUBSTRATE_NO_CUDA") == "" && cudaMemoryTotalMB > 0 {
		deviceRequests = []container.DeviceRequest{
			{
				Driver:       "nvidia",
				Count:        -1,
				Capabilities: [][]string{{"gpu"}},
			},
		}
	}
	dp := dockerprovisioner.New(cli, mustGetenv("SUBSTRATE_NAMESPACE"), mustGetenv("SUBSTRATE_DOCKER_NETWORK"), mounts, deviceRequests)

	log.Printf("cleaning up...")
	ctx := context.Background()
	dp.Cleanup(ctx)
	log.Printf("clean up done")

	sub, err := substrate.New(
		mustGetenv("SUBSTRATE_DB"),
		substratefsMountpoint,
		mustGetenv("SUBSTRATE_LENSES_EXPR"),
		dp,
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
