package units

import (
	"errors"
	"fmt"
	"log"
	"os"

	"cuelang.org/go/cue/load"
)

func mustGetenv(name string) string {
	value := os.Getenv(name)
	if value == "" {
		log.Fatalf("%s not set", name)
	}
	return value
}

func cueDefsLoadTags() []string {
	liveEdit := "false"
	if os.Getenv("SUBSTRATE_CUE_DEFS_LIVE") != "" {
		liveEdit = "true"
	}
	cueDefsLoadTags := []string{
		// Include enough config to interpret things again
		"live_edit=" + liveEdit,
		"namespace=" + mustGetenv("SUBSTRATE_NAMESPACE"),
		"cue_defs=" + mustGetenv("SUBSTRATE_CUE_DEFS"),
	}

	if os.Getenv("SUBSTRATE_SOURCE") != "" {
		cueDefsLoadTags = append(cueDefsLoadTags, "host_source_directory="+os.Getenv("SUBSTRATE_SOURCE"))
	}

	return cueDefsLoadTags
}

func InitialCueLoadConfig() *load.Config {
	cueDefsDir := mustGetenv("SUBSTRATE_CUE_DEFS")

	cueDefsLiveDir := os.Getenv("SUBSTRATE_CUE_DEFS_LIVE")
	if cueDefsLiveDir != "" {
		entries, err := os.ReadDir(cueDefsLiveDir)
		if err == nil {
			if len(entries) == 0 {
				fmt.Printf("SUBSTRATE_CUE_DEFS_LIVE (%s) is empty; loading from SUBSTRATE_CUE_DEFS (%s) instead\n", cueDefsLiveDir, cueDefsDir)
			} else {
				fmt.Printf("SUBSTRATE_CUE_DEFS_LIVE (%s) is nonempty; loading from it instead of SUBSTRATE_CUE_DEFS (%s)\n", cueDefsLiveDir, cueDefsDir)
				cueDefsDir = cueDefsLiveDir
			}
		} else {
			if errors.Is(err, os.ErrNotExist) {
				fmt.Printf("SUBSTRATE_CUE_DEFS_LIVE (%s) does not exist; loading from SUBSTRATE_CUE_DEFS (%s) instead\n", cueDefsLiveDir, cueDefsDir)
			} else {
				fmt.Printf("error while listing SUBSTRATE_CUE_DEFS_LIVE (%s): %s; loading from SUBSTRATE_CUE_DEFS (%s) instead\n", cueDefsLiveDir, err, cueDefsDir)
			}
		}
	} else {
		fmt.Printf("SUBSTRATE_CUE_DEFS_LIVE not set; loading from SUBSTRATE_CUE_DEFS (%s) instead\n", cueDefsDir)
	}

	return &load.Config{
		Dir:  cueDefsDir,
		Tags: cueDefsLoadTags(),
	}
}

type Loader[T any] interface {
	Load() T
}
