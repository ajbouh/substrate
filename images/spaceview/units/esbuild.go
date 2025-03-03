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

	"github.com/evanw/esbuild/pkg/api"

	"github.com/ajbouh/substrate/pkg/toolkit/httpframework"
)

type EsbuildRoute struct {
	BaseDir string
}

var MinifyPattern = regexp.MustCompile("\\.min(\\.[^\\.]+)$")

func exists(p string) bool {
	_, err := os.Stat(p)
	return err == nil
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

func (d *EsbuildRoute) detectBuildOptions(file string) (*api.BuildOptions, error) {
	opt := &api.BuildOptions{}
	file = strings.TrimSuffix(file, "/")
	if present, err := readBuildOptions(opt, d.BaseDir+"/"+file+"/esbuild.json"); present {
		opt.AbsWorkingDir = d.BaseDir + "/" + file
		opt.Outfile = path.Base(file)
		if present {
			return opt, err
		}
	}
	if exists(d.BaseDir + "/" + file) {
		opt.AbsWorkingDir = d.BaseDir
		opt.Outfile = file
		if MinifyPattern.MatchString(file) {
			opt.MinifyWhitespace = true
			opt.MinifyIdentifiers = true
			opt.MinifySyntax = true
			suffix := MinifyPattern.FindStringSubmatch(file)[1]
			opt.EntryPoints = []string{strings.TrimSuffix(file, ".min"+suffix) + suffix}
		} else {
			opt.EntryPoints = []string{file}
		}

		opt.AbsWorkingDir = d.BaseDir
		// opt.Bundle = true
		opt.Format = api.FormatDefault
		opt.Platform = api.PlatformBrowser
		opt.LogLevel = api.LogLevelSilent

		switch {
		case strings.HasSuffix(file, ".cjs"):
			opt.Format = api.FormatCommonJS
		case strings.HasSuffix(file, ".mjs"):
			opt.Format = api.FormatESModule
		}
		return opt, nil
	}
	if present, err := readBuildOptions(opt, d.BaseDir+"/"+file+".esbuild.json"); present {
		opt.AbsWorkingDir = d.BaseDir + "/" + path.Dir(file)
		opt.Outfile = path.Base(file)
		if present {
			return opt, err
		}
	}

	return nil, nil
}

func (d *EsbuildRoute) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	file := r.PathValue("file")

	opt, err := d.detectBuildOptions(file)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"message": %q}`, err.Error()), http.StatusInternalServerError)
		return
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
