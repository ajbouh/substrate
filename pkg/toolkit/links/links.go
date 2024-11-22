package links

import "encoding/json"

type Link struct {
	Rel  string `json:"rel"`
	HREF string `json:"href"`

	Attributes map[string]any `json:"attributes,omitempty"`
}

type Links map[string]Link

func (l Link) Clone() (new Link, err error) {
	b, err := json.Marshal(l)
	if err != nil {
		return
	}

	err = json.Unmarshal(b, &new)
	return
}
