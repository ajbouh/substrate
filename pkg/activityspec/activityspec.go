package activityspec

import (
	"fmt"
	"net/http"
	"net/url"
	"sort"
	"strings"

	"github.com/ajbouh/substrate/pkg/substratefs"
)

type ServiceSpawnParameterType string

const ServiceSpawnParameterTypeString ServiceSpawnParameterType = "string"
const ServiceSpawnParameterTypeSpace ServiceSpawnParameterType = "space"
const ServiceSpawnParameterTypeSpaces ServiceSpawnParameterType = "spaces"

type ServiceSpawnParameterSchema struct {
	Type                    ServiceSpawnParameterType `json:"type"`
	EnvironmentVariableName *string                   `json:"environment_variable_name,omitempty"`
	Description             string                    `json:"description,omitempty"`
	Optional                bool                      `json:"optional,omitempty"`
}

type ServiceDefSpawnOptions struct {
	Image string `json:"image"`

	Schema map[string]ServiceSpawnParameterSchema `json:"schema,omitempty"`
	Env    map[string]string                      `json:"env,omitempty"`
}

type ServiceDefSpaceOptions struct {
	Preview string `json:"preview,omitempty"`
}

type ActivityDefResponse struct {
	Schema map[string]any `json:"schema,omitempty"`
}

type ActivityDefRequest struct {
	Path        string `json:"path"`
	Method      string `json:"method,omitempty"`
	Interactive bool   `json:"interactive,omitempty"`

	Schema map[string]any `json:"schema,omitempty"`
}

type ActivityDef struct {
	Activity    string               `json:"activity"`
	After       *[]string            `json:"after,omitempty"`
	Label       *string              `json:"label,omitempty"`
	Description *string              `json:"description,omitempty"`
	Image       *string              `json:"image,omitempty"`
	Priority    *int                 `json:"priority,omitempty"`
	Request     *ActivityDefRequest  `json:"request,omitempty"`
	Response    *ActivityDefResponse `json:"response,omitempty"`
}

type ServiceDef struct {
	Name       string                 `json:"name"`
	Spawn      ServiceDefSpawnOptions `json:"spawn"`
	Space      ServiceDefSpaceOptions `json:"space"`
	Activities map[string]ActivityDef `json:"activities"`
}

type ResolvedActivity struct {
	ServiceName string
	Service     *ServiceDef
	Activity    *ActivityDef
}

type ProvisionerAuthenticationMode string

const ProvisionerHeaderAuthenticationMode ProvisionerAuthenticationMode = "header"
const ProvisionerCookieAuthenticationMode ProvisionerAuthenticationMode = "cookie"

type AuthenticatedURLJoinerFunc func(u *url.URL, mode ProvisionerAuthenticationMode) (*url.URL, http.Header)

type ActivitySpawnResponse struct {
	Name         string
	ActivitySpec string

	BackendURL  string
	Path        string
	BearerToken *string

	URLJoiner AuthenticatedURLJoinerFunc
	PathURL   *url.URL
}

func (s *ActivitySpawnResponse) URL(mode ProvisionerAuthenticationMode) (*url.URL, http.Header) {
	return s.URLJoiner(s.PathURL, mode)
}

type ServiceSpawnParameterRequest string

func (v ServiceSpawnParameterRequest) String() string {
	return string(v)
}

func (v ServiceSpawnParameterRequest) Space(forceReadOnly bool) *SpaceViewRequest {
	return ParseViewRequest(string(v), forceReadOnly)
}

func (v ServiceSpawnParameterRequest) Spaces(forceReadOnly bool) []SpaceViewRequest {
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

type ServiceSpawnParameterRequests map[string]ServiceSpawnParameterRequest

type ActivitySpecRequest struct {
	ServiceName string
	Parameters  ServiceSpawnParameterRequests
	Path        string

	User          string
	Ephemeral     bool
	ForceReadOnly bool
}

type ServiceSpawnParameter struct {
	EnvVars map[string]string
	Space   *substratefs.SpaceView
	Spaces  *[]substratefs.SpaceView
}

type ServiceSpawnParameters map[string]*ServiceSpawnParameter

type ActivitySchema struct {
	Spawn map[string]ServiceSpawnParameterSchema `json:"spawn"`
}

type ActivitySpec struct {
	ServiceName string                 `json:"lens"`
	Parameters  ServiceSpawnParameters `json:"parameters"`
	Schema      ActivitySchema         `json:"schema"`
	Path        string                 `json:"path"`

	Image              string `json:"-"`
	GracePeriodSeconds *int   `json:"grace_period_seconds,omitempty"`
}

const spaceViewCut = "="
const spaceViewsSep = ";"
const spaceViewMultiSep = ","
const viewspecParameterStart = "["
const viewspecParameterEnd = "]"

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

	params := ServiceSpawnParameterRequests{}
	if viewspec != "" {
		for _, fragment := range strings.Split(viewspec, spaceViewsSep) {
			k, v, ok := strings.Cut(fragment, spaceViewCut)
			if !ok {
				v = k
				k = "data"
			}
			params[k] = ServiceSpawnParameterRequest(v)
		}
	}

	r := &ActivitySpecRequest{
		ServiceName: lens,
		Parameters:  params,
		Path:        path,
	}

	fmt.Printf("ParseActivitySpecRequest %q %#v\n", spec, *r)

	return r, nil
}

func (r *ActivitySpecRequest) ActivitySpec() (string, bool) {
	concrete := r.ServiceName != ""

	fragments := []string{}
	params := r.Parameters
	for k := range r.Parameters {
		if k == "" {
			continue
		}
		// TODO consider canonicalizing spaces order...
		fragments = append(fragments, k+spaceViewCut+params[k].String())
	}
	// Canonicalize mount order
	sort.Strings(fragments)

	viewspec := strings.Join(fragments, spaceViewsSep)
	fmt.Printf("ActivitySpec() viewspec=%q fragments=%#v r=%#v\n", viewspec, fragments, r)

	return r.ServiceName + viewspecParameterStart + viewspec + viewspecParameterEnd + r.Path, concrete
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
		if k == "" {
			continue
		}
		switch {
		case v.EnvVars != nil:
			for ek, ev := range v.EnvVars {
				spaceFragments = append(spaceFragments, k+spaceViewCut+ev)
				// TODO we only really support a single env var for each parameter...
				_ = ek
				break
			}
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

	return r.ServiceName + viewspecParameterStart + viewspec + viewspecParameterEnd + r.Path, r.ServiceName != ""
}
