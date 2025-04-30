package eventfs

import (
	"io"
	"io/fs"
	"log/slog"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type roDataFile struct {
	name  string
	event *event.Event

	rsc io.ReadSeekCloser
}

var _ fs.File = (*roDataFile)(nil)
var _ io.Seeker = (*roDataFile)(nil)

func (e *roDataFile) Close() error {
	slog.Info("roDataFile.Close", "name", e.name)
	return e.rsc.Close()
}

func (e *roDataFile) Read(b []byte) (int, error) {
	slog.Info("roDataFile.Read", "name", e.name)
	return e.rsc.Read(b)
}

// Seeker is the interface that wraps the basic Seek method.
//
// Seek sets the offset for the next Read or Write to offset,
// interpreted according to whence:
// [SeekStart] means relative to the start of the file,
// [SeekCurrent] means relative to the current offset, and
// [SeekEnd] means relative to the end
// (for example, offset = -2 specifies the penultimate byte of the file).
// Seek returns the new offset relative to the start of the
// file or an error, if any.
//
// Seeking to an offset before the start of the file is an error.
// Seeking to any positive offset may be allowed, but if the new offset exceeds
// the size of the underlying object the behavior of subsequent I/O operations
// is implementation-dependent.
func (e *roDataFile) Seek(offset int64, whence int) (int64, error) {
	slog.Info("roDataFile.Seek", "name", e.name, "offset", offset, "whence", whence)
	return e.rsc.Seek(offset, whence)
}

func (e *roDataFile) Stat() (fs.FileInfo, error) {
	slog.Info("roDataFile.Stat", "name", e.name)
	var size int64
	if e.event.DataSize != nil {
		size = int64(*e.event.DataSize)
	}
	return &info{
		name:    e.name,
		size:    size,
		mode:    0644,
		modTime: int64(e.event.ID.Time()),
		isDir:   false,
	}, nil
}
