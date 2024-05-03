package assets

import (
	"embed"
	"net/http"

	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
	"tractor.dev/toolkit-go/engine/fs"
)

//go:embed *
var dir embed.FS

var Dir = fs.LiveDir(dir)

func ServeFileReplacingBasePathHandler(basePath, path string) http.Handler {
	return httpframework.ServeFileReplacingBasePathHandler(Dir, basePath, path)
}
