package units

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

type FileTree struct {
	FS fs.FS

	CommandsHTTPSourceHandler *handle.HTTPResourceReflectHandler
}

var _ handle.HTTPResourceReflect = (*FileTree)(nil)

func (x *FileTree) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.Handle("/tree/{path...}", x)
}

func (x *FileTree) GetHTTPResourceReflectPath() string {
	return "/tree/{path...}"
}

func (x *FileTree) Reflect(ctx context.Context) (commands.DefIndex, error) {
	r := handle.ContextPathValuer(ctx)
	slog.Info("FileTree.Reflect()", "r", r)

	if r == nil {
		return commands.DefIndex{}, nil
	}

	path := r.PathValue("path")

	stat, err := fs.Stat(x.FS, path)
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
				"read-blob": {
					Command: "space:tree:read-blob",
					Data: commands.Fields{
						"parameters": commands.Fields{"path": path},
					},
				},
				// TODO put back after we tweak a few things.
				// "write-blob": {
				// 	Command: "space:tree:write-blob",
				// 	Data: commands.Fields{
				// 		"parameters": commands.Fields{"path": path},
				// 	},
				// },
			})
	}
}

func (x *FileTree) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	http.StripPrefix("/tree", http.FileServerFS(x.FS)).ServeHTTP(w, r)
}
