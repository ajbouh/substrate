package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/ajbouh/substrate/images/files/assets"

	"github.com/ajbouh/substrate/pkg/httpframework"

	"tractor.dev/toolkit-go/engine"
)

const (
	addrEnvVarName         = "ADDR"
	allowUploadsEnvVarName = "UPLOADS"
	allowDeletesEnvVarName = "DELETES"
	defaultAddr            = ":8080"
	portEnvVarName         = "PORT"
	quietEnvVarName        = "QUIET"
	rootRoute              = "/"
)

var (
	addrFlag         = os.Getenv(addrEnvVarName)
	allowUploadsFlag = os.Getenv(allowUploadsEnvVarName) == "true"
	allowDeletesFlag = os.Getenv(allowDeletesEnvVarName) == "true"
	portFlag64, _    = strconv.ParseInt(os.Getenv(portEnvVarName), 10, 64)
	portFlag         = int(portFlag64)
)

func init() {
	log.SetFlags(log.LUTC | log.Ldate | log.Ltime)
	log.SetOutput(os.Stderr)
	if addrFlag == "" {
		addrFlag = defaultAddr
	}
	flag.StringVar(&addrFlag, "addr", addrFlag, fmt.Sprintf("address to listen on (environment variable %q)", addrEnvVarName))
	flag.IntVar(&portFlag, "port", portFlag, fmt.Sprintf("port to listen on (overrides -addr port) (environment variable %q)", portEnvVarName))
	flag.BoolVar(&allowUploadsFlag, "uploads", allowUploadsFlag, fmt.Sprintf("allow uploads (environment variable %q)", allowUploadsEnvVarName))
	flag.BoolVar(&allowDeletesFlag, "deletes", allowDeletesFlag, fmt.Sprintf("allow deletes (environment variable %q)", allowDeletesEnvVarName))
	flag.Parse()
}

func main() {
	engine.Run(
		&httpframework.Framework{},
		&httpframework.StripPrefix{
			Prefix: os.Getenv("SUBSTRATE_URL_PREFIX"),
		},
		&fileHandler{
			route:       "/raw/",
			path:        "/spaces/data/tree",
			allowUpload: allowUploadsFlag,
			allowDelete: allowDeletesFlag,
		},
		httpframework.Route{
			Route:   "/assets/",
			Handler: http.StripPrefix("/assets/", http.FileServer(http.FS(assets.Dir))),
		},
		httpframework.Route{
			Route:   "/edit/text/",
			Handler: http.StripPrefix("/edit/text", assets.ServeFileReplacingBasePathHandler("/", "edit-text.html")),
		},
	)
}
