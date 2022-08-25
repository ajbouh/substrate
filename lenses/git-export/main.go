package main

import (
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/julienschmidt/httprouter"

	"github.com/ajbouh/substrate/pkg/httpcmd"
)

func main() {
	// TODO run gotty (with bash?)
	// TODO run httpcmd with git-export.sh

	router := httprouter.New()

	baseDir := "/spaces/config/tree/runs"

	httpcmd.Mount(router, "/runs/export", func() *exec.Cmd {
		return exec.Command("/app/run.sh", "export")
	}, baseDir)

	httpcmd.Mount(router, "/runs/init", func() *exec.Cmd {
		return exec.Command("/app/run.sh", "init")
	}, baseDir)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	binaryPath, _ := os.Executable()
	if binaryPath == "" {
		binaryPath = "server"
	}
	addr := ":" + port
	log.Printf("%s listening on %q", filepath.Base(binaryPath), addr)

	log.Fatal(http.ListenAndServe(addr, router))
}
