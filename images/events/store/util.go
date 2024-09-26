package store

import "io"

type readCloser struct {
	reader io.Reader
	closer io.Closer
}

func (r *readCloser) Read(p []byte) (n int, err error) { return r.reader.Read(p) }
func (r *readCloser) Close() error                     { return r.closer.Close() }

func NewTeeReadCloser(rc io.ReadCloser, w io.Writer) io.ReadCloser {
	tr := io.TeeReader(rc, w)
	return &readCloser{reader: tr, closer: rc}
}

type Digester interface {
	io.Writer
	Sum([]byte) []byte
}
