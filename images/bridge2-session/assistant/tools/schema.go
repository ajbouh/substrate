package tools

type Prop struct {
	Type string `json:"type"`
}

type Params struct {
	Type       string          `json:"type"` // object
	Properties map[string]Prop `json:"properties"`
	Required   []string        `json:"required"`
}

type Func struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Parameters  Params `json:"parameters"`
}

type Definition struct {
	Type     string `json:"type"` // function
	Function Func   `json:"function"`
}

// TODO do we need arbitrary arg types, or map[string]any for object?
type Call[Args any] struct {
	Name      string `json:"name"`
	Arguments Args   `json:"arguments"`
}

type Response[Content any] struct {
	Content Content `json:"content"`
}
