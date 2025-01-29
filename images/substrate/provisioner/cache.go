package provisioner

import (
	"context"
	"errors"
	"fmt"
	"log"
	"log/slog"
	"net/http"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/links"
)

type Cache struct {
	mux *httpframework.PathSingletonMux[*CachingSingleServiceProvisioner]

	ctx context.Context

	Spawner                 Spawner
	ServiceResolver         ServiceResolver
	InternalSubstrateOrigin string

	Log *slog.Logger
}

func (r *Cache) Initialize() {
	r.mux = &httpframework.PathSingletonMux[*CachingSingleServiceProvisioner]{
		RequestKey: func(r *http.Request) (string, context.Context, error) {
			ctx := context.Background()
			if r.Header.Get("Substrate-No-Cold-Start") != "" {
				ctx = httpframework.WithBespokeCacheMissHandler(ctx, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					w.WriteHeader(311)
				}))
			}
			return r.PathValue("viewspec"), ctx, nil
		},
		KeyHandler: func(ctx context.Context, k string) (*CachingSingleServiceProvisioner, error) {
			views, err := activityspec.ParseServiceSpawnRequest(k, false, "/"+urlPathEscape(k))
			if err != nil {
				return nil, err
			}
			if !views.SeemsConcrete {
				return nil, fmt.Errorf("viewspec must be concrete")
			}

			views.User = "user"

			cssp := &CachingSingleServiceProvisioner{
				Key:                     k,
				Spawner:                 r.Spawner,
				ServiceSpawnRequest:     views,
				ServiceResolver:         r.ServiceResolver,
				Log:                     r.Log,
				InternalSubstrateOrigin: r.InternalSubstrateOrigin,
			}
			cssp.Initialize()
			_, err = cssp.Ensure(ctx)
			if err != nil {
				var cre = new(ConcretizationRequiredError)
				if errors.As(err, &cre) {
					concretized, _ := cre.ServiceSpawnResolution.Format()
					return nil, &httpframework.ResolveError{
						Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
							rest := r.PathValue("rest")
							// Use http.StatusTemporaryRedirect so the request is replayed with the same method and payload.
							http.RedirectHandler("/"+concretized+"/"+rest, http.StatusTemporaryRedirect).ServeHTTP(w, r)
						}),
					}
				}
			}

			return cssp, err
		},
		Log: r.Log,
	}
	r.mux.Initialize()
}

func (r *Cache) ServeHTTP(rw http.ResponseWriter, rq *http.Request) {
	r.mux.ServeHTTP(rw, rq)
}

func (r *Cache) Serve(ctx context.Context) {
	r.ctx = ctx
}

func (r *Cache) Sample() map[string]*Sample {
	m := map[string]*Sample{}

	keys := make([]string, 0, r.mux.Size())
	cached := make([]*CachingSingleServiceProvisioner, 0, len(keys))
	r.mux.Range(func(k string, v *CachingSingleServiceProvisioner) bool {
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

	entry := r.mux.Peek(requestCacheKey)
	if entry == nil {
		return nil, fmt.Errorf("no active entry: %s", requestCacheKey)
	}

	return entry.QueryLinks(ctx)
}

// lock, loop over existing funcs, clean up now-stale ones.
func (r *Cache) Refresh() {
	keys := make([]string, 0, r.mux.Size())
	entries := make([]*CachingSingleServiceProvisioner, 0, len(keys))

	// todo loop over existing funcs, clean up now-stale ones.
	r.mux.Range(func(k string, v *CachingSingleServiceProvisioner) bool {
		entries = append(entries, v)
		keys = append(keys, k)
		return true
	})

	for i, entry := range entries {
		pruned, gen, err := entry.PurgeIfChanged(r.ctx)
		if err != nil {
			log.Printf("error during refresh: %s", err)
		} else if pruned {
			was := r.mux.Remove(keys[i])
			if was == nil {
				log.Printf("already pruned %s", keys[i])
			} else {
				if was != entry || was.Generation() != gen {
					_, replaced := r.mux.TryStore(keys[i], was)
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
