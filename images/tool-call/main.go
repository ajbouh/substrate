package main

import (
	"context"
	"net/http"

	"github.com/ajbouh/substrate/images/tool-call/js"
	"github.com/ajbouh/substrate/images/tool-call/tools"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/engine"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"github.com/ajbouh/substrate/pkg/toolkit/service"
)

type SuggestReturns struct {
	Prompt  string             `json:"prompt" desc:"The prompt provided to the tool suggestion model"`
	Choices []commands.Request `json:"choices" desc:"The suggested commands"`
}

func main() {
	engine.Run(
		&service.Service{},
		httpframework.Route{
			Route:   "GET /js/",
			Handler: http.StripPrefix("/js", http.FileServer(http.FS(js.Dir))),
		},
		commands.List(
			commands.Command(
				"suggest",
				"Suggest a command",
				func(ctx context.Context, t *struct{}, args struct {
					Input    string            `json:"input" desc:"The input to suggest a command for"`
					Commands commands.DefIndex `json:"commands" desc:"The commands to suggest from"`
				}) (SuggestReturns, error) {
					input := args.Input
					cmds := args.Commands
					defs := translateDefs(cmds)
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
				}),
		),
	)
}

func translateDefs(def commands.DefIndex) []tools.Definition {
	var td []tools.Definition
	for name, d := range def {
		d2 := tools.Definition{
			Type: "function",
			Function: tools.Func{
				Name:        name,
				Description: d.Description,
				Parameters: tools.Params{
					Type:       "object",
					Properties: map[string]tools.Prop{},
				},
			},
		}
		for paramName, param := range d.Parameters {
			d2.Function.Parameters.Properties[paramName] = tools.Prop{Type: param.Type}
			// TODO update commands to show which are required
			d2.Function.Parameters.Required = append(d2.Function.Parameters.Required, paramName)
		}
		td = append(td, d2)
	}
	return td
}
