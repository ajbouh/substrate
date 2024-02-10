package cueloader

import (
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func AddCueFiles(files map[string]string, dir, prefix string, override bool) error {
	return filepath.Walk(dir, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			log.Printf("error accessing a path %q: %v", path, err)
			return err
		}

		// For now only read .cue files that are ≤ 1MB
		if info.Mode().IsRegular() && strings.HasSuffix(path, ".cue") && info.Size() <= 2<<20 {
			dest := prefix+path
			if _, ok := files[dest]; override || !ok {
				b, err := os.ReadFile(path)
				if err != nil {
					return err
				}
				files[dest] = string(b)
			}
		}

		return nil
	})
}
