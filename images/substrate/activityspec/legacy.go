package activityspec

import (
	"fmt"
	"strings"
)

const spaceViewCutLegacy = "="
const spaceViewsSepLegacy = ";"
const spaceViewMultiSepLegacy = ","
const viewspecParameterStartLegacy = "("
const viewspecParameterEndLegacy = ")"

func IsLegacyServiceSpawnRequestFormat(spec string) bool {
	return strings.Contains(spec, viewspecParameterStartLegacy)
}

func ParseLegacyServiceSpawnRequest(spec string, forceReadOnly bool, spawnPrefix string) (*ServiceSpawnRequest, string, error) {
	var service string
	var viewspec string
	var path string
	if strings.HasPrefix(spec, viewspecParameterStartLegacy) { // service is unknown!
		viewspec = strings.TrimPrefix(spec, viewspecParameterStartLegacy)
		if !strings.HasSuffix(viewspec, viewspecParameterEndLegacy) {
			split := strings.SplitN(viewspec, "/", 1)
			if len(split) > 1 && !strings.HasSuffix(split[0], viewspecParameterEndLegacy) {
				return nil, "", fmt.Errorf("bad spec: %q; viewspec=%q split=%#v", spec, viewspec, split)
			}

			viewspec = split[0]
			path = "/" + split[1]
		}
		viewspec = strings.TrimSuffix(viewspec, viewspecParameterEndLegacy)
	} else {
		var found bool
		service, viewspec, found = strings.Cut(spec, viewspecParameterStartLegacy)
		if found {
			if !strings.HasSuffix(viewspec, viewspecParameterEndLegacy) {
				viewspec, path, found = strings.Cut(viewspec, "/")
				if found && !strings.HasSuffix(viewspec, viewspecParameterEndLegacy) {
					return nil, "", fmt.Errorf("bad spec: %q; viewspec=%q path=%#v", spec, viewspec, path)
				}

				path = "/" + path
			}
			viewspec = strings.TrimSuffix(viewspec, viewspecParameterEndLegacy)
		}
	}

	params := ServiceSpawnParameterRequests{}
	if viewspec != "" {
		for _, fragment := range strings.Split(viewspec, spaceViewsSepLegacy) {
			k, v, ok := strings.Cut(fragment, spaceViewCutLegacy)
			if !ok {
				v = k
				k = "data"
			}
			params[k] = ServiceSpawnParameterRequest(v)
		}
	}

	r := &ServiceSpawnRequest{
		ServiceName: service,
		Parameters:  params,
		URLPrefix:   spawnPrefix,
	}

	fmt.Printf("ParseServiceSpawnRequest %q servicename=%s path=%s %#v\n", spec, service, path, *r)

	return r, path, nil
}
