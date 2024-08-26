package defs

live_edit: "primers": bool

enable: "primers": true

imagespecs: "primers": {
  image: "\(#var.image_prefix)primers"
  build: dockerfile: "images/primers/Dockerfile"
  if live_edit["primers"] {
    build: target: "dev"
  }
}

services: "primers": {
  instances: [string]: {
    if live_edit["primers"] {
      mounts: {
        "/app/docs": { source: "\(#var.host_source_directory)/images/primers/docs", mode: "rw" }
        "/app/observablehq.config.ts": { source: "\(#var.host_source_directory)/images/primers/observablehq.config.ts", mode: "ro" }
      }
    }
  }
}

