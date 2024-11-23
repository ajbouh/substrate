package space

import (
	"encoding/json"
	"path/filepath"
	"strings"

	"tractor.dev/toolkit-go/engine/fs"
)

func WriteJSONFiles[T any](fsys fs.FS, baseDir, suffix string, m map[string]T) error {
	err := fs.MkdirAll(fsys, baseDir, 0755)
	if err != nil {
		return err
	}

	for k, v := range m {
		data, err := json.Marshal(v)
		if err != nil {
			return err
		}

		file := filepath.Join(baseDir, k) + suffix

		// mkdir if necessary
		if strings.ContainsRune(k, filepath.Separator) {
			err := fs.MkdirAll(fsys, filepath.Dir(file), 0755)
			if err != nil {
				return err
			}
		}

		err = fs.WriteFile(fsys, file, data, 0644)
		if err != nil {
			return err
		}
	}

	return nil
}
