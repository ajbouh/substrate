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
      mounts: [
        { source: "\(#var.host_source_directory)/images/command-panel/static", destination: "/app/static", mode: "ro" },
        { source: "\(#var.host_source_directory)/images/command-panel/src", destination: "/app/src", mode: "ro" },
      ]
    }
  }
}
