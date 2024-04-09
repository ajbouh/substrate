package httpframework

import (
	"bytes"
	"io/fs"
	"log"
	"net/http"
	"time"
)

func ServeFileReplacingBasePathHandler(dir fs.FS, basePath, path string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		content, err := fs.ReadFile(dir, path)
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
	})
}
