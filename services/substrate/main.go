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

	"github.com/containers/podman/v4/pkg/bindings"
	"github.com/containers/podman/v4/pkg/specgen"

	specs "github.com/opencontainers/runtime-spec/specs-go"

	"github.com/sirupsen/logrus"

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

	volumes := []*specgen.NamedVolume{}
	for _, m := range strings.Split(os.Getenv("SUBSTRATE_SERVICE_DOCKER_VOLUMES"), ",") {
		source, target, ok := strings.Cut(m, ":")
		if ok {
			volumes = append(volumes, &specgen.NamedVolume{
				Name: source,
				Dest: target,
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

	prep := func(s *specgen.SpecGenerator) {
		s.Volumes = append([]*specgen.NamedVolume{}, volumes...)
		s.SelinuxOpts = []string{
			"label=disable",
		}
		// if os.Getenv("SUBSTRATE_NO_CUDA") == "" && cudaMemoryTotalMB > 0 {
		if true {
			s.Devices = []specs.LinuxDevice{
				{
					Path: "nvidia.com/gpu=all",
				},
			}
		}
	}

	dp := podmanprovisioner.New(
		func(ctx context.Context) (context.Context, error) {
			return bindings.NewConnection(ctx, os.Getenv("DOCKER_HOST"))
		},
		mustGetenv("SUBSTRATE_NAMESPACE"),
		mustGetenv("SUBSTRATE_DOCKER_NETWORK"),
		prep,
	)

	lensesExprPath := mustGetenv("SUBSTRATE_LENSES_EXPR_PATH")
	lensesExprB, err := os.ReadFile(lensesExprPath)
	if err != nil {
		log.Fatalf("error reading lenses expr: %s", err)
	}

	log.Printf("cleaning up...")
	ctx := context.Background()
	dp.Cleanup(ctx)
	log.Printf("clean up done")

	sub, err := substrate.New(
		mustGetenv("SUBSTRATE_DB"),
		substratefsMountpoint,
		string(lensesExprB),
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
