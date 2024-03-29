// Copyright 2020 Red Hat, Inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.)

package v1_6_exp

import (
	"regexp"

	"github.com/coreos/butane/config/common"
	"github.com/coreos/ignition/v2/config/util"

	"github.com/coreos/vcontext/path"
	"github.com/coreos/vcontext/report"
)

const rootDevice = "/dev/disk/by-id/coreos-boot-disk"

var allowedMountpoints = regexp.MustCompile(`^/(etc|var)(/|$)`)

// We can't define a Validate function directly on Disk because that's defined in base,
// so we use a Validate function on the top-level Config instead.
func (conf Config) Validate(c path.ContextPath) (r report.Report) {
	for i, disk := range conf.Storage.Disks {
		if disk.Device != rootDevice && !util.IsTrue(disk.WipeTable) {
			for p, partition := range disk.Partitions {
				if partition.Number == 0 && partition.Label != nil {
					r.AddOnWarn(c.Append("storage", "disks", i, "partitions", p, "number"), common.ErrReuseByLabel)
				}
			}
		}
	}
	for i, fs := range conf.Storage.Filesystems {
		if fs.Path != nil && !allowedMountpoints.MatchString(*fs.Path) && util.IsTrue(fs.WithMountUnit) {
			r.AddOnError(c.Append("storage", "filesystems", i, "path"), common.ErrMountPointForbidden)
		}
	}
	return
}

func (d BootDevice) Validate(c path.ContextPath) (r report.Report) {
	if d.Layout != nil {
		switch *d.Layout {
		case "aarch64", "ppc64le", "x86_64":
		default:
			r.AddOnError(c.Append("layout"), common.ErrUnknownBootDeviceLayout)
		}
	}
	r.Merge(d.Mirror.Validate(c.Append("mirror")))
	return
}

func (m BootDeviceMirror) Validate(c path.ContextPath) (r report.Report) {
	if len(m.Devices) == 1 {
		r.AddOnError(c.Append("devices"), common.ErrTooFewMirrorDevices)
	}
	return
}

func (user GrubUser) Validate(c path.ContextPath) (r report.Report) {
	if user.Name == "" {
		r.AddOnError(c.Append("name"), common.ErrGrubUserNameNotSpecified)
	}

	if !util.NotEmpty(user.PasswordHash) {
		r.AddOnError(c.Append("password_hash"), common.ErrGrubPasswordNotSpecified)
	}
	return
}
