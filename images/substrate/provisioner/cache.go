package provisioner

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

type Cache struct {
	entries *OnceMap[*CachingSingleServiceProvisioner]

	ctx context.Context

	Spawner Spawner

	Log *slog.Logger
}

func (r *Cache) Initialize() {
	r.entries = NewOnceMap[*CachingSingleServiceProvisioner]()
}

func (r *Cache) Serve(ctx context.Context) {
	r.ctx = ctx
}

func (r *Cache) Sample() map[string]*Sample {
	m := map[string]*Sample{}

	keys := make([]string, 0, r.entries.Size())
	cached := make([]*CachingSingleServiceProvisioner, 0, len(keys))
	r.entries.Range(func(k string, v *CachingSingleServiceProvisioner) bool {
		keys = append(keys, k)
		cached = append(cached, v)
		return true
	})

	for i, k := range keys {
		v := cached[i]
		r := v.Peek()
		if r != nil {
			m[k] = r
		}
	}

	return m
}

func (r *Cache) QueryLinks(ctx context.Context, asr *activityspec.ServiceSpawnRequest) (links.Links, error) {
	// log.Printf("UpdateOutgoing...")
	// defer log.Printf("UpdateOutgoing... done")

	requestCacheKey, concrete := asr.CanonicalFormat, asr.SeemsConcrete
	if !concrete {
		return nil, fmt.Errorf("viewspec must be concrete")
	}

	entry, _ := r.entries.Load(requestCacheKey)
	if entry == nil {
		return nil, fmt.Errorf("no active entry: %s", requestCacheKey)
	}

	return entry.QueryLinks(ctx)
}

// lock, loop over existing funcs, clean up now-stale ones.
func (r *Cache) Refresh() {
	keys := make([]string, 0, r.entries.Size())
	entries := make([]*CachingSingleServiceProvisioner, 0, len(keys))

	// todo loop over existing funcs, clean up now-stale ones.
	r.entries.Range(func(k string, v *CachingSingleServiceProvisioner) bool {
		entries = append(entries, v)
		keys = append(keys, k)
		return true
	})

	for i, entry := range entries {
		pruned, gen, err := entry.PurgeIfChanged(r.ctx)
		if err != nil {
			log.Printf("error during refresh: %s", err)
		} else if pruned {
			was, _ := r.entries.LoadAndDelete(keys[i])
			if was == nil {
				log.Printf("already pruned %s", keys[i])
			} else {
				if was != entry || was.Generation() != gen {
					_, replaced := r.entries.LoadOrStore(keys[i], was)
					if replaced {
						log.Printf("pruned %s, took it out but it changed, so put it back", keys[i])
					} else {
						log.Printf("pruned %s, tried to put it back, but there was already something there.", keys[i])
					}
				} else {
					log.Printf("pruned %s", keys[i])
				}
			}

		}
	}
}

func (r *Cache) Ensure(ctx context.Context, asr *activityspec.ServiceSpawnRequest) (*CachingSingleServiceProvisioner, error) {
	requestCacheKey, concrete := asr.CanonicalFormat, asr.SeemsConcrete
	if !concrete {
		return nil, fmt.Errorf("viewspec must be concrete")
	}

	// slog.Info("Cache.Ensure()", "key", requestCacheKey, "instance", &r)
	// defer slog.Info("Cache.Ensure() done", "key", requestCacheKey, "instance", &r)

	// since we might be racing another request, we must .finishEnsure *after* LoadOrCompute, but only if we created it.
	return r.entries.LoadOrCompute(requestCacheKey, func() (*CachingSingleServiceProvisioner, error) {
		cssp := &CachingSingleServiceProvisioner{
			Key:                 requestCacheKey,
			Spawner:             r.Spawner,
			ServiceSpawnRequest: asr,
			Log:                 r.Log,
		}
		cssp.Initialize()
		_, err := cssp.Ensure(ctx)
		return cssp, err
	})
}

func (r *Cache) ServeProxiedHTTP(asr *activityspec.ServiceSpawnRequest, rw http.ResponseWriter, rq *http.Request) {
	// slog.Info("Cache.ServeProxiedHTTP()", "key", asr.CanonicalFormat, "instance", &r)
	// defer slog.Info("Cache.ServeProxiedHTTP() done", "key", asr.CanonicalFormat, "instance", &r)

	entry, err := r.Ensure(rq.Context(), asr)
	if err != nil {
		newDoomedHandler(http.StatusBadRequest, err, rw)
		return
	}

	entry.LogRequest(rq)

	provisioningReverseProxy(entry.Ensure, 2, nil, rw, rq)
}
