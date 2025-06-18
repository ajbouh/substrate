package storeio

import (
	"bytes"
	"io"
)

type bytesReadSeekCloser struct {
	*bytes.Reader
}

var _ io.ReadSeekCloser = (*bytesReadSeekCloser)(nil)
var _ io.WriterTo = (*bytesReadSeekCloser)(nil)

func (bytesReadSeekCloser) Close() error { return nil }

func NewReadSeekCloserForBytes(data []byte) io.ReadSeekCloser {
	return &bytesReadSeekCloser{bytes.NewReader(data)}
}
