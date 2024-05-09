package tools

type ToolLister interface {
	// Provide context as input, or keep state of
	// what is available in this session?

	// Maybe we should also allow saving some parameter context to pass back to
	// the call from the time that we checked this?

	// Can we layer that on in a way that memoizes a parameter
	// and then puts it back into the call?
	ListTools() []Definition
}

type Runner interface {
	RunTool(Call[any]) (any, error)
}

type Registry interface {
	ToolLister
	Runner
}

type Tool struct {
	Description string
	Parameters  Params
	Run         func(any) (any, error)
}

type Tools map[string]Tool

func (t Tools) ListTools() []Definition {
	r := make([]Definition, 0, len(t))
	for name, tool := range t {
		r = append(r, Definition{
			Type: "function",
			Function: Func{
				Name:        name,
				Description: tool.Description,
				Parameters:  tool.Parameters,
			},
		})
	}
	return r
}

func (t Tools) RunTool(call Call[any]) (any, error) {
	return t[call.Name].Run(call.Arguments)
}
