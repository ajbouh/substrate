package sysfs

type Class struct {
	DRM   *DRM   `json:"drm,omitempty" sysfs:"readdir,drm"`
	HWMon *HWMon `json:"hwmon,omitempty" sysfs:"readdir,hwmon"`
}

type Root struct {
	Class Class `json:"class" sysfs:"readdir,class"`
}
