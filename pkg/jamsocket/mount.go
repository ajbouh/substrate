package jamsocket

// From
// https://github.com/moby/moby/blob/v20.10.22/api/types/mount/mount.go

import (
	"os"
)

// Type represents the type of a mount.
type Type string

// Type constants
const (
	// TypeBind is the type for mounting host dir
	TypeBind Type = "bind"
	// TypeVolume is the type for remote storage volumes
	TypeVolume Type = "volume"
	// TypeTmpfs is the type for mounting tmpfs
	TypeTmpfs Type = "tmpfs"
	// TypeNamedPipe is the type for mounting Windows named pipes
	TypeNamedPipe Type = "npipe"
)

// Mount represents a mount (volume).
type Mount struct {
	Type Type // `json:"type,omitempty"`
	// Source specifies the name of the mount. Depending on mount type, this
	// may be a volume name or a host path, or even ignored.
	// Source is not supported for tmpfs (must be an empty value)
	Source      string      // `json:"source,omitempty"`
	Target      string      // `json:"target,omitempty"`
	ReadOnly    bool        // `json:"read_only,omitempty"`
	Consistency Consistency // `json:"consistency,omitempty"`

	BindOptions   *BindOptions   // `json:"bind_options,omitempty"`
	VolumeOptions *VolumeOptions // `json:"volume_options,omitempty"`
	TmpfsOptions  *TmpfsOptions  // `json:"tmpfs_options,omitempty"`
}

// Propagation represents the propagation of a mount.
type Propagation string

const (
	// PropagationRPrivate RPRIVATE
	PropagationRPrivate Propagation = "rprivate"
	// PropagationPrivate PRIVATE
	PropagationPrivate Propagation = "private"
	// PropagationRShared RSHARED
	PropagationRShared Propagation = "rshared"
	// PropagationShared SHARED
	PropagationShared Propagation = "shared"
	// PropagationRSlave RSLAVE
	PropagationRSlave Propagation = "rslave"
	// PropagationSlave SLAVE
	PropagationSlave Propagation = "slave"
)

// Propagations is the list of all valid mount propagations
var Propagations = []Propagation{
	PropagationRPrivate,
	PropagationPrivate,
	PropagationRShared,
	PropagationShared,
	PropagationRSlave,
	PropagationSlave,
}

// Consistency represents the consistency requirements of a mount.
type Consistency string

const (
	// ConsistencyFull guarantees bind mount-like consistency
	ConsistencyFull Consistency = "consistent"
	// ConsistencyCached mounts can cache read data and FS structure
	ConsistencyCached Consistency = "cached"
	// ConsistencyDelegated mounts can cache read and written data and structure
	ConsistencyDelegated Consistency = "delegated"
	// ConsistencyDefault provides "consistent" behavior unless overridden
	ConsistencyDefault Consistency = "default"
)

// BindOptions defines options specific to mounts of type "bind".
type BindOptions struct {
	Propagation  Propagation // `json:"propagation,omitempty"`
	NonRecursive bool        // `json:"non_recursive,omitempty"`
}

// VolumeOptions represents the options for a mount of type volume.
type VolumeOptions struct {
	NoCopy       bool              // `json:"no_copy,omitempty"`
	Labels       map[string]string // `json:"labels,omitempty"`
	DriverConfig *Driver           // `json:"driver_config,omitempty"`
}

// Driver represents a volume driver.
type Driver struct {
	Name    string            // `json:"name,omitempty"`
	Options map[string]string // `json:"options,omitempty"`
}

// TmpfsOptions defines options specific to mounts of type "tmpfs".
type TmpfsOptions struct {
	// Size sets the size of the tmpfs, in bytes.
	//
	// This will be converted to an operating system specific value
	// depending on the host. For example, on linux, it will be converted to
	// use a 'k', 'm' or 'g' syntax. BSD, though not widely supported with
	// docker, uses a straight byte value.
	//
	// Percentages are not supported.
	SizeBytes int64 // `json:"size_bytes,omitempty"`
	// Mode of the tmpfs upon creation
	Mode os.FileMode // `json:"mode,omitempty"`

	// TODO(stevvooe): There are several more tmpfs flags, specified in the
	// daemon, that are accepted. Only the most basic are added for now.
	//
	// From https://github.com/moby/sys/blob/mount/v0.1.1/mount/flags.go#L47-L56
	//
	// var validFlags = map[string]bool{
	// 	"":          true,
	// 	"size":      true, X
	// 	"mode":      true, X
	// 	"uid":       true,
	// 	"gid":       true,
	// 	"nr_inodes": true,
	// 	"nr_blocks": true,
	// 	"mpol":      true,
	// }
	//
	// Some of these may be straightforward to add, but others, such as
	// uid/gid have implications in a clustered system.
}
