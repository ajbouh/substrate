package units

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
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

func RemoveFiles(fsys fs.FS, files ...string) error {
	fsremovefile, ok := fsys.(interface {
		Remove(name string) error
	})
	if !ok {
		return fmt.Errorf("unable to remove on fs")
	}

	for _, file := range files {
		err := fsremovefile.Remove(file)
		// this is not standard remove semantics
		if err != nil && !errors.Is(err, fs.ErrNotExist) {
			return err
		}
	}

	return nil
}

func readAllJSONFilesWithSuffix[T any](fsys fs.FS, baseDir string, suffix string) (map[string]T, error) {
	slog.Info("readAllJSONFilesWithSuffix", "baseDir", baseDir, "suffix", suffix)
	m := map[string]T{}
	var errs []error
	baseDirPrefix := baseDir + "/"
	err := fs.WalkDir(fsys, baseDir, func(p string, d fs.DirEntry, err error) error {
		slog.Info("readAllJSONFilesWithSuffix", "baseDir", baseDir, "suffix", suffix, "p", p, "d", d, "err", err)

		if err != nil && errors.Is(err, fs.ErrNotExist) {
			return nil
		}

		if err != nil {
			errs = append(errs, err)
			return nil
		}

		if d.IsDir() {
			return nil
		}

		linkFileName := p
		if !strings.HasSuffix(linkFileName, suffix) {
			return nil
		}

		b, err := fs.ReadFile(fsys, linkFileName)
		if errors.Is(err, fs.ErrNotExist) {
			return nil
		}

		if err != nil {
			errs = append(errs, err)
			return nil
		}

		var t T
		err = json.Unmarshal(b, &t)
		if err != nil {
			errs = append(errs, err)
		}

		key := strings.TrimPrefix(strings.TrimSuffix(linkFileName, suffix), baseDirPrefix)
		m[key] = t

		return nil
	})
	if err != nil && errors.Is(err, fs.ErrNotExist) {
		err = nil
	}

	if err != nil {
		errs = append(errs, err)
	}

	slog.Info("readAllJSONFilesWithSuffix", "m", m, "err", err)

	return m, errors.Join(errs...)
}
