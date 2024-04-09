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

// lock, loop over existing funcs, clean up now-stale ones.
func (r *Cache) Refresh(ctx context.Context) {
	r.mu.Lock()

	entries := make([]*CachingSingleServiceProvisioner, 0, len(r.entries))

	// todo loop over existing funcs, clean up now-stale ones.
	for _, v := range r.entries {
		entries = append(entries, v)
	}
	r.mu.Unlock()

	for _, entry := range entries {
		_, err := entry.Refresh(ctx)
		if err != nil {
			log.Printf("error during refresh: %s", err)
		}
	}
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
