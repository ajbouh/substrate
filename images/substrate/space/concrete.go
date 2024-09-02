package space

import (
	"strings"

	"github.com/ajbouh/substrate/images/substrate/activityspec"
)

func (p *SpacesViaContainerFilesystems) IsSpaceViewConcrete(v string, t activityspec.ServiceSpawnParameterType) bool {
	switch t {
	case activityspec.ServiceSpawnParameterTypeSpace:
		return v != "" && !strings.HasPrefix(string(v), spaceViewForkPrefix)
	case activityspec.ServiceSpawnParameterTypeSpaces:
		for _, s := range strings.Split(v, activityspec.SpaceViewMultiSep) {
			if string(s) == "" || strings.HasPrefix(string(s), spaceViewForkPrefix) {
				return false
			}
		}
	}

	return true
}
