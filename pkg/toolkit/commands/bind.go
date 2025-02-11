package commands

import (
	"context"
	"fmt"
	"log/slog"
)

type BindEntry struct {
	Path    string
	Command string
	Data    Fields
}

func Bind(resolveReflector func(string) Reflector, commands map[string]BindEntry) (DefIndex, error) {
	slog.Info("HTTPSourceHandler.Bind()...", "commands", commands)
	bound := DefIndex{}
	defIndices := map[string]DefIndex{}

	defer func() { slog.Info("HTTPSourceHandler.Bind().", "bound", bound, "defIndices", defIndices) }()

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
			return nil, fmt.Errorf("error resolving command %q using BindEntry %#v: no defindex: %w", command, bindEntry, err)
		}

		def, ok := defIndex[bindEntry.Command]
		if !ok {
			return nil, fmt.Errorf("error resolving command %q using BindEntry %#v: %w", command, bindEntry, ErrNoSuchCommand)
		}

		d, err := def.CloneAndBind(Fields{"data": bindEntry.Data})
		if err != nil {
			return bound, err
		}

		bound[command] = d
	}

	return bound, nil
}
