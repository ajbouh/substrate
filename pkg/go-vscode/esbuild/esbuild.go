package esbuild

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/evanw/esbuild/pkg/api"
)

// Dir uses the filename of the calling source file and sees if it exists on the system
// to return the path to that directory. It panics otherwise.
func WorkingDir() string {
	_, filename, _, _ := runtime.Caller(1)
	dir := filepath.Dir(filename)
	_, err := os.Stat(dir)
	if os.IsNotExist(err) {
		panic(fmt.Errorf("directory not found: %s", dir))
	}
	return dir
}

type BuildRoute struct {
	BuildOptions api.BuildOptions
}

func (d *BuildRoute) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	file := r.PathValue("file")
	filePrefix := d.BuildOptions.AbsWorkingDir + "/"

	// If the file exists on disk, serve it
	if file != "" {
		_, err := os.Stat(filePrefix + file)
		if err == nil {
			routePrefix := strings.TrimSuffix(r.URL.Path, file)
			http.StripPrefix(routePrefix, http.FileServerFS(os.DirFS(filePrefix))).ServeHTTP(w, r)
			return
		}
	}

	b := api.Build(d.BuildOptions)
	if file == "" {
		file = d.BuildOptions.Outfile
	}

	for _, f := range b.OutputFiles {
		trimmed := strings.TrimPrefix(f.Path, filePrefix)
		// slog.Info("esbuild output file", "path", f.Path, "trimmed", trimmed, "file", file)
		if trimmed == file {
			h := w.Header()
			h.Set("Content-Type", "text/javascript")
			w.Write(f.Contents)
			return
		}
	}

	http.Error(w, "Not found", http.StatusNotFound)
}
