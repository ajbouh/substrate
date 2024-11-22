package units

import (
	"context"
	"io"
	"net/http"

	"tractor.dev/toolkit-go/engine/fs"

	"github.com/ajbouh/substrate/pkg/toolkit/commands/handle"
)

type Void struct{}

var void Void = Void{}

var ReadCommand = handle.Command(
	"space:tree:read-blob",
	"Read a file",
	func(ctx context.Context,
		t *struct {
			FS fs.FS
		},
		args struct {
			Path   string `json:"path" path:"path"`
			Writer http.ResponseWriter
		},
	) (Void, error) {
		data, err := fs.ReadFile(t.FS, args.Path)
		if err != nil {
			return void, err
		}

		_, err = args.Writer.Write(data)
		return void, err

	})

var WriteCommand = handle.HTTPCommand(
	"space:tree:write-blob", "Write a file",
	"PUT /tree/{path...}", "/tree/{path...}",
	func(ctx context.Context,
		t *struct {
			FS fs.FS
		},
		args struct {
			Path string        `json:"path" path:"path"`
			Body io.ReadCloser `json:"-"`
		},
	) (Void, error) {
		defer args.Body.Close()

		data, err := io.ReadAll(args.Body)
		if err != nil {
			return void, err
		}

		return void, fs.WriteFile(t.FS, args.Path, data, 0644)
	})
