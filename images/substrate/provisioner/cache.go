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

	FieldsExported []FieldsExported
	Spawner        Spawner
}

type FieldsExported interface {
	FieldsExported(asr *activityspec.ServiceSpawnRequest, fieldsExported ExportedFields)
}

func NewCache() *Cache {
	return &Cache{
		mu:      &sync.Mutex{},
		entries: map[string]*CachingSingleServiceProvisioner{},
	}
}

func (r *Cache) fieldsExported(asr *activityspec.ServiceSpawnRequest, fieldsExported ExportedFields) {
	for _, fn := range r.FieldsExported {
		fn.FieldsExported(asr, fieldsExported)
	}
}

func (r *Cache) Sample() map[string]*Sample {
	m := map[string]*Sample{}

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

type ServiceInstanceExports struct {
	Instances map[string]*InstanceExports `json:"instances"`
}

type InstanceExports struct {
	Exports ExportedFields `json:"exports"`
}

func (r *Cache) AllServiceExports() map[string]*ServiceInstanceExports {
	r.mu.Lock()
	defer r.mu.Unlock()

	m := map[string]*ServiceInstanceExports{}
	for k, v := range r.entries {
		sie := m[v.req.ServiceName]
		if sie == nil {
			sie = &ServiceInstanceExports{}
			sie.Instances = map[string]*InstanceExports{}
			m[v.req.ServiceName] = sie
		}
		exp := make(ExportedFields, len(v.exportedFields))
		for ek, ev := range exp {
			exp[ek] = ev
		}
		sie.Instances[k] = &InstanceExports{
			Exports: exp,
		}
	}
	return m
}

func (r *Cache) UpdateExports(ctx context.Context, asr *activityspec.ServiceSpawnRequest, digest string, cb func(f ExportedFields) ExportedFields) error {
	log.Printf("UpdateExports...")
	defer log.Printf("UpdateExports... done")

	requestCacheKey, concrete := asr.Format()
	if !concrete {
		return fmt.Errorf("viewspec must be concrete")
	}

	r.mu.Lock()
	entry := r.entries[requestCacheKey]
	r.mu.Unlock()
	if entry == nil {
		return fmt.Errorf("no active entry: %s", requestCacheKey)
	}

	return entry.UpdateExports(ctx, digest, cb)
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
		entry = NewCachingSingleServiceProvisioner(r.Spawner, asr, func(f ExportedFields) { r.fieldsExported(asr, f) })
		r.entries[requestCacheKey] = entry
		// TODO need to handle service provisioners that go away and can be removed from the map.
	}
	r.mu.Unlock()

	entry.LogRequest(rq)

	provisioningReverseProxy(entry.Ensure, 2, nil, rw, rq)
}
