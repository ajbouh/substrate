package extension

import (
	"github.com/ajbouh/substrate/pkg/go-vscode/esbuild"

	"github.com/evanw/esbuild/pkg/api"
)

var JS = &esbuild.BuildRoute{
	BuildOptions: api.BuildOptions{
		Outdir:            "dist/web",
		AbsWorkingDir:     esbuild.WorkingDir(),
		EntryPoints:       []string{"src/web/extension.ts"},
		Bundle:            true,
		Format:            api.FormatCommonJS,
		MinifyWhitespace:  true,
		MinifyIdentifiers: true,
		MinifySyntax:      true,

		Platform: api.PlatformBrowser,
		External: []string{"vscode"},
		LogLevel: api.LogLevelSilent,
		// Node.js global to browser globalThis
		Define: map[string]string{
			"global": "globalThis",
		},
	},
}
