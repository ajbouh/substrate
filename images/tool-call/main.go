package main

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"github.com/ajbouh/substrate/images/tool-call/tools"
	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"tractor.dev/toolkit-go/engine"
	"tractor.dev/toolkit-go/engine/cli"
	"tractor.dev/toolkit-go/engine/daemon"
)

func main() {
	prefix := os.Getenv("SUBSTRATE_URL_PREFIX")
	engine.Run(
		Main{},
		&httpframework.Framework{},
		&httpframework.StripPrefix{Prefix: prefix},
		&commands.HTTPHandler{Route: "/commands"},
		&commands.Aggregate{},
		commands.Entry{
			Name: "suggest",
			Def: commands.Def{
				Description: "Suggest a command",
				Parameters: commands.FieldDefs{
					"input": {
						Name:        "input",
						Type:        "string",
						Description: "The input to suggest a command for",
					},
					"commands": {
						Name:        "commands",
						Type:        "object",
						Description: "The commands to suggest from",
					},
				},
				Returns: commands.FieldDefs{
					"prompt": {
						Name:        "prompt",
						Type:        "string",
						Description: "The prompt provided to the tool suggestion model",
					},
					"choices": {
						Name:        "choices",
						Type:        "list",
						Description: "The suggested commands",
					},
				},
			},
			Run: func(ctx context.Context, p commands.Fields) (commands.Fields, error) {
				input := p.String("input")
				cmds, err := convertJSON[commands.DefIndex](p["commands"])
				if err != nil {
					return nil, err
				}
				defs := translateDefs(cmds)
				prompt, calls, err := tools.Suggest(input, defs)
				if err != nil {
					return nil, err
				}
				reqs := make([]commands.Request, 0, len(calls))
				for _, c := range calls {
					reqs = append(reqs, commands.Request{
						Command:    c.Name,
						Parameters: c.Arguments,
					})
				}
				return commands.Fields{
					"prompt":  prompt,
					"choices": reqs,
				}, nil
			},
		},
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

func convertJSON[T any](in any) (T, error) {
	var out T
	b, err := json.Marshal(in)
	if err != nil {
		return out, err
	}
	err = json.Unmarshal(b, &out)
	return out, err
}

type Main struct {
	Daemon *daemon.Framework
}

func (m *Main) InitializeCLI(root *cli.Command) {
	// a workaround for an unresolved issue in toolkit-go/engine
	// for figuring out if its a CLI or a daemon program...
	root.Run = func(ctx *cli.Context, args []string) {
		if err := m.Daemon.Run(ctx); err != nil {
			log.Fatal(err)
		}
	}
}