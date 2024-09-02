package links

type Link struct {
	Rel string `json:"rel"`
	URL string `json:"url"`

	Attributes map[string]any `json:"attributes,omitempty"`
}

type Links map[string]Link
