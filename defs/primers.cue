package defs

live_edit: "primers": bool

enable: "primers": true

imagespecs: "primers": {}

services: "primers": {
  instances: [string]: {
    if live_edit["primers"] {
      mounts: [
        { source: "\(#var.host_source_directory)/images/primers/docs", destination: "/app/docs", mode: "rw" },
        { source: "\(#var.host_source_directory)/images/primers/observablehq.config.ts", destination: "/app/observablehq.config.ts", mode: "ro" },
      ]
    }
  }
}

if live_edit["primers"] {
  imagespecs: "primers": build: target: "dev"
}
