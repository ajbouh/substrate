package space

import (
	"context"
	"log/slog"
	"path"
	"path/filepath"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
)

type SpaceCommands struct {
	SpaceAsFS SpaceAsFS
}

var _ commands.Reflector = (*SpaceCommands)(nil)

func (p *SpaceCommands) GetHTTPResourceReflectPath() string {
	return "/substrate/v1/spaces/{space}"
}

func (p *SpaceCommands) Write(ctx context.Context, spaceID string, index commands.DefIndex) error {
	fsys, err := p.SpaceAsFS.SpaceAsFS(ctx, spaceID, false)
	if err != nil {
		return err
	}

	return WriteJSONFiles(fsys, filepath.Join(".substrate", "commands"), ".json", index)
}

func (p *SpaceCommands) Remove(ctx context.Context, spaceID string, names []string) error {
	fsys, err := p.SpaceAsFS.SpaceAsFS(ctx, spaceID, false)
	if err != nil {
		return err
	}

	files := make([]string, 0, len(names))
	for _, name := range names {
		files = append(files, filepath.Join(".substrate", "commands", name+".json"))
	}

	return RemoveFiles(fsys, files...)
}

func (p *SpaceCommands) Query(ctx context.Context, spaceID string) (commands.DefIndex, error) {
	slog.Info("Commands", "spaceID", spaceID)

	fsys, err := p.SpaceAsFS.SpaceAsFS(ctx, spaceID, false)
	if err != nil {
		return nil, err
	}

	return readAllJSONFilesWithSuffix[commands.Def](
		fsys,
		path.Join(".substrate", "commands"),
		".json",
	)
}

func (p *SpaceCommands) Reflect(ctx context.Context) (commands.DefIndex, error) {
	r := handle.ContextPathValuer(ctx)
	if r == nil {
		return nil, commands.ErrReflectNotSupported
	}

	space := r.PathValue("space")
	if space == "" {
		return nil, commands.ErrReflectNotSupported
	}

	return p.Query(ctx, space)
}

var CommandsWriteCommand = handle.HTTPCommand(
	"commands:write", "",
	"POST /substrate/v1/spaces/{space}/commands/write", "/substrate/v1/spaces/{space}",
	func(ctx context.Context,
		spaceCommands *SpaceCommands,
		args struct {
			SpaceID  string                  `json:"space" path:"space"`
			Commands map[string]commands.Def `json:"commands"`
		},
	) (Void, error) {
		return Void{}, spaceCommands.Write(ctx, args.SpaceID, args.Commands)
	},
)

var CommandsRemoveCommand = handle.HTTPCommand(
	"commands:remove", "",
	"POST /substrate/v1/spaces/{space}/commands/remove", "/substrate/v1/spaces/{space}",
	func(ctx context.Context,
		spaceCommands *SpaceCommands,
		args struct {
			SpaceID  string   `json:"space" path:"space"`
			Commands []string `json:"commands"`
			Command  string   `json:"command"`
		},
	) (Void, error) {
		names := args.Commands
		if args.Command != "" {
			names = append([]string(nil), names...)
			names = append(names, args.Command)
		}
		return Void{}, spaceCommands.Remove(ctx, args.SpaceID, names)
	},
)
