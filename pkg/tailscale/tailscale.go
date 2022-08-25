package tailscale

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path"
	"time"

	"tailscale.com/client/tailscale"
)

func NewFromEnvironment() (*Tailscale, bool) {
	authKey := os.Getenv("TAILSCALE_AUTHKEY")
	if authKey == "" {
		return nil, false
	}

	socket := "/tmp/tailscaled.sock"

	return &Tailscale{
		Tailscaled: "/app/tailscaled",
		Tailscale:  "/app/tailscale",
		Socket:     "/tmp/tailscaled.sock",
		StateDir:   os.Getenv("TAILSCALE_STATE_DIR"),
		Client: &tailscale.LocalClient{
			Socket: socket,
		},
		AuthKey:  authKey,
		Hostname: os.Getenv("TAILSCALE_HOSTNAME"),
	}, true
}

type Tailscale struct {
	Tailscaled string
	Tailscale  string

	Client *tailscale.LocalClient

	StateDir string
	Socket   string

	AuthKey  string
	Hostname string
}

func (t *Tailscale) Start(ctx context.Context) error {
	var err error

	err = os.MkdirAll(path.Dir(t.Socket), 0755)
	if err != nil {
		return err
	}
	tailscaledArgs := []string{
		"--socket=" + t.Socket,
	}
	if t.StateDir == "" {
		tailscaledArgs = append(tailscaledArgs, "--state=mem:")
	} else {
		err = os.MkdirAll(t.StateDir, 0755)
		if err != nil {
			return err
		}
		tailscaledArgs = append(tailscaledArgs, "--statedir="+t.StateDir)
	}
	tailscaled := exec.Command(t.Tailscaled, tailscaledArgs...)
	tailscaled.Env = nil
	tailscaled.Stderr = os.Stderr
	tailscaled.Stdout = os.Stdout
	err = tailscaled.Start()
	if err != nil {
		return fmt.Errorf("error starting tailscaled: %w", err)
	}

	err = t.AwaitSocket()
	if err != nil {
		return fmt.Errorf("error starting tailscaled: %w", err)
	}

	tailscaleUpArgs := []string{
		"--socket", t.Socket,
		"up",
		"--authkey=" + t.AuthKey,
	}
	if t.Hostname != "" {
		tailscaleUpArgs = append(tailscaleUpArgs, "--hostname="+t.Hostname)
	}
	tailscaleUp := exec.Command(t.Tailscale, tailscaleUpArgs...)
	tailscaleUp.Stderr = os.Stderr
	tailscaleUp.Stdout = os.Stdout
	err = tailscaleUp.Run()
	if err != nil {
		return fmt.Errorf("error bringing tailscale up: %w", err)
	}

	return nil
}

func (t *Tailscale) AwaitSocket() error {
	var err error
	attempts := 10
	for attempt := 0; attempt < attempts; attempt++ {
		_, err = os.Stat(t.Socket)
		if err == nil {
			return nil
		}

		sleep := 2 * time.Second

		log.Printf("tailscale socket not yet ready (%s); attempt #%d, sleeping for %s...", err, attempt+1, sleep)
		time.Sleep(sleep)
	}

	return fmt.Errorf("socket %s not ready after %d attempts. last error: %w", t.Socket, attempts, err)
}

func (t *Tailscale) DNSName(ctx context.Context) (string, error) {
	status, err := t.Client.StatusWithoutPeers(ctx)
	if err != nil {
		return "", fmt.Errorf("error getting tailscale dns name: %w", err)
	}

	return status.Self.DNSName, nil
}

func (t *Tailscale) GetCertificate(hi *tls.ClientHelloInfo) (*tls.Certificate, error) {
	return t.Client.GetCertificate(hi)
}
