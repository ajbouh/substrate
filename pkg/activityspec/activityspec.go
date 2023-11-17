package activityspec

import (
	"fmt"
	"net/http"
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

const ProvisionerHeaderAuthenticationMode ProvisionerAuthenticationMode = "header"
const ProvisionerCookieAuthenticationMode ProvisionerAuthenticationMode = "cookie"

type AuthenticatedURLJoinerFunc func(u *url.URL, mode ProvisionerAuthenticationMode) (*url.URL, http.Header)

type ActivitySpawnResponse struct {
	ActivitySpec string

	Path    string
	PathURL *url.URL

	ServiceSpawnResponse ServiceSpawnResponse
}

func (s *ActivitySpawnResponse) URL(mode ProvisionerAuthenticationMode) (*url.URL, http.Header) {
	return s.ServiceSpawnResponse.URLJoiner(s.PathURL, mode)
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

func ParseActivitySpecRequest(spec string, forceReadOnly bool) (*ActivitySpecRequest, error) {
	ssr, path, err := ParseServiceSpawnRequest(spec, forceReadOnly)
	if err != nil {
		return nil, err
	}

	r := &ActivitySpecRequest{
		ServiceSpawnRequest: *ssr,
		Path:                path,
	}

	fmt.Printf("ParseActivitySpecRequest %q %#v\n", spec, *r)

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
