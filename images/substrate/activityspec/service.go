package activityspec

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/url"
	"sort"
	"strings"
)

type ServiceSpawnRequest struct {
	ServiceName string
	Parameters  map[string]string

	URLPrefix     string
	User          string
	ForceReadOnly bool

	CanonicalFormat string
	SeemsConcrete   bool
}

type ServiceSpawnResolution struct {
	ServiceName string
	Parameters  ServiceSpawnParameters `json:"parameters"`

	ServiceInstanceDef ServiceInstanceDef `json:"spawn"`
}

func (r *ServiceSpawnResolution) Digest() string {
	d := sha256.New()
	err := json.NewEncoder(d).Encode(r)
	if err != nil {
		panic(fmt.Sprintf("could not calculate digest for %#v", r))
	}

	return hex.EncodeToString(d.Sum(nil))
}

type ServiceSpawnResponse struct {
	Name       string
	BackendURL string
	PID        int

	ServiceSpawnResolution ServiceSpawnResolution `json:"resolution"`
}

func (s *ServiceSpawnResponse) URL() (*url.URL, error) {
	return url.Parse(s.BackendURL)
}

type ServiceSpawnParameterType string

const ServiceSpawnParameterTypeString ServiceSpawnParameterType = "string"
const ServiceSpawnParameterTypeSpace ServiceSpawnParameterType = "space"
const ServiceSpawnParameterTypeSpaces ServiceSpawnParameterType = "spaces"

type ServiceSpawnParameterSchema struct {
	Type        ServiceSpawnParameterType `json:"type"`
	Value       string                    `json:"value,omitempty"`
	Description string                    `json:"description,omitempty"`
	Optional    bool                      `json:"optional,omitempty"`
}

type ServiceInstanceDef struct {
	Image        string                                  `json:"image"`
	Environment  map[string]string                       `json:"environment,omitempty"`
	Command      []string                                `json:"command,omitempty"`
	ResourceDirs map[string]string                       `json:"resourcedirs,omitempty"`
	Mounts       map[string]ServiceInstanceDefSpawnMount `json:"mounts,omitempty"`

	URLPrefix string `json:"url_prefix,omitempty"`

	Ephemeral  bool `json:"ephemeral,omitempty"`
	Privileged bool `json:"privileged,omitempty"`
	Init       bool `json:"init,omitempty"`
	Pinned     bool `json:"pinned,omitempty"`
}

type ServiceInstanceDefSpawnMount struct {
	Type        string `json:"type"`
	Source      string `json:"source"`
	Destination string `json:"destination"`
	Mode        string `json:"mode,omitempty"`
}

type ServiceSpawnParameters map[string]*ServiceSpawnParameter

type ServiceSpawnParameter struct {
	String *string
	Space  *SpaceView
	Spaces *[]SpaceView

	Implicit bool
}

func fmtSpaceView(v *SpaceView) string {
	suffix := ""
	if v.ReadOnly {
		suffix = ":ro"
	}
	return v.SpaceID + suffix
}

func (p *ServiceSpawnParameter) Format() string {
	switch {
	case p.String != nil:
		return *p.String
	case p.Space != nil:
		space := p.Space
		return fmtSpaceView(space)
	case p.Spaces != nil:
		multi := []string{""} // an initial empty value to say this is a "multi"
		for _, m := range *p.Spaces {
			multi = append(multi, fmtSpaceView(&m))
		}
		// Canonicalize multi order
		sort.Strings(multi)
		return strings.Join(multi, SpaceViewMultiSep)
	}

	return ""
}

const spaceViewCut = "="
const spaceViewsSep = ";"
const SpaceViewMultiSep = ","
const viewspecParameterStart = ";"

func ParseServiceSpawnRequest(spec string, forceReadOnly bool, spawnPrefix string) (*ServiceSpawnRequest, error) {
	var service string
	var viewspec string

	if strings.HasPrefix(spec, viewspecParameterStart) { // service is unknown!
		viewspec = strings.TrimPrefix(spec, viewspecParameterStart)
	} else {
		service, viewspec, _ = strings.Cut(spec, viewspecParameterStart)
	}

	params := map[string]string{}
	if viewspec != "" {
		for _, fragment := range strings.Split(viewspec, spaceViewsSep) {
			k, v, ok := strings.Cut(fragment, spaceViewCut)
			if !ok {
				v = k
				k = "data"
			}
			params[k] = v
		}
	}

	r := &ServiceSpawnRequest{
		ServiceName: service,
		Parameters:  params,
		URLPrefix:   spawnPrefix,

		CanonicalFormat: "",
		SeemsConcrete:   false,
	}

	r.CanonicalFormat, r.SeemsConcrete = r.format()

	// fmt.Printf("ParseServiceSpawnRequest %q %#v\n", spec, *r)

	return r, nil
}

func (r *ServiceSpawnRequest) format() (string, bool) {
	concrete := r.ServiceName != ""

	fragments := []string{}
	params := r.Parameters
	for k := range r.Parameters {
		if k == "" {
			continue
		}
		// TODO consider canonicalizing spaces order...
		fragments = append(fragments, k+spaceViewCut+params[k])
	}

	if len(fragments) == 0 {
		return r.ServiceName, concrete
	}

	// Canonicalize mount order
	sort.Strings(fragments)

	viewspec := strings.Join(fragments, spaceViewsSep)
	// fmt.Printf("ServiceSpawn() viewspec=%q fragments=%#v r=%#v\n", viewspec, fragments, r)

	return r.ServiceName + viewspecParameterStart + viewspec, concrete
}

func (r ServiceSpawnResolution) Format() (string, bool) {
	spaceFragments := []string{}
	for k, v := range r.Parameters {
		if v.Implicit {
			continue
		}
		spaceFragments = append(spaceFragments, k+spaceViewCut+v.Format())
	}
	if len(spaceFragments) == 0 {
		return r.ServiceName, r.ServiceName != ""
	}

	// Canonicalize mount order
	sort.Strings(spaceFragments)

	viewspec := strings.Join(spaceFragments, spaceViewsSep)
	// fmt.Printf("ServiceSpawnResolution() viewspec=%s r=%#v\n", viewspec, r)

	return r.ServiceName + viewspecParameterStart + viewspec, r.ServiceName != ""
}
