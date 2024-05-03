package sysfs

import (
	"strconv"
	"strings"
)

type DRMConnector struct {
	Name        string             `json:"name" sysfs:"base"`
	ConnectorID int64              `json:"connector_id" sysfs:"read,connector_id"`
	Enabled     string             `json:"enabled" sysfs:"read,enabled"`
	Status      string             `json:"status" sysfs:"read,status"`
	DPMS        string             `json:"dpms" sysfs:"read,dpms"`
	Modes       *DRMConnectorModes `json:"modes,omitempty" sysfs:"read,modes"`
	EDID        []byte             `json:"edid" sysfs:"read,edid"`
}

type DRMConnectorMode struct {
	Width  int `json:"width"`
	Height int `json:"height"`
}

type DRMConnectorModes struct {
	ModeLines []DRMConnectorMode `json:"mode_lines"`
}

func (u *DRMConnectorModes) ParseSysfs(b []byte) (bool, error) {
	some := false
	for _, line := range strings.Split(string(b), "\n") {
		w, h, ok := strings.Cut(line, "x")
		if !ok {
			continue
		}

		width, err := strconv.Atoi(w)
		if err != nil {
			return some, err
		}
		height, err := strconv.Atoi(h)
		if err != nil {
			return some, err
		}

		u.ModeLines = append(u.ModeLines, DRMConnectorMode{width, height})
		some = true
	}

	return some, nil
}

type DRMCard struct {
	Path       string                  `json:"path" sysfs:"path"`
	Connectors map[string]DRMConnector `json:"connectors" sysfs:"readdir,^card\\d+-.*$"`
	Uevent     Uevent                  `json:"uevent" sysfs:"read,uevent"`
}

type DRM struct {
	Cards map[string]DRMCard `json:"cards" sysfs:"readdir,^card\\d+$"`
}
