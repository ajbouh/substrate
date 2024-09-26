package eventfs

import (
	"errors"
	"io"
	"io/fs"
	"log/slog"

	"github.com/ajbouh/substrate/pkg/toolkit/event"
)

type roFile struct {
	name  string
	event *event.Event

	offset int64
}

var _ fs.File = (*roFile)(nil)
var _ io.Seeker = (*roFile)(nil)

func (e *roFile) Close() error {
	slog.Info("roFile.Close", "name", e.name)
	return nil
}

func (e *roFile) Read(b []byte) (int, error) {
	slog.Info("roFile.Read", "name", e.name)
	read := copy(b, e.event.Payload[e.offset:])
	if read == 0 {
		return read, io.EOF
	}
	e.offset += int64(read)
	return read, nil
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
func (e *roFile) Seek(offset int64, whence int) (int64, error) {
	slog.Info("roFile.Seek", "name", e.name, "offset", offset, "whence", whence)
	var newOffset int64
	switch whence {
	case io.SeekStart:
		newOffset = offset
	case io.SeekCurrent:
		newOffset += offset
	case io.SeekEnd:
		newOffset = int64(len(e.event.Payload)) + offset
	}

	if newOffset < 0 {
		return newOffset, errors.New("offset begins before file starts")
	}

	e.offset = newOffset
	return e.offset, nil
}

func (e *roFile) Stat() (fs.FileInfo, error) {
	slog.Info("roFile.Stat", "name", e.name)
	return &info{
		name:    e.name,
		size:    int64(len(e.event.Payload)),
		mode:    0644,
		modTime: int64(e.event.ID.Time()),
		isDir:   false,
	}, nil
}
