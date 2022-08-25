package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/sirupsen/logrus"

	"github.com/ajbouh/substrate/pkg/jamsocket"
	"github.com/ajbouh/substrate/pkg/substratefs"
	"github.com/ajbouh/substrate/services/substrate"
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
	ctx := context.Background()

	var substratefsMountpoint string

	lenses := map[string]*substrate.Lens{}
	err = json.Unmarshal([]byte(os.Getenv("LENSES")), &lenses)
	if err != nil {
		log.Fatalf("error decoding LENSES: %s", err)
	}

	db, err := newDB()
	if err != nil {
		log.Fatalf("error starting db: %s", err)
	}

	controllerHTTPPort := 9090

	jamsocketServices := map[string]string{}
	for _, lens := range lenses {
		if lens.Spawn.Jamsocket == nil {
			continue
		}

		jamsocketServices[lens.Spawn.Jamsocket.Service] = lens.Spawn.Jamsocket.Image
	}

	droneProxyPort := mustGetenvAsInt("PLANE_PROXY__HTTP_PORT")
	sub := &substrate.Substrate{
		JamsocketClient: &jamsocket.Client{
			Client: &http.Client{},
			Logf: func(format string, args ...interface{}) {
				log.Printf(format, args...)
			},
			URL:                "http://localhost:" + strconv.Itoa(controllerHTTPPort),
			HackDroneProxyPort: droneProxyPort,
		},
		Layout: substratefs.NewLayout(substratefsMountpoint),
		Lenses: lenses,
		DB:     db,
		Mu:     &sync.RWMutex{},
		Origin: os.Getenv("ORIGIN"),
	}

	natsServer, natsCoords, err := startNatsServer(ctx, &NatsConfig{
		StoreDir: mustGetenv("PLANE_DATA_DIR") + "/nats",
		Username: "someuser",
		Password: "somepassword",
		// Host:     "127.0.0.1",
		Host: "0.0.0.0",
		Port: mustGetenvAsInt("NATS_PORT"),
	})
	if err != nil {
		log.Fatalf("error starting nats: %s", err)
	}
	_ = natsServer

	fmt.Printf("natsCoords: %#v\n", natsCoords)

	err = startPlaneController(ctx, &PlaneControllerConfig{
		RustLog:       "debug",
		RustBacktrace: "full",

		Port:     controllerHTTPPort,
		Services: jamsocketServices,

		NatsHosts:    []string{natsCoords.Host},
		NatsUsername: natsCoords.Username,
		NatsPassword: natsCoords.Password,

		ClusterDomain: mustGetenv("PLANE_CLUSTER_DOMAIN"),
	})
	if err != nil {
		log.Fatalf("error starting controller: %s", err)
	}

	time.Sleep(5 * time.Second)

	bindsStr := os.Getenv("PLANE_AGENT__DOCKER__BINDS")
	binds := []string{}
	if bindsStr != "" {
		binds = strings.Split(bindsStr, ",")
	}

	extraHostsStr := os.Getenv("PLANE_AGENT__DOCKER__EXTRA_HOSTS")
	extraHosts := []string{}
	if extraHostsStr != "" {
		extraHosts = strings.Split(extraHostsStr, ",")
	}

	err = startPlaneDrone(ctx, &PlaneDroneConfig{
		RustLog:       "debug",
		RustBacktrace: "full",

		NatsHosts:    []string{natsCoords.Host},
		NatsUsername: natsCoords.Username,
		NatsPassword: natsCoords.Password,

		AcmeAdminEmail: "paul@driftingin.space",
		AcmeServer:     "https://acme-v02.api.letsencrypt.org/directory",

		DataDir:       mustGetenv("PLANE_DATA_DIR"),
		ClusterDomain: mustGetenv("PLANE_CLUSTER_DOMAIN"),
		DroneIP:       mustGetenv("PLANE_AGENT__IP"),
		DockerSocket:  mustGetenv("PLANE_AGENT__DOCKER__CONNECTION__SOCKET"),
		DockerBinds:   binds,
		DockerExtraHosts:   extraHosts,

		HTTPPort: droneProxyPort,

		DockerRuntime:           "runc",
		DockerInsecureGPU:       true,
		DockerAllowVolumeMounts: true,

		ProxyBindIP: mustGetenv("PLANE_PROXY__BIND_IP"),

		// TODO allow port to be automatically assigned
		ProxyPassthrough: "127.0.0.1:" + port,
	})
	if err != nil {
		log.Fatalf("error starting drone: %s", err)
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
