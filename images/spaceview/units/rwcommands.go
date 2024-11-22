package units

import (
	"context"
	"path"
	"path/filepath"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"

	"tractor.dev/toolkit-go/engine/fs"
)

type SpaceCommands struct {
	FS fs.FS
}

var _ commands.Reflector = (*SpaceCommands)(nil)

func (p *SpaceCommands) Write(ctx context.Context, index commands.DefIndex) error {
	return WriteJSONFiles(p.FS, filepath.Join(".substrate", "commands"), ".json", index)
}

func (p *SpaceCommands) Remove(ctx context.Context, names []string) error {
	files := make([]string, 0, len(names))
	for _, name := range names {
		files = append(files, filepath.Join(".substrate", "commands", name+".json"))
	}

	return RemoveFiles(p.FS, files...)
}

func (p *SpaceCommands) Query(ctx context.Context) (commands.DefIndex, error) {
	return readAllJSONFilesWithSuffix[*commands.Msg](
		p.FS,
		path.Join(".substrate", "commands"),
		".json",
	)
}

func (p *SpaceCommands) Reflect(ctx context.Context) (commands.DefIndex, error) {
	r := handle.ContextPathValuer(ctx)
	if r == nil {
		return nil, commands.ErrReflectNotSupported
	}

	return p.Query(ctx)
}

var CommandsWriteCommand = handle.Command(
	"commands:write", "",
	func(ctx context.Context,
		spaceCommands *SpaceCommands,
		args struct {
			Commands map[string]*commands.Msg `json:"commands"`
		},
	) (Void, error) {
		return Void{}, spaceCommands.Write(ctx, args.Commands)
	},
)

var CommandsRemoveCommand = handle.Command(
	"commands:remove", "",
	func(ctx context.Context,
		spaceCommands *SpaceCommands,
		args struct {
			Commands []string `json:"commands"`
			Command  string   `json:"command"`
		},
	) (Void, error) {
		names := args.Commands
		if args.Command != "" {
			names = append([]string(nil), names...)
			names = append(names, args.Command)
		}
		return Void{}, spaceCommands.Remove(ctx, names)
	},
)
