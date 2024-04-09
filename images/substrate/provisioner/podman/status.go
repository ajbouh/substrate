package podmanprovisioner

import (
	"context"
	"fmt"
	"io"
	"log"
	"net"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/ajbouh/substrate/images/substrate/provisioner"
	"github.com/containers/podman/v4/libpod/define"
	"github.com/containers/podman/v4/pkg/bindings/containers"
	"github.com/containers/podman/v4/pkg/bindings/system"
	"github.com/containers/podman/v4/pkg/domain/entities"
)

type StatusEvent struct {
	Backend string `json:"backend"`
	State   State  `json:"state"`
	Time    string `json:"time"`
	Err     error  `json:"error,omitempty"`
}

func (e *StatusEvent) Error() error {
	return e.Err
}

func (e *StatusEvent) IsPending() bool {
	return e.State.IsPending()
}

func (e *StatusEvent) IsReady() bool {
	return e.State.IsReady()
}

func (e *StatusEvent) IsGone() bool {
	return e.State.IsGone()
}

func (e *StatusEvent) String() string {
	return fmt.Sprintf("backend=%s state=%s time=%s err=%s", e.Backend, e.State, e.Time, e.Err)
}

func ipAndPortFromContainerJSON(containerJSON *define.InspectContainerData) (string, string) {
	for _, e := range containerJSON.Config.Env {
		if strings.HasPrefix(e, "PORT=") {
			port := strings.TrimPrefix(e, "PORT=")
			return containerJSON.Config.Hostname, port
		}
	}

	log.Printf("warn: no PORT= entry in env %#v", containerJSON.Config.Env)
	return containerJSON.Config.Hostname, "8000"
}

type ContainerStatusCheck struct {
	connect     func(ctx context.Context) (context.Context, error)
	containerID string

	host string
	port string

	containerJSONTime time.Time
	containerJSON     *define.InspectContainerData

	waitForReadyTimeout time.Duration
	waitForReadyTick    time.Duration

	readyMutex *sync.Mutex
	ready      *atomic.Bool
}

func (c *ContainerStatusCheck) checkReady() bool {
	return c.ready.Load()
}

func (c *ContainerStatusCheck) waitUntilReadyTCP(ctx context.Context, maxAttempts int) error {
	log.Printf("waitUntilReadyTCP host=%s port=%s maxAttempts=%d", c.host, c.port, maxAttempts)

	c.readyMutex.Lock()
	defer c.readyMutex.Unlock()

	if c.ready.Load() {
		log.Printf("waitUntilReadyTCP ready was cached for host=%s port=%s maxAttempts=%d", c.host, c.port, maxAttempts)
		return nil
	}

	timeout := time.After(c.waitForReadyTimeout)
	tick := time.Tick(c.waitForReadyTick)
	attempts := 0
	for {
		if maxAttempts >= 0 && attempts >= maxAttempts {
			log.Printf("waitUntilReadyTCP gave up on host=%s port=%s attempts=%d maxAttempts=%d", c.host, c.port, attempts, maxAttempts)
			return fmt.Errorf("no more attempts allowed to check if container is ready")
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-timeout:
			log.Printf("waitUntilReadyTCP timed out host=%s port=%s attempts=%d maxAttempts=%d", c.host, c.port, attempts, maxAttempts)
			return fmt.Errorf("timed out waiting for the container to be ready")
		case <-tick:
			log.Printf("waitUntilReadyTCP try host=%s port=%s attempts=%d maxAttempts=%d", c.host, c.port, attempts, maxAttempts)
			conn, err := net.Dial("tcp", fmt.Sprintf("%s:%s", c.host, c.port))
			if err != nil {
				if e, ok := err.(*net.DNSError); ok && e.IsNotFound {
					return fmt.Errorf("gave up waiting for the container to be ready, since it seems to be gone: %w", err)
				}
				attempts++
				log.Printf("waitUntilReadyTCP err host=%s port=%s attempts=%d maxAttempts=%d err=%s", c.host, c.port, attempts, maxAttempts, err)
				continue
			}
			conn.Close()
			c.ready.Store(true)
			log.Printf("waitUntilReadyTCP success for host=%s port=%s attempts=%d maxAttempts=%d", c.host, c.port, attempts, maxAttempts)
			return nil
		}
	}
}

func (c *ContainerStatusCheck) Status(ctx context.Context) (provisioner.Event, error) {
	var state State

	if c.containerJSON.State != nil {
		if c.containerJSON.State.Status == "running" {
			err := c.waitUntilReadyTCP(ctx, 1)
			if err == nil {
				state = StateFromDockerStatus(c.containerJSON.State.Status, true)
			} else {
				state = StateFromDockerStatus(c.containerJSON.State.Status, false)
			}
		}
	}
	return &StatusEvent{
		Backend: c.containerID,
		State:   state,
		Time:    c.containerJSONTime.Format(time.RFC3339Nano),
	}, nil
}

