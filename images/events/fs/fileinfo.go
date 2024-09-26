package eventfs

import (
	"io/fs"
	"time"
)

// Based on https://github.com/progrium/httpfs/blob/main/httpfs.go
// MIT License, Jeff Lindsay

type info struct {
	name    string
	size    int64
	mode    uint
	modTime int64
	isDir   bool
}

var _ fs.FileInfo = (*info)(nil)
var _ fs.DirEntry = (*info)(nil)

func (i *info) Name() string       { return i.name }
func (i *info) Size() int64        { return i.size }
func (i *info) ModTime() time.Time { return time.UnixMilli(i.modTime) }
func (i *info) IsDir() bool        { return i.isDir }
func (i *info) Sys() any           { return nil }
func (i *info) Mode() fs.FileMode {
	if i.IsDir() {
		return fs.FileMode(i.mode) | fs.ModeDir
	}
	return fs.FileMode(i.mode)
}

// these allow it to act as DirEntry as well
func (i *info) Info() (fs.FileInfo, error) {
	return i, nil
}
func (i *info) Type() fs.FileMode {
	return i.Mode()
}
