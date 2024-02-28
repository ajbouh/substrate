package cueloader

import "cuelang.org/go/cue/load"

func CopyConfigAndReadFilesIntoOverrides(config *load.Config) (map[string]string, *load.Config, error) {
	copy := *config
	files := map[string]string{}
	err := AddCueFiles(files, copy.Dir, "", false)
	if err != nil {
		return files, &copy, err
	}
	// Reset the overlay
	overlay := map[string]load.Source{}
	for k, v := range files {
		overlay[k] = load.FromString(v)
	}
	copy.Overlay = overlay
	copy.Tags = append([]string{}, copy.Tags...)
	return files, &copy, err
}
