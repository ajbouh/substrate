package defs

live_edit: "bb-ui": bool

enable: "bb-ui": true

imagespecs: "bb-ui": {
  image: "\(#var.image_prefix)bb-ui"
  build: dockerfile: "images/bb-ui/Dockerfile"
  if live_edit["bb-ui"] {
    build: target: "dev"
  }
}

services: "bb-ui": {
  instances: [string]: {
    if live_edit["bb-ui"] {
      mounts: [
        { source: "\(#var.host_source_directory)/images/bb-ui/docs", destination: "/app/docs", mode: "rw" },
        { source: "\(#var.host_source_directory)/images/bb-ui/observablehq.config.ts", destination: "/app/observablehq.config.ts", mode: "ro" },
      ]
    }
  }
}
