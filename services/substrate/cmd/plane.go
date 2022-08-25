package main

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"

	toml "github.com/pelletier/go-toml/v2"
)

type PlaneControllerConfig struct {
	RustLog       string
	RustBacktrace string

	Port int

	Cluster  string
	Services map[string]string

	NatsHosts    []string
	NatsUsername string
	NatsPassword string

	ClusterDomain string
}

func writeTempTOMLConfig(config any) (string, error) {
	configFile, err := os.CreateTemp("", "plane-config.*.toml")
	if err != nil {
		return "", err
	}

	defer configFile.Close()

	err = toml.NewEncoder(configFile).Encode(config)
	if err != nil {
		defer os.Remove(configFile.Name())
		return "", err
	}

	return configFile.Name(), nil
}

func startPlaneController(ctx context.Context, config *PlaneControllerConfig) error {
	configFile, err := writeTempTOMLConfig(map[string]any{
		"nats": map[string]any{
			"hosts": config.NatsHosts,
			"auth": map[string]any{
				"username": config.NatsUsername,
				"password": config.NatsPassword,
			},
		},
		"dns": map[string]any{
			"port": 53,
		},
		"scheduler": map[string]any{},
		"http": map[string]any{
			"port":     config.Port,
			"cluster":  config.ClusterDomain,
			"services": config.Services,
		},
	})
	if err != nil {
		return err
	}

	configDump, _ := os.ReadFile(configFile)
	fmt.Printf("[plane-controller config]\n%s\n", string(configDump))
	cmd := exec.CommandContext(ctx, "/bin/plane-controller", configFile)


	cmd.Env = []string{
		// "RUST_LOG=info,sqlx=warn,rustls=off",
		// "RUST_LOG=info,bollard::docker=debug,sqlx=warn,rustls=off",

		"RUST_LOG=" + config.RustLog,
		"RUST_BACKTRACE=" + config.RustBacktrace,
	}

	for _, entry := range cmd.Env {
		fmt.Printf("[plane-controller env] %s\n", entry)
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return err
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}

	if err = cmd.Start(); err != nil {
		return err
	}

	go streamPipeWithPrefix(cmd, "[plane-controller out]", stdout)
	go streamPipeWithPrefix(cmd, "[plane-controller err]", stderr)
	go awaitExit(cmd, "[plane-controller exit]", func() { os.Remove(configFile) })

	return nil
}

type PlaneDroneConfig struct {
	RustLog       string
	RustBacktrace string

	NatsHosts    []string
	NatsUsername string
	NatsPassword string

	ClusterDomain string
	HTTPPort      int

	AcmeAdminEmail string
	AcmeServer     string
	DataDir        string
	DroneIP        string
	DockerSocket   string

	ProxyBindIP      string
	ProxyPassthrough string

	DockerRuntime           string
	DockerInsecureGPU       bool
	DockerAllowVolumeMounts bool

	DockerBinds []string
	DockerExtraHosts []string
}

// start plane-drone (with additional args?)
func startPlaneDrone(ctx context.Context, config *PlaneDroneConfig) error {
	configFile, err := writeTempTOMLConfig(map[string]any{
		"db_path":        config.DataDir + "/state.db",
		"cluster_domain": config.ClusterDomain,

		"nats": map[string]any{
			"hosts": config.NatsHosts,
			"auth": map[string]any{
				"username": config.NatsUsername,
				"password": config.NatsPassword,
			},
		},

		// "cert": map[string]any{
		// 	"key_path":  config.DataDir + "/cert.key",
		// 	"cert_path": config.DataDir + "/cert.pem",
		// },
		// "acme": map[string]any{
		// 	"admin_email": config.AcmeAdminEmail,
		// 	"server":      config.AcmeServer,
		// },

		"agent": map[string]any{
			"ip": config.DroneIP,

			"docker": map[string]any{
				"socket":              config.DockerSocket,
				"runtime":             config.DockerRuntime,
				"insecure_gpu":        config.DockerInsecureGPU,
				"allow_volume_mounts": config.DockerAllowVolumeMounts,
				"binds":               config.DockerBinds,
				"extra_hosts":               config.DockerExtraHosts,
			},
		},
		"proxy": map[string]any{
			// "bind_ip": config.ProxyBindIP,
			// "passthrough": config.ProxyPassthrough,
			"http_port": config.HTTPPort,
			"bind_ip":   "0.0.0.0",
			// "allow_path_routing": true,

			// "https_port": 8443,
		},
	})

	if err != nil {
		return err
	}

	configDump, _ := os.ReadFile(configFile)
	fmt.Printf("[plane-drone config]\n%s\n", string(configDump))

	cmd := exec.CommandContext(ctx, "/bin/plane-drone", configFile)

	cmd.Env = []string{
		// "RUST_LOG=info,sqlx=warn,rustls=off",
		// "RUST_LOG=info,bollard::docker=debug,sqlx=warn,rustls=off",
		// "RUST_LOG=" + config.RustLog,
		// "RUST_BACKTRACE=" + config.RustBacktrace,
	}

	for _, entry := range cmd.Env {
		fmt.Printf("[plane-drone env] %s\n", entry)
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		return err
	}

	err = cmd.Start()
	if err != nil {
		return err
	}

	go streamPipeWithPrefix(cmd, "[plane-drone out]", stdout)
	go streamPipeWithPrefix(cmd, "[plane-drone err]", stderr)
	go awaitExit(cmd, "[plane-drone exit]", func() { os.Remove(configFile) })

	return nil
}

func streamPipeWithPrefix(cmd *exec.Cmd, prefix string, r io.Reader) {
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		fmt.Println(prefix, scanner.Text())
	}
}

func awaitExit(cmd *exec.Cmd, prefix string, fns ...func()) {
	for _, fn := range fns {
		defer fn()
	}

	err := cmd.Wait()
	if err != nil {
		log.Printf("%s error waiting for %s to exit; %s", prefix, cmd.Path, err)
	} else {
		log.Printf("%s %s exited with code=%d", prefix, cmd.Path, cmd.ProcessState.ExitCode())
	}
}
