package sysfs_test

import (
	"io/fs"
	"strings"
	"testing"
	"testing/fstest"

	"github.com/ajbouh/substrate/images/sys/sysfs"
	"github.com/google/go-cmp/cmp"
)

var cases = []struct {
	name   string
	fsys   fs.FS
	expect sysfs.Root
}{
	{
		name: "drm card",
		fsys: fstest.MapFS{
			"sys/class/drm/card0/card0-DP-3/connector_id": {Data: []byte("1")},
			"sys/class/drm/card0/card0-DP-3/dpms":         {Data: []byte("Off")},
			"sys/class/drm/card0/card0-DP-3/edid":         {},
			"sys/class/drm/card0/card0-DP-3/enabled":      {Data: []byte("disabled")},
			"sys/class/drm/card0/card0-DP-3/modes": {Data: []byte(strings.Join([]string{
				"1920x1080",
				"1920x1080",
				"1920x1080",
				"1680x1050",
				"1600x900",
				"1280x1024",
				"1440x900",
				"1280x960",
				"1366x768",
				"1152x864",
				"1280x720",
				"1280x720",
				"1280x720",
				"1024x768",
				"800x600",
				"720x480",
				"720x480",
				"720x480",
				"720x480",
				"640x480",
				"640x480",
			}, "\n"))},
			"sys/class/drm/card0/card0-DP-3/status": {Data: []byte("disconnected")},
			"sys/class/drm/card0/card0-DP-3/uevent": {},

			"sys/class/drm/card0/card0-DP-4/connector_id": {Data: []byte("2")},
			"sys/class/drm/card0/card0-DP-4/dpms":         {Data: []byte("Off")},
			"sys/class/drm/card0/card0-DP-4/edid":         {},
			"sys/class/drm/card0/card0-DP-4/enabled":      {Data: []byte("disabled")},
			"sys/class/drm/card0/card0-DP-4/modes":        {},
			"sys/class/drm/card0/card0-DP-4/status":       {Data: []byte("disconnected")},
			"sys/class/drm/card0/card0-DP-4/uevent":       {},

			"sys/class/drm/card0/card0-DP-5/connector_id": {Data: []byte("3")},
			"sys/class/drm/card0/card0-DP-5/dpms":         {Data: []byte("Off")},
			"sys/class/drm/card0/card0-DP-5/edid":         {},
			"sys/class/drm/card0/card0-DP-5/enabled":      {Data: []byte("disabled")},
			"sys/class/drm/card0/card0-DP-5/modes":        {},
			"sys/class/drm/card0/card0-DP-5/status":       {Data: []byte("disconnected")},
			"sys/class/drm/card0/card0-DP-5/uevent":       {},

			"sys/class/drm/card0/card0-HDMI-A-4/connector_id": {Data: []byte("4")},
			"sys/class/drm/card0/card0-HDMI-A-4/dpms":         {Data: []byte("Off")},
			"sys/class/drm/card0/card0-HDMI-A-4/edid":         {},
			"sys/class/drm/card0/card0-HDMI-A-4/enabled":      {Data: []byte("disabled")},
			"sys/class/drm/card0/card0-HDMI-A-4/modes":        {},
			"sys/class/drm/card0/card0-HDMI-A-4/status":       {Data: []byte("disconnected")},
			"sys/class/drm/card0/card0-HDMI-A-4/uevent":       {},
		},
		expect: sysfs.Root{
			Class: sysfs.Class{
				DRM: &sysfs.DRM{
					Cards: map[string]sysfs.DRMCard{
						"card0": {
							Path: "sys/class/drm/card0",
							Connectors: map[string]sysfs.DRMConnector{
								"card0-DP-3": {
									Name:        "card0-DP-3",
									ConnectorID: 1,
									Enabled:     "disabled",
									Status:      "disconnected",
									DPMS:        "Off",
									Modes:       "1920x1080\n1920x1080\n1920x1080\n1680x1050\n1600x900\n1280x1024\n1440x900\n1280x960\n1366x768\n1152x864\n1280x720\n1280x720\n1280x720\n1024x768\n800x600\n720x480\n720x480\n720x480\n720x480\n640x480\n640x480", EDID: []uint8{}},
								"card0-DP-4": {
									Name:        "card0-DP-4",
									ConnectorID: 2,
									Enabled:     "disabled",
									Status:      "disconnected",
									DPMS:        "Off",
									Modes:       "",
									EDID:        []uint8{}},
								"card0-DP-5": {
									Name:        "card0-DP-5",
									ConnectorID: 3,
									Enabled:     "disabled",
									Status:      "disconnected",
									DPMS:        "Off",
									Modes:       "",
									EDID:        []uint8{},
								},
								"card0-HDMI-A-4": {
									Name:        "card0-HDMI-A-4",
									ConnectorID: 4,
									Enabled:     "disabled",
									Status:      "disconnected",
									DPMS:        "Off",
									Modes:       "",
									EDID:        []uint8{},
								},
							},
						},
					},
				},
			},
		},
	},
	{
		fsys: fstest.MapFS{
			"sys/class/hwmon/hwmon5/name": {Data: []byte("coretemp")},
		},
		expect: sysfs.Root{
			Class: sysfs.Class{
				HWMon: &sysfs.HWMon{
					SensorChips: map[string]sysfs.HWMonSensorChip{
						"hwmon5": {
							Name: "coretemp",
						},
					},
				},
			},
		},
	},
	{
		fsys: fstest.MapFS{
			"sys/class/hwmon/hwmon0/name":        {Data: []byte("acpitz\n")},
			"sys/class/hwmon/hwmon0/temp1_crit":  {Data: []byte("105000\n")},
			"sys/class/hwmon/hwmon0/temp1_input": {Data: []byte("58000\n")},
		},
		expect: sysfs.Root{
			Class: sysfs.Class{
				HWMon: &sysfs.HWMon{
					SensorChips: map[string]sysfs.HWMonSensorChip{
						"hwmon0": {
							Name: "acpitz",
							Temperatures: map[string]sysfs.HWMonTemperature{
								"temp1": {
									Crit:  int64Ptr(105000),
									Input: int64Ptr(58000),
								},
							},
						},
					},
				},
			},
		},
	},
	{
		fsys: fstest.MapFS{
			"sys/class/hwmon/hwmon1/name":        {Data: []byte("nvme\n")},
			"sys/class/hwmon/hwmon1/temp1_alarm": {Data: []byte("0\n")},
			"sys/class/hwmon/hwmon1/temp1_crit":  {Data: []byte("84850\n")},
			"sys/class/hwmon/hwmon1/temp1_input": {Data: []byte("54850\n")},
			"sys/class/hwmon/hwmon1/temp1_label": {Data: []byte("Composite\n")},
			"sys/class/hwmon/hwmon1/temp1_max":   {Data: []byte("81850\n")},
			"sys/class/hwmon/hwmon1/temp1_min":   {Data: []byte("-273150\n")},
			"sys/class/hwmon/hwmon1/temp2_input": {Data: []byte("54850\n")},
			"sys/class/hwmon/hwmon1/temp2_label": {Data: []byte("Sensor 1\n")},
			"sys/class/hwmon/hwmon1/temp2_max":   {Data: []byte("65261850\n")},
			"sys/class/hwmon/hwmon1/temp2_min":   {Data: []byte("-273150\n")},
			"sys/class/hwmon/hwmon1/temp3_input": {Data: []byte("53850\n")},
			"sys/class/hwmon/hwmon1/temp3_label": {Data: []byte("Sensor 2\n")},
			"sys/class/hwmon/hwmon1/temp3_max":   {Data: []byte("65261850\n")},
			"sys/class/hwmon/hwmon1/temp3_min":   {Data: []byte("-273150\n")},
		},
		expect: sysfs.Root{
			Class: sysfs.Class{
				HWMon: &sysfs.HWMon{
					SensorChips: map[string]sysfs.HWMonSensorChip{
						"hwmon1": {
							Name: "nvme",
							Temperatures: map[string]sysfs.HWMonTemperature{
								"temp1": {Max: int64Ptr(81850), Min: int64Ptr(-273150), Input: int64Ptr(54850), Crit: int64Ptr(84850), Label: stringPtr("Composite"), Alarm: boolPtr(false)},
								"temp2": {Max: int64Ptr(65261850), Min: int64Ptr(-273150), Input: int64Ptr(54850), Label: stringPtr("Sensor 1")},
								"temp3": {Max: int64Ptr(65261850), Min: int64Ptr(-273150), Input: int64Ptr(53850), Label: stringPtr("Sensor 2")},
							},
						},
					},
				},
			},
		},
	},
}

func int64Ptr(v int64) *int64 {
	return &v
}

func stringPtr(v string) *string {
	return &v
}

func boolPtr(v bool) *bool {
	return &v
}

func TestSysfs(t *testing.T) {
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			root := sysfs.Root{}
			err := sysfs.ReadSysfsFS(tc.fsys, "sys", &root)
			if err != nil {
				t.Errorf("unexpected error: %s", err)
				t.FailNow()
			}

			if !cmp.Equal(tc.expect, root) {
				t.Errorf("mismatch: %s", cmp.Diff(tc.expect, root))
			}
		})
	}
}
