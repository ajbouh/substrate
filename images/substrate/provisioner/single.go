package provisioner

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

type Spawner interface {
	Spawn(context.Context, *activityspec.ServiceSpawnRequest, *activityspec.ServiceSpawnResolution) (*activityspec.ServiceSpawnResponse, <-chan Event, error)
	Shutdown(ctx context.Context, name string, reason error) error
}

type ServiceResolver interface {
	ResolveService(ctx context.Context, ServiceSpawnRequest *activityspec.ServiceSpawnRequest) (*activityspec.ServiceSpawnResolution, bool, error)
}

type RequestEntry struct {
	RequestID string    `json:"request_id"`
	Time      time.Time `json:"ts"`
}

type Sample struct {
	ServiceSpawnResponse *activityspec.ServiceSpawnResponse `json:"spawn,omitempty"`
	RecentRequest        *RequestEntry                      `json:"recent_request,omitempty"`
	Outgoing             Fields                             `json:"exports,omitempty"`
	Incoming             Fields                             `json:"imports,omitempty"`
}

type Generation struct {
	cached                      *url.URL
	cleanup                     func(reason error)
	provisioned                 *activityspec.ServiceSpawnResponse
	provisionedResolutionDigest string
}

func (g *Generation) ServiceSpawnResponse() *activityspec.ServiceSpawnResponse {
	if g == nil {
		return nil
	}
	return g.provisioned
}

func (g *Generation) Digest() string {
	if g == nil {
		return ""
	}
	return g.provisionedResolutionDigest
}

type CachingSingleServiceProvisioner struct {
	spawnMu sync.Mutex

	gen              atomic.Pointer[Generation]
	lastRequestEntry atomic.Pointer[RequestEntry]
	outgoingFields   atomic.Pointer[Fields]

	Key string

	Spawner                 Spawner
	ServiceResolver         ServiceResolver
	ServiceSpawnRequest     *activityspec.ServiceSpawnRequest
	InternalSubstrateOrigin string

	Log *slog.Logger
}

func (e *CachingSingleServiceProvisioner) Initialize() {
	e.outgoingFields.Store(&Fields{})
}

func (e *CachingSingleServiceProvisioner) set(provisioned *activityspec.ServiceSpawnResponse, v *url.URL) func(reason error) {
	copy := *v
	var gen *Generation
	gen = &Generation{
		cached:                      &copy,
		provisioned:                 provisioned,
		provisionedResolutionDigest: provisioned.ServiceSpawnResolution.Digest(),
		cleanup: func(reason error) {
			if e.gen.CompareAndSwap(gen, nil) {
				e.Log.Info("action=cache:clear", "key", e.Key, "cleanupGen", gen, "err", reason)
			} else {
				e.Log.Info("action=cache:staleclear", "key", e.Key, "gen", e.gen.Load(), "cleanupGen", gen, "err", reason)
			}
		},
	}

	e.gen.Store(gen)
	e.Log.Info("action=cache:set", "key", e.Key, "gen", gen, "url", v)

	return gen.cleanup
}

func (e *CachingSingleServiceProvisioner) get() *Provisioning {
	gen := e.gen.Load()
	if gen != nil {
		// e.Log.Info("action=cache:get", "key", e.Key, "gen", gen, "url", gen.cached)
		copy := *gen.cached
		return &Provisioning{Target: &copy, Cleanup: gen.cleanup}
	}
	// e.Log.Info("action=cache:get", "key", e.Key, "gen", gen, "url", "")
	return nil
}

func (e *CachingSingleServiceProvisioner) Generation() *Generation {
	return e.gen.Load()
}

func (e *CachingSingleServiceProvisioner) Peek() *Sample {
	sample := &Sample{
		RecentRequest: e.lastRequestEntry.Load(),
	}

	gen := e.gen.Load()
	if gen != nil {
		sample.ServiceSpawnResponse = gen.provisioned
	}

	out := e.outgoingFields.Load()
	if out != nil {
		sample.Outgoing = *out
	}

	return sample
}

var _ links.Querier = (*CachingSingleServiceProvisioner)(nil)

func (e *CachingSingleServiceProvisioner) QueryLinks(ctx context.Context) (links.Links, error) {
	l := links.Links{}
	gen := e.gen.Load()
	if gen == nil {
		return l, nil
	}

	for k, v := range gen.provisioned.ServiceSpawnResolution.Parameters {
		switch {
		case v.Space != nil:
			l["parameter/"+k] = links.Link{
				Rel:  "space",
				HREF: "/substrate/v1/spaces/" + v.Space.SpaceID,
				Attributes: map[string]any{
					"spawn:parameter": k,
				},
			}
		}
	}

	return l, nil
}

func (c *CachingSingleServiceProvisioner) LogRequest(r *http.Request) {
	c.lastRequestEntry.Store(&RequestEntry{RequestID: "", Time: time.Now()})
}

