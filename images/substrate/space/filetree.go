package space

import (
	"context"
	"errors"
	"io/fs"
	"log/slog"
	"net/http"
	"os"

	"github.com/ajbouh/substrate/pkg/toolkit/commands"
	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
)

type SpacesFileTree struct {
	SpacesViaContainerFilesystems *SpacesViaContainerFilesystems
	CommandsHTTPSourceHandler     *handle.HTTPResourceReflectHandler
}

var _ handle.HTTPResourceReflect = (*SpacesFileTree)(nil)

func (x *SpacesFileTree) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.Handle("/substrate/v1/spaces/{space}/tree/{path...}", x)
}

func (x *SpacesFileTree) GetHTTPResourceReflectPath() string {
	return "/substrate/v1/spaces/{space}/tree/{path...}"
}

func (x *SpacesFileTree) Reflect(ctx context.Context) (commands.DefIndex, error) {
	r := handle.ContextPathValuer(ctx)
	if r == nil {
		return commands.DefIndex{}, nil
	}

	spaceID := r.PathValue("space")
	fsys, err := x.SpacesViaContainerFilesystems.SpaceAsFS(ctx, spaceID, false)
	if err != nil {
		return nil, err
	}

	path := r.PathValue("path")
	slog.Info("SpacesFileTree.Reflect", "path", path, "space", spaceID)
	stat, err := fs.Stat(fsys, path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil, &handle.HTTPStatusError{
				Err:    err,
				Status: 404,
			}
		}
		return nil, err
	}
	if stat.IsDir() {
		return commands.Bind(x.CommandsHTTPSourceHandler.ReflectorForPathFuncExcluding(x),
			map[string]commands.BindEntry{
				// TODO use file mode to decide whether or not read-archive and/or write-archive should be included.
			})
	} else {
		return commands.Bind(x.CommandsHTTPSourceHandler.ReflectorForPathFuncExcluding(x),
			map[string]commands.BindEntry{
				// TODO use file mode to decide whether or not read and/or write should be included.
				"read-blob": commands.BindEntry{
					Command: "space:tree:read-blob",
					Data: commands.Fields{
						"parameters": commands.Fields{"space": spaceID, "path": path},
					},
				},
				"write-blob": commands.BindEntry{
					Command: "space:tree:write-blob",
					Data: commands.Fields{
						"parameters": commands.Fields{"space": spaceID, "path": path},
					},
				},
			})
	}
}

func (x *SpacesFileTree) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	spaceID := r.PathValue("space")
	fsys, err := x.SpacesViaContainerFilesystems.SpaceAsFS(r.Context(), spaceID, true)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.StripPrefix("/substrate/v1/spaces/"+spaceID+"/tree", http.FileServerFS(fsys)).ServeHTTP(w, r)
}
