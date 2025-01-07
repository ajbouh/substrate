package units

import (
	"bufio"
	"context"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"sync"

	"github.com/containers/podman/v5/pkg/api/handlers"
	"github.com/containers/podman/v5/pkg/bindings/containers"
	"github.com/containers/podman/v5/pkg/specgen"
	dockerContainer "github.com/docker/docker/api/types/container"
)

type PodmanContainerPTY struct {
	mu          sync.Mutex
	containerID string

	Connect func(context.Context) (context.Context, error)
	Prepare func(context.Context, *specgen.SpecGenerator) error

	Image string

	// should be a command that sleeps forever, all the interesting work happens in ptycmd elsewhere.
	StartCmd []string
	StartDir string
	StartEnv map[string]string

	PTYUser string
	PTYCmd  []string
	PTYEnv  map[string]string
	PTYDir  string
}

type readWriteCloser struct {
	rd     io.ReadCloser
	wr     io.WriteCloser
	cancel func()
}

func (r *readWriteCloser) Close() error {
	r.cancel()
	return errors.Join(r.wr.Close(), r.rd.Close())
}

func (r *readWriteCloser) Read(p []byte) (n int, err error) {
	return r.rd.Read(p)
}

func (r *readWriteCloser) Write(p []byte) (n int, err error) {
	return r.wr.Write(p)
}

var _ io.ReadWriteCloser = (*readWriteCloser)(nil)

func (m *PodmanContainerPTY) init() (string, error) {
	slog.Info("PodmanContainerPTY.init()", "image", m.Image, "command", m.StartCmd, "workdir", m.StartDir, "env", m.StartEnv)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	ctx, err := m.Connect(ctx)
	slog.Info("PodmanContainerPTY.init() Connect", "err", err)
	if err != nil {
		return "", fmt.Errorf("error connecting: %w", err)
	}

	s := specgen.NewSpecGenerator(m.Image, false)
	remove := true
	s.Remove = &remove
	s.Command = m.StartCmd
	s.WorkDir = m.StartDir
	s.Env = map[string]string{}
	for k, v := range m.StartEnv {
		s.Env[k] = v
	}

	if m.Prepare != nil {
		err = m.Prepare(ctx, s)
		if err != nil {
			return "", fmt.Errorf("error preparing: %w", err)
		}
	}

	cResp, err := containers.CreateWithSpec(ctx, s, &containers.CreateOptions{})
	if err != nil {
		return "", fmt.Errorf("error creating: %w", err)
	}
	slog.Info("PodmanContainerPTY.init() CreateWithSpec", "cid", cResp.ID, "err", err)

	err = containers.Start(ctx, cResp.ID, &containers.StartOptions{})
	slog.Info("PodmanContainerPTY.init() Start", "err", err)
	if err != nil {
		return "", fmt.Errorf("error start: %w", err)
	}

	return cResp.ID, nil
}

func (m *PodmanContainerPTY) ensure() (string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.containerID != "" {
		return m.containerID, nil
	}

	containerID, err := m.init()
	if err == nil {
		m.containerID = containerID
	}

	return containerID, err
}

func (m *PodmanContainerPTY) MakePTY() (io.ReadWriteCloser, error) {
	slog.Info("PodmanContainerPTY.MakePTY()", "image", m.Image, "command", m.PTYCmd, "workdir", m.PTYDir, "env", m.PTYEnv)

	containerID, err := m.ensure()
	slog.Info("PodmanContainerPTY.MakePTY() init", "containerID", containerID, "err", err)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithCancel(context.Background())

	ctx, err = m.Connect(ctx)
	slog.Info("PodmanContainerPTY.MakePTY() Connect", "err", err)
	if err != nil {
		return nil, fmt.Errorf("error connecting: %w", err)
	}

	stdinSource, stdinSink := io.Pipe()
	stdoutSource, stdoutSink := io.Pipe()

	go func() {
		env := make([]string, 0, len(m.PTYEnv))
		for k, v := range m.PTYEnv {
			env = append(env, k+"="+v)
		}

		sessionID, err := containers.ExecCreate(ctx, containerID, &handlers.ExecCreateConfig{
			ExecOptions: dockerContainer.ExecOptions{
				User:         m.PTYUser,
				Cmd:          m.PTYCmd,
				Env:          env,
				WorkingDir:   m.PTYDir,
				AttachStdin:  true,
				AttachStdout: true,
				AttachStderr: true,
				Tty:          true,
				Privileged:   true,
				ConsoleSize:  &[2]uint{20, 80},
			},
		})
		slog.Info("PodmanContainerPTY.MakePTY() ExecCreate", "sessionID", sessionID, "err", err)
		if err != nil {
			defer stdinSource.Close()
			defer stdoutSink.CloseWithError(fmt.Errorf("error execcreate: %w", err))
			return
		}

		var w io.Writer = stdoutSink
		var r *bufio.Reader = bufio.NewReader(stdinSource)
		t := true
		// Attach to the container
		err = containers.ExecStartAndAttach(ctx, sessionID, &containers.ExecStartAndAttachOptions{
			OutputStream: &w,
			ErrorStream:  &w,
			InputStream:  r,
			AttachOutput: &t,
			AttachError:  &t,
			AttachInput:  &t,
		})
		slog.Info("PodmanContainerPTY.MakePTY() ExecStartAndAttach", "err", err)
		defer stdinSource.Close()
		if err != nil {
			defer stdoutSink.CloseWithError(fmt.Errorf("error execstartandattach: %w", err))
			return
		}

		defer stdoutSink.Close()
	}()

	return &readWriteCloser{
		rd:     stdoutSource,
		wr:     stdinSink,
		cancel: cancel,
	}, nil
}
