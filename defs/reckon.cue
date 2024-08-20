package defs

live_edit: "reckon": bool

enable: "reckon": true

imagespecs: "reckon": {
  image: "\(#var.image_prefix)reckon"
  build: dockerfile: "images/reckon/Dockerfile"
  if live_edit["reckon"] {
    build: target: "dev"
  }
}

services: "reckon": {
  instances: [string]: {
    if live_edit["reckon"] {
      mounts: {
        "/app/docs": { source: "\(#var.host_source_directory)/images/reckon/docs", mode: "rw" },
        "/app/observablehq.config.ts": { source: "\(#var.host_source_directory)/images/reckon/observablehq.config.ts", mode: "ro" },
      }
    }
  }
}

