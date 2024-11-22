package units

import (
	"context"
	"io"
	"io/fs"
	"net/http"

	"github.com/progrium/go-vscode"
	"github.com/progrium/go-vscode/product"

	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
)

type VSCodeEditingForFS struct {
	Host   string
	Prefix string
	Scheme string

	FS fs.FS

	workbench *vscode.Workbench
}

func (s *VSCodeEditingForFS) Initialize() {
	s.workbench = &vscode.Workbench{
		Scheme: s.Scheme,
		Host:   s.Host,
		Prefix: s.Prefix + "/vscode",
		ProductConfiguration: product.Configuration{
			NameLong: "Substrate Space Editor",
		},
		MakePTY: func() (io.ReadWriteCloser, error) {
			// cmd := exec.Command("/bin/bash")
			// return pty.Start(cmd)
			return nil, io.EOF
		},
		FS: s.FS,
	}
}

func (s *VSCodeEditingForFS) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	r2 := httpframework.ContextPrefixOriginalRequest(r.Context())
	// if r2 == nil {
	// 	r2 = r
	// }
	s.workbench.ServeHTTP(w, r2)
}

func (s *VSCodeEditingForFS) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.Handle("/vscode/", s)
}
