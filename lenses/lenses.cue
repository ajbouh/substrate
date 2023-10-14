package lenses

import (
  lens_ui "github.com/ajbouh/substrate/lenses/ui:lens"
  lens_files "github.com/ajbouh/substrate/lenses/files:lens"
  lens_gotty "github.com/ajbouh/substrate/lenses/gotty:lens"
  lens_screenshot "github.com/ajbouh/substrate/lenses/screenshot:lens"
  // lens_silverbullet "github.com/ajbouh/substrate/lenses/silverbullet:lens"
  lens_substrate "github.com/ajbouh/substrate/lenses/substrate:lens"
  lens_visualizer "github.com/ajbouh/substrate/lenses/visualizer:lens"
)

#var: {
  namespace: string
  image_prefix: string
}

let all = [
  lens_substrate,
  lens_ui,
  lens_files,
  lens_gotty,
  lens_screenshot,
  // lens_silverbullet,
  lens_visualizer,
]

for #lens in all {
  "\(#lens.name)": #lens & {
    if #lens.#build != null {
      #build: dockerfile: string | *"lenses/\(#lens.name)/Dockerfile"

      spawn: jamsocket: {
        service: "\(#var.namespace)-\(#lens.name)"
        image: "\(#var.image_prefix)\(#lens.name)"
      }
    }

    // TODO 
    // #deploy: dockerfile: lenses/Dockerfile

  }
}
