package defs

live_edit: "bb-ui": bool

enable: "bb-ui": true

imagespecs: "bb-ui": {}

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

if live_edit["bb-ui"] {
  imagespecs: "bb-ui": build: target: "dev"
}
