package defs

live_edit: "renkon": bool

enable: "renkon": true

imagespecs: "renkon": {
  image: "\(#var.image_prefix)renkon"
  build: dockerfile: "images/renkon/Dockerfile"
}

services: "renkon": {
  instances: [string]: {
    url_prefix: "/renkon"

    if live_edit["renkon"] {
      mounts: [
        // { source: "\(#var.host_source_directory)/images/renkon/dist", destination: "/go/src/github.com/ajbouh/substrate/images/renkon/dist", mode: "ro" },
      ]
    }
  }
}
