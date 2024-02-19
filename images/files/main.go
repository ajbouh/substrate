package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/ajbouh/substrate/images/files/assets"
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
	quietFlag        = os.Getenv(quietEnvVarName) == "true"
)

func init() {
	log.SetFlags(log.LUTC | log.Ldate | log.Ltime)
	log.SetOutput(os.Stderr)
	if addrFlag == "" {
		addrFlag = defaultAddr
	}
	flag.StringVar(&addrFlag, "addr", addrFlag, fmt.Sprintf("address to listen on (environment variable %q)", addrEnvVarName))
	flag.IntVar(&portFlag, "port", portFlag, fmt.Sprintf("port to listen on (overrides -addr port) (environment variable %q)", portEnvVarName))
	flag.BoolVar(&quietFlag, "quiet", quietFlag, fmt.Sprintf("disable all log output (environment variable %q)", quietEnvVarName))
	flag.BoolVar(&allowUploadsFlag, "uploads", allowUploadsFlag, fmt.Sprintf("allow uploads (environment variable %q)", allowUploadsEnvVarName))
	flag.BoolVar(&allowDeletesFlag, "deletes", allowDeletesFlag, fmt.Sprintf("allow deletes (environment variable %q)", allowDeletesEnvVarName))
	flag.Parse()
	if quietFlag {
		log.SetOutput(ioutil.Discard)
	}
}

func main() {
	for _, env := range os.Environ() {
		fmt.Println(env)
	}

	addr, err := addr()
	if err != nil {
		log.Fatalf("address/port: %v", err)
	}
	err = server(addr)
	if err != nil {
		log.Fatalf("start server: %v", err)
	}
}

func server(addr string) error {
	mux := http.NewServeMux()
	prefix := os.Getenv("SUBSTRATE_URL_PREFIX")

	mux.Handle(prefix+"/raw/", &fileHandler{
		route:       prefix+"/raw/",
		path:        "/spaces/data/tree",
		allowUpload: allowUploadsFlag,
		allowDelete: allowDeletesFlag,
	})

	mux.Handle(prefix+"/assets/", http.StripPrefix(prefix+"/assets/", http.FileServer(http.FS(assets.Content))))

	nbpreviewHandler := func(rw http.ResponseWriter, req *http.Request) {
		var buf = newBufferedResponseWriter()
		rawReq := req.Clone(req.Context())
		rawReq.URL.Path = prefix+"/raw" + rawReq.URL.Path

		// assume 404
		buf.statusCode = 404
		mux.ServeHTTP(buf, rawReq)
		if buf.statusCode != 200 {
			header := rw.Header()
			for k, v := range buf.Header() {
				header[k] = v
			}
			rw.WriteHeader(buf.statusCode)
			return
		}

		rw.Write(assets.RenderNBPreview(
			[]byte(os.Getenv("SPAWNER_URL")),
			[]byte(strconv.Quote(buf.b.String())),
		))
	}
	mux.Handle(prefix+"/nbpreview/retro/notebooks/", http.StripPrefix(prefix+"/nbpreview/retro/notebooks", http.HandlerFunc(nbpreviewHandler)))
	mux.Handle(prefix+"/nbpreview/", http.StripPrefix(prefix+"/nbpreview", http.HandlerFunc(nbpreviewHandler)))
	mux.Handle(prefix+"/", http.RedirectHandler(prefix+"/raw/", http.StatusFound))

	binaryPath, _ := os.Executable()
	if binaryPath == "" {
		binaryPath = "server"
	}
	log.Printf("%s listening on %q", filepath.Base(binaryPath), addr)
	return http.ListenAndServe(addr, mux)
}

func addr() (string, error) {
	portSet := portFlag != 0
	addrSet := addrFlag != ""
	switch {
	case portSet && addrSet:
		a, err := net.ResolveTCPAddr("tcp", addrFlag)
		if err != nil {
			return "", err
		}
		a.Port = portFlag
		return a.String(), nil
	case !portSet && addrSet:
		a, err := net.ResolveTCPAddr("tcp", addrFlag)
		if err != nil {
			return "", err
		}
		return a.String(), nil
	case portSet && !addrSet:
		return fmt.Sprintf(":%d", portFlag), nil
	case !portSet && !addrSet:
		fallthrough
	default:
		return defaultAddr, nil
	}
}
