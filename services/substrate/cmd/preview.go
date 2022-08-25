package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/julienschmidt/httprouter"

	"github.com/ajbouh/substrate/pkg/auth"
	"github.com/ajbouh/substrate/services/substrate"
)

func newPreviewHandler(s *substrate.Substrate, gw *substrate.Gateway) func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
	consider := func(ctx context.Context, preview *substrate.ResolvedLensActivity, previewActivityName string) (*substrate.ResolvedLensActivity, bool, error) {
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
		activityspec *substrate.ActivitySpecRequest,
		preview *substrate.ResolvedLensActivity,
		lensName string,
	) {
		user, ok := auth.UserFromContext(req.Context())
		if !ok {
			jsonrw := newJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, fmt.Errorf("user not available in context"))
			return
		}

		cacheKey, concrete := activityspec.ActivitySpec()
		if !concrete {
			jsonrw := newJSONResponseWriter(rw)
			jsonrw(nil, http.StatusBadRequest, fmt.Errorf("activityspec must be concrete"))
			return
		}

		if preview == nil {
			newJSONResponseWriter(rw)(nil, http.StatusInternalServerError, fmt.Errorf("could not resolve preview activity for: %s", cacheKey))
			return
		}

		gw.ProvisionRedirector(cacheKey, func() substrate.ProvisionFunc {
			return s.MakeProvisioner(func(fmt string, values ...any) {
				log.Printf(fmt+" cacheKey=%s", append(values, cacheKey)...)
			}, &substrate.SpawnRequest{
				User:         user.GithubUsername,
				ActivitySpec: *activityspec,
				Ephemeral:    true,
			})
		}, func(targetFunc substrate.AuthenticatedURLJoinerFunc) (int, string, error) {
			var previewPathSuffix string
			if preview.Activity.Request != nil && preview.Activity.Request.Path != "" {
				previewPathSuffix += "/" + strings.TrimPrefix(preview.Activity.Request.Path, "/")
			}

			if lensName != "" {
				previewLens, err := s.ResolveLens(req.Context(), lensName)
				if err != nil {
					return http.StatusInternalServerError, "", err
				}
				if previewLens == nil {
					return http.StatusInternalServerError, "", fmt.Errorf("could not resolve lens")
				}

				if previewLens.Space.Preview != "" {
					previewPathSuffix = strings.TrimSuffix(previewPathSuffix, "/")
					previewPathSuffix += "/" + strings.TrimPrefix(previewLens.Space.Preview, "/")
				}
			}

			previewSuffixURL, _ := url.Parse(previewPathSuffix)

			target, _ := targetFunc(previewSuffixURL, substrate.ProvisionerCookieAuthenticationMode)

			// fmt.Printf("oldtarget=%s\n", target)
			// target.Path, target.RawPath = substrate.JoinURLPath(target, previewSuffixURL)
			fmt.Printf("newtarget=%s\n", target)

			return http.StatusFound, target.String(), nil
		}).ServeHTTP(rw, req)
	}

	router := httprouter.New()

	router.Handle("GET", "/preview/activity/*activityspec", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		var err error

		// look up space
		activity := strings.TrimPrefix(p.ByName("activityspec"), "/")

		activityspec, err := substrate.ParseActivitySpecRequest(activity, true)
		if err != nil {
			newJSONResponseWriter(rw)(nil, http.StatusBadRequest, err)
			return
		}

		// look up preview activity
		previewActivityName := "system:preview:activity:" + activityspec.LensName
		preview, _, err := consider(req.Context(), nil, previewActivityName)
		if err != nil {
			newJSONResponseWriter(rw)(nil, http.StatusInternalServerError, err)
			return
		}

		lensName := activityspec.LensName
		if preview == nil {
			preview, _, err = consider(req.Context(), nil, activity)
			if err != nil {
				newJSONResponseWriter(rw)(nil, http.StatusInternalServerError, err)
				return
			}
		} else {
			activityspec.LensName = preview.LensName
		}

		// fmt.Printf("activityspec=%s lensName=%s previewActivityName=%s\n", activityForDebug, lensName, previewActivityName)
		f(rw, req, activityspec, preview, lensName)
	})

	router.Handle("GET", "/preview/space/:space", func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		// look up space
		w := p.ByName("space")

		var preview *substrate.ResolvedLensActivity

		activityspecString := "[" + w + "]"
		activityspec, err := substrate.ParseActivitySpecRequest(activityspecString, true)
		if err != nil {
			newJSONResponseWriter(rw)(nil, http.StatusInternalServerError, err)
			return
		}

		preview, _, err = consider(req.Context(), nil, "system:preview:space")
		if err != nil {
			newJSONResponseWriter(rw)(nil, http.StatusInternalServerError, err)
			return
		}




		// TODO sort by priority

		activityspec.LensName = preview.LensName

		f(rw, req, activityspec, preview, "")
	})

	return func(rw http.ResponseWriter, req *http.Request, p httprouter.Params) {
		router.ServeHTTP(rw, req)
	}
}