func (e *CachingSingleServiceProvisioner) PurgeIfChanged(ctx context.Context) (bool, *Generation, error) {
	gen := e.gen.Load()

	if gen == nil {
		slog.Info("PurgeIfChanged", "key", e.Key, "gen", gen, "spawnPending", false, "instance", &e)
		return true, nil, nil
	}

	was := gen.provisionedResolutionDigest
	provisioned := gen.provisioned
	cleanup := gen.cleanup

	res, _, err := e.ServiceResolver.ResolveService(ctx, e.ServiceSpawnRequest)
	if err != nil {
		return false, gen, err
	}

	now := res.Digest()
	log.Printf("Refresh key:%s name:%s now:%s was:%s", provisioned.ServiceSpawnResolution.ServiceName, provisioned.Name, now, was)

	if now != was {
		log.Printf("prv %#v", &provisioned.ServiceSpawnResolution)
		log.Printf("cur %#v", res)
		reason := fmt.Errorf("digest changed; was %s, now %s", was, now)
		cleanup(reason)
		err := e.Spawner.Shutdown(ctx, provisioned.Name, reason)
		return true, gen, err
	}

	return false, gen, nil
}

type ConcretizationRequiredError struct {
	ServiceSpawnRequest    activityspec.ServiceSpawnRequest
	ServiceSpawnResolution activityspec.ServiceSpawnResolution
}

var _ error = (*ConcretizationRequiredError)(nil)

func (e *ConcretizationRequiredError) Error() string {
	return fmt.Sprintf("ConcretizationRequiredError: %#v -> %#v", e.ServiceSpawnRequest, e.ServiceSpawnResolution)
}

func urlPathEscape(s string) string {
	return strings.ReplaceAll(s, "/", "%2F")
}

func (e *CachingSingleServiceProvisioner) ServeHTTP(rw http.ResponseWriter, rq *http.Request) {
	start := time.Now()

	// maybe should pass this through as a field
	viewspec := rq.PathValue("viewspec")
	rest := rq.PathValue("rest")

	defer func() {
		slog.Info("request", "remoteaddr", rq.RemoteAddr, "method", rq.Method, "url", rq.URL.String(), "viewspec", viewspec, "rest", rest, "dur", time.Since(start))
	}()

	cookies := rq.Cookies()
	rq.Header.Del("Cookie")

	// TODO check entitlements and only put cookies back if we *must*
	for _, cookie := range cookies {
		// if cookie.Domain == "" { // constrain cookie to the given host
		// 	cookie.Domain = rq.Host
		// }

		s := cookie.String()
		log.Printf("keeping cookie: %s\n", s)
		rq.Header.Add("Set-Cookie", s)
	}
	// fmt.Printf("rq.header: %#v", rq.Header)

	// Strip prefix
	rq.Host = ""
	rq.URL.Path = "/" + strings.TrimPrefix(rest, "/")
	if e.InternalSubstrateOrigin != "" {
		rq.URL.RawQuery = strings.ReplaceAll(rq.URL.RawQuery, "$origin", url.QueryEscape(e.InternalSubstrateOrigin))
		rq.URL.Path = strings.ReplaceAll(rq.URL.Path, "$origin", e.InternalSubstrateOrigin)
	}
	rq.URL.RawPath = ""

	e.LogRequest(rq)
	provisioningReverseProxy(e.Ensure, 2, nil, rw, rq)
}

func (e *CachingSingleServiceProvisioner) Ensure(ctx context.Context) (*Provisioning, error) {
	// slog.Info("CachingSingleServiceProvisioner.Ensure()", "key", e.Key, "instance", e)

	// try once without holding the lock.
	if provisioning := e.get(); provisioning != nil {
		return provisioning, nil
	}

	// Lock here and expect unlock to happen next
	e.spawnMu.Lock()
	defer e.spawnMu.Unlock()

	// check again since we might be racing another call to Ensure
	if provisioning := e.get(); provisioning != nil {
		return provisioning, nil
	}

	sreso, varying, err := e.ServiceResolver.ResolveService(ctx, e.ServiceSpawnRequest)
	if err != nil {
		return nil, fmt.Errorf("error resolving: %w", err)
	}

	if varying {
		return nil, &ConcretizationRequiredError{
			ServiceSpawnRequest:    *e.ServiceSpawnRequest,
			ServiceSpawnResolution: *sreso,
		}
	}

	streamCtx, streamCancel := context.WithCancel(context.Background())

	sres, ch, err := e.Spawner.Spawn(streamCtx, e.ServiceSpawnRequest, sreso)
	if err != nil {
		streamCancel()
		return nil, fmt.Errorf("error spawning: %w", err)
	}

	parsed, err := url.Parse(sres.BackendURL)
	if err != nil {
		streamCancel()
		return nil, fmt.Errorf("error parsing BackendURL: %w", err)
	}

	cleanup := e.set(sres, parsed)

	ready := false

	for event := range ch {
		log.Printf("event service:%s name:%s %#v", sres.ServiceSpawnResolution.ServiceName, sres.Name, event)
		if event.Error() != nil {
			streamCancel()
			return nil, fmt.Errorf("backend will never be ready; err=%w", event.Error())
		}

		if event.IsPending() {
			continue
		}

		if event.IsReady() {
			ready = true
			break
		}

		if event.IsGone() {
			streamCancel()
			return nil, fmt.Errorf("backend will never be ready; event=%s", event.String())
		}
	}

	if !ready {
		streamCancel()
		return nil, fmt.Errorf("status stream ended without ready")
	}

	go func() {
		// Stay subscribed and cleanup once it's gone.
		defer cleanup(fmt.Errorf("backend error or gone"))
		defer streamCancel()
		for event := range ch {
			log.Printf("event service:%s name:%s %#v", sres.ServiceSpawnResolution.ServiceName, sres.Name, event)
			if event.Error() != nil || event.IsGone() {
				break
			}
		}
	}()

	return &Provisioning{Target: parsed, Fresh: true, Cleanup: cleanup}, nil
}
