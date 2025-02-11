package main

import (
	"context"
	"net/http"

	"github.com/ajbouh/substrate/images/tool-call/js"
	"github.com/ajbouh/substrate/images/tool-call/tools"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

type SuggestReturns struct {
	Prompt  string             `json:"prompt" doc:"The prompt provided to the tool suggestion model"`
	Choices []commands.Request `json:"choices" doc:"The suggested commands"`
}

func main() {
	engine.Run(
		&service.Service{},
		httpframework.Route{
			Route:   "GET /js/",
			Handler: http.StripPrefix("/js", http.FileServer(http.FS(js.Dir))),
		},
		commands.List(
			handle.Command(
				"suggest",
				"Suggest a command",
				func(ctx context.Context, t *struct{}, args struct {
					Input    string            `json:"input" doc:"The input to suggest a command for"`
					Commands commands.DefIndex `json:"commands" doc:"The commands to suggest from"`
				}) (SuggestReturns, error) {
					input := args.Input
					cmds := args.Commands
					defs, err := translateDefs(cmds)
					if err != nil {
						return SuggestReturns{}, err
					}

					prompt, calls, err := tools.Suggest(input, defs)
					if err != nil {
						return SuggestReturns{}, err
					}
					reqs := make([]commands.Request, 0, len(calls))
					for _, c := range calls {
						reqs = append(reqs, commands.Request{
							Command:    c.Name,
							Parameters: c.Arguments,
						})
					}
					return SuggestReturns{
						Prompt:  prompt,
						Choices: reqs,
					}, nil
				}).WithExample(
				"simple_ide_cursor_movement",
				commands.Fields{
					"description": "Advance cursor by 3",
					"parameters": commands.Fields{
						"input": "move the cursor three lines down",
						"commands": commands.DefIndex{
							"cursor_next_line": commands.Fields{
								"description": "Move the cursor to n lines down the current line",
								"meta": commands.Fields{
									"#/data/parameters/nLines": commands.Fields{
										"type":        "number",
										"description": "The amount of movement.",
									},
									"#/data/returns/ok": commands.Fields{
										"type": "boolean",
									},
								},
							},
							"type_in": {
								"description": "Type in the argument at the current cursor position",
								"meta": commands.Fields{
									"#/data/parameters/input": commands.Fields{
										"type":        "string",
										"description": "The string to be entered.",
									},
									"#/data/returns/ok": commands.Fields{"type": "boolean"},
								},
							},
						},
					},
				}),
		),
	)
}

func translateDefs(def commands.DefIndex) ([]tools.Definition, error) {
	var td []tools.Definition

	for name, d := range def {
		desc, err := commands.GetPath[string](d, "description")
		if err != nil {
			return nil, err
		}
		d2 := tools.Definition{
			Type: "function",
			Function: tools.Func{
				Name:        name,
				Description: desc,
				Parameters: tools.Params{
					Type:       "object",
					Properties: map[string]tools.Prop{},
				},
			},
		}

		parametersPrefix := commands.NewDataPointer("data", "parameters")
		meta, err := commands.GetPath[commands.Meta](d, "meta")
		if err != nil {
			return nil, err
		}

		for pointer, metadata := range meta {
			subpath, ok := pointer.TrimPathPrefix(parametersPrefix)
			if !ok {
				continue
			}

			p := subpath.Path()
			if len(p) != 1 {
				continue
			}
			paramName := p[0]

			d2.Function.Parameters.Properties[paramName] = tools.Prop{Type: metadata.Type}

			// TODO update commands to show which are required
			d2.Function.Parameters.Required = append(d2.Function.Parameters.Required, paramName)
		}
		td = append(td, d2)
	}

	return td, nil
}
