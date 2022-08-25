package substrate

import (
	"fmt"
	"sort"
	"strings"

	"github.com/ajbouh/substrate/pkg/substratefs"
)

type SpaceViewRequest struct {
	SpaceID                 string  `json:"space,omitempty" form:"space,omitempty"`
	SpaceBaseRef            *string `json:"space_base_ref,omitempty" form:"space_base_ref,omitempty"`
	ReadOnly                bool    `json:"read_only,omitempty" form:"read_only,omitempty"`
	CheckpointExistingFirst bool    `json:"checkpoint_existing_first,omitempty" form:"checkpoint_existing_first,omitempty"`
}

type LensSpawnParameterRequest string

func (v LensSpawnParameterRequest) String() string {
	return string(v)
}

func (v LensSpawnParameterRequest) Space(forceReadOnly bool) *SpaceViewRequest {
	return ParseViewRequest(string(v), forceReadOnly)
}

func (v LensSpawnParameterRequest) Spaces(forceReadOnly bool) []SpaceViewRequest {
	split := strings.Split(string(v), spaceViewMultiSep)
	multi := []SpaceViewRequest{}
	for _, m := range split {
		if m == "" {
			continue
		}
		multi = append(multi, *ParseViewRequest(m, forceReadOnly))
	}

	return multi
}

type LensSpawnParameterRequests map[string]LensSpawnParameterRequest

type ActivitySpecRequest struct {
	LensName   string
	Parameters LensSpawnParameterRequests
	Path       string
}

type LensSpawnParameter struct {
	String *string
	Space  *substratefs.SpaceView
	Spaces *[]substratefs.SpaceView
}

type LensSpawnParameters map[string]*LensSpawnParameter

type ActivitySchema struct {
	Spawn map[string]LensSpawnParameterSchema `json:"spawn"`
}

type ActivitySpec struct {
	LensName   string              `json:"lens"`
	Parameters LensSpawnParameters `json:"parameters"`
	Schema     ActivitySchema      `json:"schema"`
	Path       string              `json:"path"`
}

const spaceViewCut = "="
const spaceViewsSep = ";"
const spaceViewMultiSep = ","
const spaceViewForkPrefix = "~"
const viewspecParameterStart = "["
const viewspecParameterEnd = "]"

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

	return r.SpaceID + suffix
}

func ParseActivitySpecRequest(spec string, forceReadOnly bool) (*ActivitySpecRequest, error) {
	var lens string
	var viewspec string
	var path string
	if strings.HasPrefix(spec, viewspecParameterStart) { // lens is unknown!
		viewspec = strings.TrimPrefix(spec, viewspecParameterStart)
		if !strings.HasSuffix(viewspec, viewspecParameterEnd) {
			split := strings.SplitN(viewspec, "/", 2)
			if len(split) > 1 && !strings.HasSuffix(split[0], viewspecParameterEnd) {
				return nil, fmt.Errorf("bad spec: %q; viewspec=%q split=%#v", spec, viewspec, split)
			}

			viewspec = split[0]
			path = "/" + split[1]
		}
		viewspec = strings.TrimSuffix(viewspec, viewspecParameterEnd)
	} else {
		var found bool
		lens, viewspec, found = strings.Cut(spec, viewspecParameterStart)
		if found {
			if !strings.HasSuffix(viewspec, viewspecParameterEnd) {
				split := strings.SplitN(viewspec, "/", 2)
				if len(split) > 1 && !strings.HasSuffix(split[0], viewspecParameterEnd) {
					return nil, fmt.Errorf("bad spec: %q; viewspec=%q split=%#v", spec, viewspec, split)
				}

				viewspec = split[0]
				path = "/" + split[1]
			}
			viewspec = strings.TrimSuffix(viewspec, viewspecParameterEnd)
		}
	}

	params := LensSpawnParameterRequests{}
	if viewspec != "" {
		for _, fragment := range strings.Split(viewspec, spaceViewsSep) {
			k, v, ok := strings.Cut(fragment, spaceViewCut)
			if !ok {
				v = k
				k = "data"
			}
			params[k] = LensSpawnParameterRequest(v)
		}
	}

	r := &ActivitySpecRequest{
		LensName:   lens,
		Parameters: params,
		Path:       path,
	}

	fmt.Printf("ParseActivitySpecRequest %q %#v\n", spec, *r)

	return r, nil
}

func (r *ActivitySpecRequest) ActivitySpec() (string, bool) {
	concrete := r.LensName != ""

	fragments := []string{}
	for k, v := range r.Parameters {
		// TODO consider canonicalizing spaces order...
		fragments = append(fragments, k+spaceViewCut+v.String())
	}
	// Canonicalize mount order
	sort.Strings(fragments)

	viewspec := strings.Join(fragments, spaceViewsSep)
	fmt.Printf("ActivitySpec() viewspec=%s r=%#v\n", viewspec, r)

	return r.LensName + viewspecParameterStart + viewspec + viewspecParameterEnd + r.Path, concrete
}

func (r ActivitySpec) ActivitySpec() (string, bool) {
	spec := func(v *substratefs.SpaceView) string {
		suffix := ""
		if v.IsReadOnly {
			suffix = ":ro"
		}
		return v.Tip.String() + suffix
	}
	spaceFragments := []string{}
	for k, v := range r.Parameters {
		switch {
		case v.String != nil:
			spaceFragments = append(spaceFragments, k+spaceViewCut+*v.String)
		case v.Space != nil:
			space := v.Space
			spaceFragments = append(spaceFragments, k+spaceViewCut+spec(space))
		case v.Spaces != nil:
			multi := []string{""} // an initial empty value to say this is a "multi"
			for _, m := range *v.Spaces {
				multi = append(multi, spec(&m))
			}
			// Canonicalize multi order
			sort.Strings(multi)
			spaceFragments = append(spaceFragments, k+"="+strings.Join(multi, spaceViewMultiSep))
		}
	}
	// Canonicalize mount order
	sort.Strings(spaceFragments)

	viewspec := strings.Join(spaceFragments, spaceViewsSep)
	fmt.Printf("ActivitySpec() viewspec=%s r=%#v\n", viewspec, r)

	return r.LensName + viewspecParameterStart + viewspec + viewspecParameterEnd + r.Path, r.LensName != ""
}
