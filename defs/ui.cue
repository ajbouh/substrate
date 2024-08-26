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
      mounts: {
        "/app/static": { source: "\(#var.host_source_directory)/images/ui/static", mode: "ro" }
        "/app/src": { source: "\(#var.host_source_directory)/images/ui/src", mode: "ro" }
      }
    }
  }
}
