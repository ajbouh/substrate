package cueloader

import (
	"encoding/json"

	"cuelang.org/go/cue/load"
)

type cueConfigWithFiles struct {
	Tags  []string          `json:"tags,omitempty"`
	Dir   string            `json:"dir,omitempty"`
	Files map[string]string `json:"files,omitempty"`
} 

func Marshal(files map[string]string, config *load.Config) ([]byte, error) {
	return json.Marshal(&cueConfigWithFiles{Files: files, Dir: config.Dir, Tags: config.Tags})
}

func Unmarshal(b []byte) (map[string]string, *load.Config, error) {
	var c cueConfigWithFiles
	err := json.Unmarshal(b, &c)
	if err != nil {
		return nil, nil, err
	}
	config := &load.Config{Dir: c.Dir, Tags: c.Tags}
	overlay := map[string]load.Source{}
	for k, v := range c.Files {
		overlay[k] = load.FromString(v)
	}
	config.Overlay = overlay

	return c.Files, config, nil
}
