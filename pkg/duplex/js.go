package duplex

import (
	"github.com/ajbouh/substrate/pkg/duplex/esbuild"

	"github.com/evanw/esbuild/pkg/api"
)

var JS = &esbuild.BuildRoute{
	BuildOptions: api.BuildOptions{
		AbsWorkingDir: esbuild.WorkingDir(),
		EntryPoints:   []string{"index_browser.ts"},
		// StdinOptions: &esbuild.StdinOptions{...}, to provide inline javascript source
		Outfile:           "duplex.min.js",
		Bundle:            true,
		Format:            api.FormatESModule,
		MinifyWhitespace:  true,
		MinifyIdentifiers: true,
		MinifySyntax:      true,
	},
}
