package units

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"path"
	"regexp"
	"strings"
	"time"

	"github.com/evanw/esbuild/pkg/api"

	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
)

type EsbuildRoute struct {
	BaseDir string
}

var CompilePattern = regexp.MustCompile("(\\.ts)$")

func exists(p string) os.FileInfo {
	stat, _ := os.Stat(p)
	return stat
}

func readBuildOptions(opt *api.BuildOptions, path string) (bool, error) {
	f, err := os.Open(path)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return true, nil
	}

	defer f.Close()
	return true, json.NewDecoder(f).Decode(opt)
}

func (d *EsbuildRoute) detectBuildOptions(file string) (bool, time.Time, *api.BuildOptions, error) {
	opt := &api.BuildOptions{}
	file = strings.TrimSuffix(file, "/")

	if stat := exists(d.BaseDir + "/" + file); stat != nil {
		if !CompilePattern.MatchString(file) {
			return false, stat.ModTime(), nil, nil
		}

		opt.AbsWorkingDir = d.BaseDir
		opt.Outfile = file
		opt.EntryPoints = []string{file}

		opt.Format = api.FormatESModule // api.FormatDefault
		opt.Platform = api.PlatformBrowser
		opt.LogLevel = api.LogLevelSilent

		return true, stat.ModTime(), opt, nil
	}

	if present, err := readBuildOptions(opt, d.BaseDir+"/"+file+"/esbuild.json"); present {
		opt.AbsWorkingDir = d.BaseDir + "/" + file
		opt.Outfile = path.Base(file)
		if present {
			return true, time.Time{}, opt, err
		}
	}

	if present, err := readBuildOptions(opt, d.BaseDir+"/"+file+".esbuild.json"); present {
		opt.AbsWorkingDir = d.BaseDir + "/" + path.Dir(file)
		opt.Outfile = path.Base(file)
		if present {
			return true, time.Time{}, opt, err
		}
	}

	return false, time.Time{}, nil, nil
}

func (d *EsbuildRoute) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	file := r.PathValue("file")

	doBuild, mtime, opt, err := d.detectBuildOptions(file)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
		return
	}

	if !doBuild {
		routePrefix := strings.TrimSuffix(r.URL.Path, file)
		filePrefix := d.BaseDir + "/"
		http.StripPrefix(routePrefix, http.FileServerFS(os.DirFS(filePrefix))).ServeHTTP(w, r)
		return
	}

	// optionally skip the build if we know the browser has the same or newer. this might be a
	// source of bugs at some point, but at the moment we're trying to keep the number of
	// I/O operations to keep latency down. this is because we might be reading files over a network
	// file system.
	if !mtime.IsZero() {
		if ifModifiedSince := r.Header.Get("If-Modified-Since"); r.Method == http.MethodGet && ifModifiedSince != "" {
			parsedTime, err := time.Parse(http.TimeFormat, ifModifiedSince)
			if err == nil {
				if !mtime.Truncate(time.Second).After(parsedTime) {
					h := w.Header()
					h.Set("Cache-Control", "max-age=0")
					w.WriteHeader(http.StatusNotModified)
					return
				}
			}
		}
	}

	if opt != nil {
		slog.Info("esbuild build", "opt", opt)
		b := api.Build(*opt)
		if len(b.Errors) > 0 {
			errText := ""
			for _, e := range b.Errors {
				errLine := e.Text + "\n"
				if e.Location != nil {
					errLine = e.Location.File + ":" + e.Location.LineText + " " + errLine
				}
				errText += errLine
			}

			http.Error(w, errText, http.StatusUnprocessableEntity)
			return
		}

		filePrefix := opt.AbsWorkingDir + "/"
		for _, f := range b.OutputFiles {
			trimmed := strings.TrimPrefix(f.Path, filePrefix)
			slog.Info("esbuild output file", "path", f.Path, "trimmed", trimmed, "file", file)
			if trimmed == opt.Outfile {
				h := w.Header()
				h.Set("Content-Type", "text/javascript")
				if !mtime.IsZero() {
					// expect the browser to issue conditional gets
					h.Set("Cache-Control", "max-age=0")
					h.Set("Last-Modified", mtime.Format(http.TimeFormat))
				}
				w.Write(f.Contents)
				return
			}
		}
	}

	http.Error(w, "Not found", http.StatusNotFound)
}

var _ httpframework.MuxContributor = (*EsbuildRoute)(nil)

func (e *EsbuildRoute) ContributeHTTP(ctx context.Context, mux *http.ServeMux) {
	mux.Handle("/esbuild/{file...}", e)
}