func (c *ContainerStatusCheck) StatusStream(ctx context.Context) (<-chan provisioner.Event, error) {
	statusCh := make(chan provisioner.Event)

	go func() {
		defer close(statusCh)

		ctx, err := c.connect(ctx)
		if err != nil {
			log.Printf("error %#v", err)
			return
		}
		eventsOptions := &system.EventsOptions{
			Filters: map[string][]string{
				"type":      []string{"container"},
				"container": []string{c.containerID},
			},
		}
		eventChan := make(chan entities.Event)
		cancelChan := make(chan bool, 1)
		go func() {
			defer close(cancelChan)
			<-ctx.Done()
			cancelChan <- true
		}()

		emit := func(ev provisioner.Event) {
			log.Printf("event %#v", ev)
			statusCh <- ev
		}

		go func() {
			defer close(eventChan)
			err := system.Events(ctx, eventChan, cancelChan, eventsOptions)
			if err != nil && err != io.EOF {
				now := time.Now().UTC()
				emit(&StatusEvent{
					Err:  err,
					Time: now.Format(time.RFC3339Nano),
				})
			}
		}()

		// Check the current status of the container
		now := time.Now().UTC()
		ev, err := c.Status(ctx)
		if err != nil {
			emit(&StatusEvent{
				Err:  err,
				Time: now.Format(time.RFC3339Nano),
			})
			return
		}
		emit(ev)
		if ev.IsPending() {
			if err := c.waitUntilReadyTCP(ctx, -1); err == nil {
				now := time.Now().UTC()
				emit(&StatusEvent{
					Backend: c.containerID,
					State:   ReadyState,
					Time:    now.Format(time.RFC3339Nano),
				})
			}
		}

		for {
			select {
			case <-ctx.Done():
				return
			case event := <-eventChan:
				if c.containerJSON.State.Status == "running" {
					// Do we already know it's ready? If so, that's all we care about.
					if err := c.waitUntilReadyTCP(ctx, 0); err == nil {
						emit(&StatusEvent{
							Backend: c.containerID,
							State:   StateFromDockerStatus(event.Action, true),
							Time:    time.Unix(event.Time, event.TimeNano).Format(time.RFC3339Nano),
						})
					} else {
						// otherwise announce it as running, then as ready...
						emit(&StatusEvent{
							Backend: c.containerID,
							State:   StateFromDockerStatus(event.Action, false),
							Time:    time.Unix(event.Time, event.TimeNano).Format(time.RFC3339Nano),
						})
						if err := c.waitUntilReadyTCP(ctx, -1); err == nil {
							emit(&StatusEvent{
								Backend: c.containerID,
								State:   StateFromDockerStatus(event.Action, true),
								Time:    time.Unix(event.Time, event.TimeNano).Format(time.RFC3339Nano),
							})
						}
					}
				} else {
					emit(&StatusEvent{
						Backend: c.containerID,
						State:   StateFromDockerStatus(event.Action, false),
						Time:    time.Unix(event.Time, event.TimeNano).Format(time.RFC3339Nano),
					})
				}
			}
		}
	}()

	return statusCh, nil
}

func (p *P) containerStatusCheck(ctx context.Context, containerID string) (*ContainerStatusCheck, error) {
	ctx, err := p.connect(ctx)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	containerJSON, err := containers.Inspect(ctx, containerID, nil)
	if err != nil {
		return nil, err
	}

	host, port := ipAndPortFromContainerJSON(containerJSON)

	return &ContainerStatusCheck{
		connect:             p.connect,
		host:                host,
		port:                port,
		containerID:         containerID,
		containerJSON:       containerJSON,
		containerJSONTime:   now,
		waitForReadyTimeout: p.waitForReadyTimeout,
		waitForReadyTick:    p.waitForReadyTick,
		readyMutex:          &sync.Mutex{},
		ready:               &atomic.Bool{},
	}, nil
}

func (p *P) Status(ctx context.Context, name string) (provisioner.Event, error) {
	sc, err := p.containerStatusCheck(ctx, name)
	if err != nil {
		return nil, err
	}

	return sc.Status(ctx)
}

func (p *P) StatusStream(ctx context.Context, name string) (<-chan provisioner.Event, error) {
	sc, err := p.containerStatusCheck(ctx, name)
	if err != nil {
		return nil, err
	}

	return sc.StatusStream(ctx)
}
