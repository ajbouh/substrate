package eventfs

import (
	"io"
	"io/fs"
	"log/slog"
	"strings"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type roDir struct {
	name string

	readDirCursor int

	events  []event.Event
	entries []filePayloadFields
}

var _ (fs.File) = (*roDir)(nil)
var _ (fs.ReadDirFile) = (*roDir)(nil)

type filePayloadFields struct {
	Path string `json:"path"` // ends with "/" if it's a directory
	Size int64  `json:"size"`
}

// TODO make this a streaming query instead of loading all entries into memory at once.

// ReadDir reads the contents of the directory and returns
// a slice of up to n DirEntry values in directory order.
// Subsequent calls on the same file will yield further DirEntry values.
//
// If n > 0, ReadDir returns at most n DirEntry structures.
// In this case, if ReadDir returns an empty slice, it will return
// a non-nil error explaining why.
// At the end of a directory, the error is io.EOF.
// (ReadDir must return io.EOF itself, not an error wrapping io.EOF.)
//
// If n <= 0, ReadDir returns all the DirEntry values from the directory
// in a single slice. In this case, if ReadDir succeeds (reads all the way
// to the end of the directory), it returns the slice and a nil error.
// If it encounters an error before the end of the directory,
// ReadDir returns the DirEntry list read until that point and a non-nil error.
func (e *roDir) ReadDir(n int) ([]fs.DirEntry, error) {
	var r []fs.DirEntry
	if n <= 0 {
		n = len(e.entries) - e.readDirCursor
	}

	for ; n > 0 && e.readDirCursor < len(e.entries); n-- {
		evt := e.entries[e.readDirCursor]
		i := &info{
			name:    evt.Path,
			size:    evt.Size,
			mode:    0644,
			modTime: int64(e.events[e.readDirCursor].ID.Time()),
			isDir:   false,
		}
		if strings.HasSuffix(evt.Path, "/") {
			i.name = strings.TrimSuffix(evt.Path, "/")
			i.isDir = true
			i.mode = 0755
		}
		r = append(r, i)

		e.readDirCursor++
	}

	slog.Info("roDir.ReadDir", "name", e.name, "r", r)
	if len(r) == 0 {
		return nil, io.EOF
	}

	return r, nil
}

func (e *roDir) Close() error {
	slog.Info("roDir.Close", "name", e.name)
	return nil
}

func (e *roDir) Read([]byte) (int, error) {
	slog.Info("roDir.Read", "name", e.name)
	return 0, io.EOF
}

func (e *roDir) Stat() (fs.FileInfo, error) {
	slog.Info("roDir.Stat", "name", e.name)

	var maxTime uint64 = 0
	for i := range e.entries {
		t := e.events[i].ID.Time()
		if t > maxTime {
			maxTime = t
		}
	}

	return &info{
		name:    e.name,
		size:    0,
		mode:    0755,
		modTime: int64(maxTime),
		isDir:   true,
	}, nil
}
