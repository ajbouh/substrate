package lenses

import (
  lens_ui "github.com/ajbouh/substrate/lenses/ui:lens"
  lens_datasette "github.com/ajbouh/substrate/lenses/datasette:lens"
  lens_fastcups "github.com/ajbouh/substrate/lenses/fastcups:lens"
  lens_files "github.com/ajbouh/substrate/lenses/files:lens"
  lens_gitexport "github.com/ajbouh/substrate/lenses/git-export:lens"
  lens_gotty "github.com/ajbouh/substrate/lenses/gotty:lens"
  lens_jupyverse "github.com/ajbouh/substrate/lenses/jupyverse:lens"
  lens_redbean "github.com/ajbouh/substrate/lenses/redbean:lens"
  lens_screenshot "github.com/ajbouh/substrate/lenses/screenshot:lens"
  // lens_silverbullet "github.com/ajbouh/substrate/lenses/silverbullet:lens"
  lens_substrate "github.com/ajbouh/substrate/lenses/substrate:lens"
  lens_visualizer "github.com/ajbouh/substrate/lenses/visualizer:lens"
)

#var: {
  namespace: string
}

let all = [
  lens_substrate,
  lens_ui,
  lens_files,
  lens_datasette,
  lens_fastcups,
  lens_redbean,
  lens_gitexport,
  lens_gotty,
  lens_jupyverse,
  lens_screenshot,
  // lens_silverbullet,
  lens_visualizer,
]

for #lens in all {
  "\(#lens.name)": #lens & {
    if #lens.#build != null {
      #build: dockerfile: "lenses/\(#lens.name)/Dockerfile"

      spawn: jamsocket: service: "\(#var.namespace)-\(#lens.name)"
    }

    // TODO 
    // #deploy: dockerfile: lenses/Dockerfile

  }
}
