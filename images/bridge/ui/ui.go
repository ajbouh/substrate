package ui

import (
	"embed"

	"tractor.dev/toolkit-go/engine/fs"
)

//go:embed *
var dir embed.FS

var Dir = fs.LiveDir(dir)
