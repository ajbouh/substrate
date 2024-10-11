package defs

enable: "command-panel": true

live_edit: "command-panel": bool

imagespecs: "command-panel": {
  image: "\(#var.image_prefix)command-panel"
  build: dockerfile: "images/command-panel/Dockerfile"
  if live_edit["command-panel"] {
    build: target: "dev"
  }
}

services: "command-panel": {
  instances: [string]: {
    url_prefix: "/command-panel"

    if live_edit["command-panel"] {
      mounts: {
        "/app/static": { source: "\(#var.host_source_directory)/images/command-panel/static", mode: ["ro"] },
        "/app/src": { source: "\(#var.host_source_directory)/images/command-panel/src", mode: ["ro"] },
      }
    }
  }
}
