package links

type Link struct {
	Rel  string `json:"rel"`
	HREF string `json:"href"`

	Attributes map[string]any `json:"attributes,omitempty"`
}

type Links map[string]Link
