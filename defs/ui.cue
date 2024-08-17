package defs

enable: "ui": true

live_edit: "ui": bool

imagespecs: "ui": {
  image: "\(#var.image_prefix)ui"
  build: dockerfile: "images/ui/Dockerfile"
  if live_edit["ui"] {
    build: target: "dev"
  }
}

services: "ui": {
  instances: [string]: {
    url_prefix: "/ui"

    if live_edit["ui"] {
      mounts: [
        { source: "\(#var.host_source_directory)/images/ui/static", destination: "/app/static", mode: "ro" },
        { source: "\(#var.host_source_directory)/images/ui/src", destination: "/app/src", mode: "ro" },
      ]
    }
  }
}
