package substratehttp

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"slices"
	"sync"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
	"github.com/ajbouh/substrate/images/substrate/provisioner"
)

func getStats(ctx context.Context, h http.Handler, url string) (any, error) {
	req := httptest.NewRequest("GET", url, nil)
	req = req.WithContext(ctx)
	req.Header.Set("Accept", "application/json")

	rec := httptest.NewRecorder()

	h.ServeHTTP(rec, req)
	if rec.Code != 200 {
		return nil, fmt.Errorf(
			"received a %d error in http response for: %s; body=%s", rec.Code, req.URL, rec.Body.String())
	}

	var v any
	err := json.NewDecoder(rec.Body).Decode(&v)

	if err != nil {
		return nil, err
	}

	return v, nil
}

func sampleServicesWithStats(ctx context.Context, h http.Handler, c *provisioner.Cache, statsServices []string) (map[string]*activityspec.ServiceSpawnResponse, map[string]any, error) {
	var wg sync.WaitGroup
	results := make([]any, len(statsServices))
	errs := make([]error, len(statsServices))
	for i, statsService := range statsServices {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			results[i], errs[i] = getStats(ctx, h, "/"+statsService+"/")
		}(i)
		wg.Wait()
	}

	stats := c.Sample()
	v := map[string]any{}
	for i, r := range results {
		v[statsServices[i]] = r
	}

	errs = slices.DeleteFunc(errs, func(err error) bool { return err == nil })
	if len(errs) > 0 {
		return stats, v, errors.Join(errs...)
	}

	return stats, v, nil
}
