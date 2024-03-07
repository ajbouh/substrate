package assets

import (
	"bytes"
	"embed"
	"log"
	"net/http"
	"time"

	"tractor.dev/toolkit-go/engine/fs"
)

//go:embed *
var dir embed.FS

var Dir = fs.LiveDir(dir)

func ServeFileReplacingBasePath(basePath, path string, w http.ResponseWriter, r *http.Request) {
	content, err := fs.ReadFile(Dir, path)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	content = bytes.Replace(content,
		[]byte("<head>"),
		[]byte(`<head><base href="`+basePath+`">`),
		1)
	b := bytes.NewReader(content)
	http.ServeContent(w, r, path, time.Now(), b)
}
