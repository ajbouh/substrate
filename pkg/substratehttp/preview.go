package substratehttp

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/julienschmidt/httprouter"

	"github.com/ajbouh/substrate/pkg/activityspec"
	"github.com/ajbouh/substrate/pkg/auth"
	"github.com/ajbouh/substrate/pkg/httputil"
	"github.com/ajbouh/substrate/pkg/substrate"
)

func newPreviewHandler(s *substrate.Substrate) func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
	consider := func(ctx context.Context, preview *activityspec.ResolvedActivity, previewActivityName string) (*activityspec.ResolvedActivity, bool, error) {
		resolved, err := s.ResolveActivity(ctx, previewActivityName)
		if err != nil {
			return nil, false, err
		}

		updated := false
		for _, r := range resolved {
			if preview == nil || (preview.Activity.Priority == nil && r.Activity.Priority != nil) ||
				(preview.Activity.Priority != nil && r.Activity.Priority != nil && *preview.Activity.Priority < *r.Activity.Priority) {
				preview = r
				updated = true
			}
		}

		return preview, updated, nil
	}

	// redirect to /gw/:previewlens.name[:space]/:previewlens.path/:initiallens.preview
	f := func(
		rw http.ResponseWriter,
		req *http.Request,
		as *activityspec.ActivitySpecRequest,
		preview *activityspec.ResolvedActivity,
		lensName string,
	) {
		user, ok := auth.UserFromContext(req.Context())
		if !ok {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, fmt.Errorf("user not available in context"))
			return
		}

		cacheKey, concrete := as.ActivitySpec()
		if !concrete {
			jsonrw := httputil.NewJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, fmt.Errorf("activityspec must be concrete"))
			return
		}

		if preview == nil {
			httputil.NewJSONResponseWriter(rw)(nil, http.StatusInternalServerError, fmt.Errorf("could not resolve preview activity for: %s", cacheKey))
			return
		}

		as.User = user.GithubUsername
		as.Ephemeral = true
		as.ServiceSpawnRequest.User = user.GithubUsername
		as.ServiceSpawnRequest.Ephemeral = true

		s.ProvisionRedirector(&as.ServiceSpawnRequest, func(targetFunc activityspec.AuthenticatedURLJoinerFunc) (int, string, error) {
			var previewPathSuffix string
			if preview.Activity.Request != nil && preview.Activity.Request.Path != "" {
				previewPathSuffix += "/" + strings.TrimPrefix(preview.Activity.Request.Path, "/")
			}

			if lensName != "" {
				previewService, err := s.ResolveService(req.Context(), lensName)
				if err != nil {
					return http.StatusInternalServerError, "", err
				}
				if previewService == nil {
					return http.StatusInternalServerError, "", fmt.Errorf("could not resolve lens")
				}

				// if previewService.Space.Preview != "" {
				// 	previewPathSuffix = strings.TrimSuffix(previewPathSuffix, "/")
				// 	previewPathSuffix += "/" + strings.TrimPrefix(previewService.Space.Preview, "/")
				// }
			}

			previewSuffixURL, _ := url.Parse(previewPathSuffix)

			target, _ := targetFunc(previewSuffixURL, activityspec.ProvisionerCookieAuthenticationMode)

			fmt.Printf("newtarget=%s\n", target)

			return http.StatusFound, target.String(), nil
		}).ServeHTTP(rw, req)
	}

	router := httprouter.New()

	router.Handle("GET", "/preview/activity/*activityspec", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		var err error

		// look up space
		activity := strings.TrimPrefix(p.ByName("activityspec"), "/")

		activityspec, err := activityspec.ParseActivitySpecRequest(activity, true)
		if err != nil {
			httputil.NewJSONResponseWriter(rw)(nil, http.StatusBadRequest, err)
			return
		}

		// look up preview activity
		previewActivityName := "system:preview:activity:" + activityspec.ServiceSpawnRequest.ServiceName
		preview, _, err := consider(req.Context(), nil, previewActivityName)
		if err != nil {
			httputil.NewJSONResponseWriter(rw)(nil, http.StatusInternalServerError, err)
			return
		}

		lensName := activityspec.ServiceSpawnRequest.ServiceName
		if preview == nil {
			preview, _, err = consider(req.Context(), nil, activity)
			if err != nil {
				httputil.NewJSONResponseWriter(rw)(nil, http.StatusInternalServerError, err)
				return
			}
		} else {
			activityspec.ServiceSpawnRequest.ServiceName = preview.ServiceName
		}

		// fmt.Printf("activityspec=%s lensName=%s previewActivityName=%s\n", activityForDebug, lensName, previewActivityName)
		f(rw, req, activityspec, preview, lensName)
	})

	router.Handle("GET", "/preview/space/:space", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		// look up space
		w := p.ByName("space")

		var preview *activityspec.ResolvedActivity

		activityspecString := "[" + w + "]"
		activityspec, err := activityspec.ParseActivitySpecRequest(activityspecString, true)
		if err != nil {
			httputil.NewJSONResponseWriter(rw)(nil, http.StatusInternalServerError, err)
			return
		}

		preview, _, err = consider(req.Context(), nil, "system:preview:space")
		if err != nil {
			httputil.NewJSONResponseWriter(rw)(nil, http.StatusInternalServerError, err)
			return
		}

		// TODO sort by priority

		activityspec.ServiceSpawnRequest.ServiceName = preview.ServiceName

		f(rw, req, activityspec, preview, "")
	})

	return func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		router.ServeHTTP(rw, req)
	}
}
