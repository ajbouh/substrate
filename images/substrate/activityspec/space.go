package activityspec

import "strings"

type SpaceViewRequest struct {
	SpaceAlias              *string `json:"space_alias,omitempty"`
	SpaceID                 string  `json:"space,omitempty" form:"space,omitempty"`
	SpaceBaseRef            *string `json:"space_base_ref,omitempty" form:"space_base_ref,omitempty"`
	ReadOnly                bool    `json:"read_only,omitempty" form:"read_only,omitempty"`
	CheckpointExistingFirst bool    `json:"checkpoint_existing_first,omitempty" form:"checkpoint_existing_first,omitempty"`
}

const spaceViewForkPrefix = "~"
const spaceViewAliasPrefix = "$"

// const spaceViewPlaceholder = "^"

func ParseViewRequest(v string, forceReadOnly bool) *SpaceViewRequest {
	readOnly := false
	if strings.HasSuffix(v, ":ro") {
		v = strings.TrimSuffix(v, ":ro")
		readOnly = true
	}
	readOnly = forceReadOnly
	if strings.HasPrefix(v, spaceViewForkPrefix) {
		baseRef := strings.TrimPrefix(v, spaceViewForkPrefix)
		return &SpaceViewRequest{
			SpaceBaseRef: &baseRef,
			ReadOnly:     readOnly,
		}
	}
	if strings.HasPrefix(v, spaceViewAliasPrefix) {
		alias := strings.TrimPrefix(v, spaceViewAliasPrefix)
		return &SpaceViewRequest{
			SpaceAlias: &alias,
			ReadOnly:   readOnly,
		}
	}

	return &SpaceViewRequest{
		SpaceID:  v,
		ReadOnly: readOnly,
	}
}

func (r *SpaceViewRequest) Spec() string {
	suffix := ""
	if r.ReadOnly {
		suffix = ":ro"
	}
	if r.SpaceBaseRef != nil {
		return spaceViewForkPrefix + *r.SpaceBaseRef + suffix
	}
	if r.SpaceAlias != nil {
		return spaceViewAliasPrefix + *r.SpaceAlias + suffix
	}

	return r.SpaceID + suffix
}
