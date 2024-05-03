package sysfs

import (
	"io/fs"
	"strings"
)

// MAJOR=226
// MINOR=0
// DEVNAME=dri/card0
// DEVTYPE=drm_minor

type Uevent struct {
	Devname string `json:"devname"`

	Rest map[string]string `json:"rest,omitempty"`
}

func (u *Uevent) ReadSysfs(fsys fs.FS, path string) (bool, error) {
	b, err := fs.ReadFile(fsys, path)
	if err != nil {
		return false, err
	}

	u.Rest = map[string]string{}

	for _, line := range strings.Split(string(b), "\n") {
		k, v, ok := strings.Cut(line, "=")
		if ok {
			switch k {
			case "DEVNAME":
				u.Devname = v
			default:
				u.Rest[k] = v
			}
		}
	}

	return true, nil
}
