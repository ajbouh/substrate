package provisioner

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
)

type Cache struct {
	mu      *sync.Mutex
	entries map[string]*CachingSingleServiceProvisioner

	Spawner Spawner
}

func NewCache() *Cache {
	return &Cache{
		mu:      &sync.Mutex{},
		entries: map[string]*CachingSingleServiceProvisioner{},
	}
}

func (r *Cache) Sample() map[string]*activityspec.ServiceSpawnResponse {
	m := map[string]*activityspec.ServiceSpawnResponse{}

	keys := make([]string, 0, len(r.entries))
	cached := make([]*CachingSingleServiceProvisioner, 0, len(r.entries))
	r.mu.Lock()
	for k, v := range r.entries {
		keys = append(keys, k)
		cached = append(cached, v)
	}
	r.mu.Unlock()

	for i, k := range keys {
		v := cached[i]
		r := v.Peek()
		if r != nil {
			m[k] = r
		}
	}

	return m
}

// lock, loop over existing funcs, clean up now-stale ones.
func (r *Cache) Refresh(ctx context.Context) {
	r.mu.Lock()

	keys := make([]string, 0, len(r.entries))
	entries := make([]*CachingSingleServiceProvisioner, 0, len(r.entries))

	// todo loop over existing funcs, clean up now-stale ones.
	for k, v := range r.entries {
		entries = append(entries, v)
		keys = append(keys, k)
	}
	r.mu.Unlock()

	remove := map[string]int{}
	for i, entry := range entries {
		pruned, gen, err := entry.PurgeIfChanged(ctx)
		if err != nil {
			log.Printf("error during refresh: %s", err)
		} else if pruned {
			remove[keys[i]] = gen
		}
	}

	r.mu.Lock()
	for k, gen := range remove {
		log.Printf("removing entry %s", k)
		entry := r.entries[k]
		if entry != nil && entry.Generation() == gen {
			delete(r.entries, k)
		}
	}
	r.mu.Unlock()
}

func (r *Cache) ServeProxiedHTTP(asr *activityspec.ServiceSpawnRequest, rw http.ResponseWriter, rq *http.Request) {
	requestCacheKey, concrete := asr.Format()
	if !concrete {
		newDoomedHandler(http.StatusBadRequest, fmt.Errorf("viewspec must be concrete"), rw)
		return
	}

	r.mu.Lock()
	entry := r.entries[requestCacheKey]
	if entry == nil {
		entry = NewCachingSingleServiceProvisioner(r.Spawner, asr)
		r.entries[requestCacheKey] = entry
		// TODO need to handle service provisioners that go away and can be removed from the map.
	}
	r.mu.Unlock()

	provisioningReverseProxy(entry.Ensure, 2, nil, rw, rq)
}
