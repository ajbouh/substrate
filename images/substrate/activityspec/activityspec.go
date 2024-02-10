package activityspec

import (
	"net/url"
)

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

type ResolvedActivity struct {
	ServiceName string
	Service     *ServiceDef
	Activity    *ActivityDef
}

type ProvisionerAuthenticationMode string

type ActivitySpawnResponse struct {
	ActivitySpec string

	Path    string
	PathURL *url.URL

	ServiceSpawnResponse ServiceSpawnResponse
}

func (s *ActivitySpawnResponse) URL() (*url.URL, error) {
	u, err := url.Parse(s.ServiceSpawnResponse.BackendURL)
	if err != nil {
		return nil, err
	}

	return Join(u, s.PathURL), nil
}

type ActivitySpecRequest struct {
	ServiceSpawnRequest ServiceSpawnRequest

	Path string

	User      string
	Ephemeral bool
}

type ActivitySchema struct {
	Spawn map[string]ServiceSpawnParameterSchema `json:"spawn"`
}

type ActivitySpec struct {
	ServiceSpawnResolution ServiceSpawnResolution
	// ServiceSpawnRequest ServiceSpawnRequest

	Schema ActivitySchema `json:"schema"`
	Path   string         `json:"path"`
}

func ParseActivitySpecRequest(spec string, forceReadOnly bool, spawnPrefix string) (*ActivitySpecRequest, error) {
	ssr, path, err := ParseServiceSpawnRequest(spec, forceReadOnly, spawnPrefix)
	if err != nil {
		return nil, err
	}

	r := &ActivitySpecRequest{
		ServiceSpawnRequest: *ssr,
		Path:                path,
	}

	// fmt.Printf("ParseActivitySpecRequest %q %#v\n", spec, *r)

	return r, nil
}

func (r *ActivitySpecRequest) ActivitySpec() (string, bool) {
	spawn, concrete := r.ServiceSpawnRequest.Format()
	return spawn + r.Path, concrete
}

func (r ActivitySpec) ActivitySpec() (string, bool) {
	spawn, concrete := r.ServiceSpawnResolution.Format()
	return spawn + r.Path, concrete
}
