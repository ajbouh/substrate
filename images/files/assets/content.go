package assets

import (
	"bytes"
	"embed"
)

// content holds our static web server content.
//go:embed nbpreview/css/* nbpreview/css/vendor/* nbpreview/js/* nbpreview/js/vendor/*
var Content embed.FS

//go:embed nbpreview/index.html
var nbpreviewSource []byte

func RenderNBPreview(baseurl []byte, data []byte) []byte {
	return bytes.ReplaceAll(
		bytes.ReplaceAll(nbpreviewSource, []byte("__DATA__"), data),
		[]byte("__URL__"),
		baseurl,
	)
}
