package commands

import (
	"net/url"
	"strings"
)

func resolveURLWithEnv(env Env, urlStr string) (string, error) {
	if !(strings.HasPrefix(urlStr, "http:") || strings.HasPrefix(urlStr, "https:")) {
		// look up baseurl in env
		baseurlMsg, err := env.Apply(nil, Fields{
			"cap": "read-urlbase",
		})
		if err != nil {
			return "", err
		}
		urlbase, err := Get[string](baseurlMsg, "urlbase")
		if err != nil {
			return "", err
		}
		if urlbase != "" {
			base, err := url.Parse(urlbase)
			if err != nil {
				return "", err
			}

			u, err := url.Parse(urlStr)
			if err != nil {
				return "", err
			}

			urlStr = base.ResolveReference(u).String()
		}
	}

	return urlStr, nil
}
