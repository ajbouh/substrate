package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

type PlaneControllerConfig struct {
	RustLog       string
	RustBacktrace string

	NatsHosts    string
	NatsUsername string
	NatsPassword string

	ClusterDomain string
}

func startPlaneController(ctx context.Context, config *PlaneControllerConfig) error {
	cmd := exec.CommandContext(ctx, "/bin/plane-controller")

	cmd.Env = []string{
		// "RUST_LOG=info,sqlx=warn,rustls=off",
		// "RUST_LOG=info,bollard::docker=debug,sqlx=warn,rustls=off",
		"RUST_LOG=" + config.RustLog,
		"RUST_BACKTRACE=" + config.RustBacktrace,

		"PLANE_NATS__HOSTS=" + config.NatsHosts,
		"PLANE_NATS__AUTH__USERNAME=" + config.NatsUsername,
		"PLANE_NATS__AUTH__PASSWORD=" + config.NatsPassword,

		"PLANE_CLUSTER_DOMAIN=" + config.ClusterDomain,
	}
	cmd.Stderr = os.Stderr
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}

	if err = cmd.Start(); err != nil {
		return err
	}

	go func() {
		scanner := bufio.NewScanner(stdout)
		for scanner.Scan() {
			fmt.Println("[plane-controller]", scanner.Text())
		}

		err := cmd.Wait()
		if err != nil {
			log.Printf("error waiting for plane-controller to exit; %s", err)
		} else {
			log.Printf("plane-controller exited with code=%d", cmd.ProcessState.ExitCode())
		}
	}()

	return nil
}

type PlaneDroneConfig struct {
	RustLog       string
	RustBacktrace string

	NatsHosts    string
	NatsUsername string
	NatsPassword string

	ClusterDomain string

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
}

// start plane-drone (with additional args?)
func startPlaneDrone(ctx context.Context, config *PlaneDroneConfig) error {
	cmd := exec.CommandContext(ctx, "/bin/plane-drone")

	cmd.Env = []string{
		// "RUST_LOG=info,sqlx=warn,rustls=off",
		// "RUST_LOG=info,bollard::docker=debug,sqlx=warn,rustls=off",
		"RUST_LOG=" + config.RustLog,
		"RUST_BACKTRACE=" + config.RustBacktrace,

		"PLANE_DB_PATH=" + config.DataDir + "/state.db",
		"PLANE_CERT__KEY_PATH=" + config.DataDir + "/cert.key",
		"PLANE_CERT__CERT_PATH=" + config.DataDir + "/cert.pem",

		"PLANE_CLUSTER_DOMAIN=" + config.ClusterDomain,

		"PLANE_NATS__HOSTS=" + config.NatsHosts,
		"PLANE_NATS__AUTH__USERNAME=" + config.NatsUsername,
		"PLANE_NATS__AUTH__PASSWORD=" + config.NatsPassword,

		// "PLANE_AGENT__IP__API=https://api.ipify.org",
		"PLANE_AGENT__IP=" + config.DroneIP,

		"PLANE_AGENT__DOCKER__CONNECTION__SOCKET=" + config.DockerSocket,

		// "PLANE_ACME__ADMIN_EMAIL=" + config.AcmeAdminEmail,
		// "PLANE_ACME__SERVER=" + config.AcmeServer,
		"PLANE_AGENT__DOCKER__RUNTIME=" + config.DockerRuntime,
		"PLANE_AGENT__DOCKER__INSECURE_GPU=" + strconv.FormatBool(config.DockerInsecureGPU),
		"PLANE_AGENT__DOCKER__ALLOW_VOLUME_MOUNTS=" + strconv.FormatBool(config.DockerAllowVolumeMounts),

		"PLANE_AGENT__DOCKER__BINDS=" + strings.Join(config.DockerBinds, ", "),
		"PLANE_PROXY__BIND_IP=" + config.ProxyBindIP,
		// "PLANE_PROXY__PASSTHROUGH=" + config.ProxyPassthrough,
		// "PLANE_PROXY__HTTPS_PORT=8443",
		// "PLANE_PROXY__HTTP_PORT=8081",
	}
	cmd.Stderr = os.Stderr
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}

	err = cmd.Start()
	if err != nil {
		return err
	}

	go func() {
		scanner := bufio.NewScanner(stdout)
		for scanner.Scan() {
			fmt.Println("[plane-drone]", scanner.Text())
		}

		err := cmd.Wait()
		if err != nil {
			log.Printf("error waiting for plane-drone to exit; %s", err)
		} else {
			log.Printf("plane-drone exited with code=%d", cmd.ProcessState.ExitCode())
		}
	}()

	return nil
}
