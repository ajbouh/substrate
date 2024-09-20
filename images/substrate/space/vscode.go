package space

import (
	"io"
	"net/http"

	"github.com/progrium/go-vscode"
	"github.com/progrium/go-vscode/product"
)

type VSCodeEditingForSpace struct {
	SpaceAsFS SpaceAsFS
}

func (s *VSCodeEditingForSpace) ContributeHTTP(mux *http.ServeMux) {
	mux.Handle("/substrate/v1/spaces/{space}/vscode/", s)
}

func (s *VSCodeEditingForSpace) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	space := r.PathValue("space")
	fsys, err := s.SpaceAsFS.SpaceAsFS(ctx, space, false)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	wb := &vscode.Workbench{
		Scheme: "https",
		Prefix: "/substrate/v1/spaces/" + space + "/vscode",
		ProductConfiguration: product.Configuration{
			NameLong: "Substrate Space Editor",
		},
		MakePTY: func() (io.ReadWriteCloser, error) {
			// cmd := exec.Command("/bin/bash")
			// return pty.Start(cmd)
			return nil, io.EOF
		},
		FS: fsys,
	}
	wb.ServeHTTP(w, r)
}
