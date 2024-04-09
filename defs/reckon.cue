package defs

live_edit: "reckon": bool

enable: "reckon": true

imagespecs: "reckon": {}

services: "reckon": {
  instances: [string]: {
    if live_edit["reckon"] {
      mounts: [
        { source: "\(#var.host_source_directory)/images/reckon/docs", destination: "/app/docs", mode: "rw" },
        { source: "\(#var.host_source_directory)/images/reckon/observablehq.config.ts", destination: "/app/observablehq.config.ts", mode: "ro" },
      ]
    }
  }
}

if live_edit["reckon"] {
  imagespecs: "reckon": build: target: "dev"
}
