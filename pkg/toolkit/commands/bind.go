package commands

import (
	"context"
	"fmt"
	"log/slog"
)

type BindEntry struct {
	Path       string
	Command    string
	Parameters Fields
	Returns    Fields
}

func Bind(resolveReflector func(string) Reflector, commands map[string]BindEntry) (DefIndex, error) {
	slog.Info("HTTPSourceHandler.Bind()...", "commands", commands)
	bound := DefIndex{}
	defer slog.Info("HTTPSourceHandler.Bind().", "bound", bound)

	defIndices := map[string]DefIndex{}
	defIndexForPath := func(path string) (DefIndex, error) {
		defIndex, ok := defIndices[path]
		if !ok {
			var err error
			reflector := resolveReflector(path)
			if reflector == nil {
				return nil, ErrNoSuchCommand
			}

			defIndex, err = reflector.Reflect(context.Background())
			if err != nil {
				return defIndex, err
			}
			defIndices[path] = defIndex
		}
		return defIndex, nil
	}

	for command, bindEntry := range commands {
		defIndex, err := defIndexForPath(bindEntry.Path)
		if err != nil {
			return nil, fmt.Errorf("error resolving command %q using BindEntry %#v: %w", command, bindEntry, err)
		}

		def, ok := defIndex[bindEntry.Command]
		if !ok {
			return nil, fmt.Errorf("error resolving command %q using BindEntry %#v: %w", command, bindEntry, ErrNoSuchCommand)
		}

		def, err = def.Clone()
		if err != nil {
			return bound, err
		}

		parameters, returns := bindEntry.Parameters, bindEntry.Returns

		if parameters != nil || returns != nil {
			if def.Run.Bind == nil {
				def.Run.Bind = &RunBindDef{}
			}
		}
		if parameters != nil {
			if def.Run.Bind.Parameters == nil {
				def.Run.Bind.Parameters = map[string]any{}
			}
			for k, v := range parameters {
				def.Run.Bind.Parameters[k] = v
			}
		}
		if returns != nil {
			if def.Run.Bind.Returns == nil {
				def.Run.Bind.Returns = map[string]any{}
			}
			for k, v := range returns {
				def.Run.Bind.Returns[k] = v
			}
		}

		bound[command] = def
	}

	return bound, nil
}
