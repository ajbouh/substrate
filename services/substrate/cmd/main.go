package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"

	"github.com/docker/docker/client"

	"github.com/sirupsen/logrus"

	"github.com/ajbouh/substrate/pkg/activityspec"
	dockerprovisioner "github.com/ajbouh/substrate/pkg/provisioner/docker"
	"github.com/ajbouh/substrate/pkg/substratefs"
	"github.com/ajbouh/substrate/services/substrate"
	"github.com/docker/docker/api/types/mount"
)

func mustGetenv(name string) string {
	value := os.Getenv(name)
	if value == "" {
		log.Fatalf("%s not set", name)
	}
	return value
}

func mustGetenvAsInt(name string) int {
	v := mustGetenv(name)
	i, err := strconv.Atoi(v)
	if err != nil {
		log.Fatalf("%s not an integer: %s", v, err)
	}
	return i
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

	lenses := map[string]*activityspec.ServiceDef{}
	err = json.Unmarshal([]byte(os.Getenv("LENSES")), &lenses)
	if err != nil {
		log.Fatalf("error decoding LENSES: %s", err)
	}

	db, err := newDB()
	if err != nil {
		log.Fatalf("error starting db: %s", err)
	}

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

	sub := &substrate.Substrate{
		Driver:   dockerprovisioner.New(cli, mustGetenv("DOCKER_NETWORK"), mounts),
		Layout:   substratefs.NewLayout(substratefsMountpoint),
		Services: lenses,
		DB:       db,
		Mu:       &sync.RWMutex{},
		Origin:   os.Getenv("ORIGIN"),
	}

	server := &http.Server{
		Addr: ":" + port,
	}

	server.Handler = newHTTPHandler(sub)

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

//     volumes: "torch-cache": {}
//     volumes: "huggingface-cache": {}
//     services: [string]: {
//       volumes: [
//         "torch-cache:/cache/torch",
//         "huggingface-cache:/cache/huggingface",
//       ]
