package tools

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/ajbouh/substrate/images/tool-call/openai"
	"github.com/ajbouh/substrate/images/tool-call/prompts"
)

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

func Suggest(input string, defs []Definition) (string, []Call[any], error) {
	prompt, err := prompts.Render("tool-select", map[string]any{
		"UserInput": input,
		"ToolDefs":  defs,
	})
	if err != nil {
		return prompt, nil, err
	}
	resp, err := openai.CompleteWithFrontmatter(prompt)
	if err != nil {
		return prompt, nil, err
	}
	log.Printf("tools:\n\n>>>input: %s\n\n<<<response: %s", input, resp)
	_, after, found := strings.Cut(resp, "<tool_call>")
	if !found {
		return prompt, nil, fmt.Errorf("tools: no <tool_call> found: %q", resp)
	}
	inside, _, found := strings.Cut(after, "</tool_call>")
	if !found {
		return prompt, nil, fmt.Errorf("tools: no </tool_call> found: %q", resp)
	}
	// TODO parse multiple <tool_call> sections
	var out Call[any]
	if err := json.Unmarshal([]byte(inside), &out); err != nil {
		return prompt, nil, err
	}
	return prompt, []Call[any]{out}, nil
}
