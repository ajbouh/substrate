package activityspec

import (
	"fmt"
	"net/http"
)

func provisioningRedirector(
	provision ProvisionFunc,
	redirector func(targetFunc AuthenticatedURLJoinerFunc) (int, string, error),
) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		targetFunc, fresh, cleanup, err := provision(req.Context())
		if err != nil {
			newBadGatewayHandler(err).ServeHTTP(rw, req)
			return
		}

		// TODO if !fresh issue a HEAD request to check that it's still valid.
		_ = fresh
		_ = cleanup

		status, location, err := redirector(targetFunc)
		if err != nil {
			newBadGatewayHandler(err).ServeHTTP(rw, req)
			return
		}

		rw.Header().Set("Location", location)
		rw.WriteHeader(status)
	})
}

func (r *ProvisionerCache) ProvisionRedirector(asr *ServiceSpawnRequest, redirector func(targetFunc AuthenticatedURLJoinerFunc) (int, string, error)) http.Handler {
	cacheKey, concrete := asr.Format()
	if !concrete {
		return newDoomedHandler(http.StatusBadRequest, fmt.Errorf("viewspec must be concrete"))
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	fn := r.provisionerFuncs[cacheKey]
	if fn == nil {
		fn = r.makeProvisionFunc(asr)
		r.provisionerFuncs[cacheKey] = fn
	}

	return provisioningRedirector(fn, redirector)
}
