package main

import (
	"archive/tar"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

func (f *fileHandler) serveFormUploadTo(w http.ResponseWriter, r *http.Request, osPath string) error {
	if err := r.ParseForm(); err != nil {
		return err
	}
	in, h, err := r.FormFile("file")
	if err == http.ErrMissingFile {
		w.Header().Set("Location", r.URL.String())
		w.WriteHeader(303)
	}
	if err != nil {
		return err
	}
	outPath := filepath.Join(osPath, filepath.Base(h.Filename))
	out, err := os.OpenFile(outPath, os.O_CREATE|os.O_WRONLY, 0600)
	if err != nil {
		return err
	}
	defer out.Close()

	if _, err := io.Copy(out, in); err != nil {
		return err
	}
	w.Header().Set("Location", r.URL.String())
	w.WriteHeader(303)
	return nil
}

func (f *fileHandler) serveRawUploadTo(body io.ReadCloser, osPath string) error {
	defer body.Close()
	fw, err := os.Create(osPath)
	if err != nil {
		return err
	}
	defer fw.Close()
	_, err = io.Copy(fw, body)
	if err != nil {
		return err
	}
	return nil
}

func (f *fileHandler) serveTarUploadTo(body io.ReadCloser, osPath string) error {
	if !strings.HasSuffix(osPath, "/") {
		return fmt.Errorf("tar upload must be to a path that ends with /")
	}

	defer body.Close()
	return untar(body, osPath)
}

// Based on golang's CI build untar logic. Does not support symlinks, root paths, or ".." in extracted file names.

// Copyright 2017 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

func untar(r io.Reader, dir string) (err error) {
	t0 := time.Now()
	nFiles := 0
	madeDir := map[string]bool{}
	defer func() {
		td := time.Since(t0)
		if err == nil {
			log.Printf("extracted tarball into %s: %d files, %d dirs (%v)", dir, nFiles, len(madeDir), td)
		} else {
			log.Printf("error extracting tarball into %s after %d files, %d dirs, %v: %v", dir, nFiles, len(madeDir), td, err)
		}
	}()
	// zr, err := gzip.NewReader(r)
	// if err != nil {
	// 	return fmt.Errorf("requires gzip-compressed body: %v", err)
	// }
	// tr := tar.NewReader(zr)
	tr := tar.NewReader(r)
	loggedChtimesError := false
	for {
		f, err := tr.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("tar reading error: %v", err)
			return fmt.Errorf("tar error: %v", err)
		}
		if !validRelPath(f.Name) {
			return fmt.Errorf("tar contained invalid name error %q", f.Name)
		}
		rel := filepath.FromSlash(f.Name)
		abs := filepath.Join(dir, rel)

		mode := f.FileInfo().Mode()
		switch f.Typeflag {
		case tar.TypeReg:
			// Make the directory. This is redundant because it should
			// already be made by a directory entry in the tar
			// beforehand. Thus, don't check for errors; the next
			// write will fail with the same error.
			dir := filepath.Dir(abs)
			if !madeDir[dir] {
				if err := os.MkdirAll(filepath.Dir(abs), 0755); err != nil {
					return err
				}
				madeDir[dir] = true
			}
			if runtime.GOOS == "darwin" && mode&0111 != 0 {
				// The darwin kernel caches binary signatures
				// and SIGKILLs binaries with mismatched
				// signatures. Overwriting a binary with
				// O_TRUNC does not clear the cache, rendering
				// the new copy unusable. Removing the original
				// file first does clear the cache. See #54132.
				err := os.Remove(abs)
				if err != nil && !errors.Is(err, fs.ErrNotExist) {
					return err
				}
			}
			wf, err := os.OpenFile(abs, os.O_RDWR|os.O_CREATE|os.O_TRUNC, mode.Perm())
			if err != nil {
				return err
			}
			n, err := io.Copy(wf, tr)
			if closeErr := wf.Close(); closeErr != nil && err == nil {
				err = closeErr
			}
			if err != nil {
				return fmt.Errorf("error writing to %s: %v", abs, err)
			}
			if n != f.Size {
				return fmt.Errorf("only wrote %d bytes to %s; expected %d", n, abs, f.Size)
			}
			modTime := f.ModTime
			if modTime.After(t0) {
				// Clamp modtimes at system time. See
				// golang.org/issue/19062 when clock on
				// buildlet was behind the gitmirror server
				// doing the git-archive.
				modTime = t0
			}
			if !modTime.IsZero() {
				if err := os.Chtimes(abs, modTime, modTime); err != nil && !loggedChtimesError {
					// benign error. Gerrit doesn't even set the
					// modtime in these, and we don't end up relying
					// on it anywhere (the gomote push command relies
					// on digests only), so this is a little pointless
					// for now.
					log.Printf("error changing modtime: %v (further Chtimes errors suppressed)", err)
					loggedChtimesError = true // once is enough
				}
			}
			nFiles++
		case tar.TypeDir:
			if err := os.MkdirAll(abs, 0755); err != nil {
				return err
			}
			madeDir[abs] = true
		case tar.TypeXGlobalHeader:
			// git archive generates these. Ignore them.
		default:
			return fmt.Errorf("tar file entry %s contained unsupported file type %v", f.Name, mode)
		}
	}
	return nil
}

func validRelPath(p string) bool {
	if p == "" || strings.Contains(p, `\`) || strings.HasPrefix(p, "/") || strings.Contains(p, "../") {
		return false
	}
	return true
}
