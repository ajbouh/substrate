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
      mounts: {
        "/app/docs": { source: "\(#var.host_source_directory)/images/bb-ui/docs", mode: ["rw"] }
        "/app/observablehq.config.ts": { source: "\(#var.host_source_directory)/images/bb-ui/observablehq.config.ts", mode: ["ro"] }
      }
    }
  }
}
