package main

import (
	"bytes"
	"net/http"
)

type bufferedResponseWriter struct {
	b          bytes.Buffer
	statusCode int
	header     http.Header
}

func newBufferedResponseWriter() *bufferedResponseWriter {
	return &bufferedResponseWriter{
		header: http.Header{},
	}
}

func (b *bufferedResponseWriter) Header() http.Header {
	return b.header
}

func (b *bufferedResponseWriter) WriteHeader(statusCode int) {
	b.statusCode = statusCode
}

func (b *bufferedResponseWriter) Write(data []byte) (int, error) {
	return b.b.Write(data)
}
