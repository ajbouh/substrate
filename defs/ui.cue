package defs

enable: "ui": true

live_edit: "ui": bool

imagespecs: "ui": {}

if live_edit["ui"] {
  imagespecs: "ui": build: target: "dev"
}

lenses: "ui": {
  spawn: {
    url_prefix: "/ui"

    if live_edit["ui"] {
      mounts: [
        { source: "\(#var.host_source_directory)/images/ui/static", destination: "/app/static", mode: "ro" },
        { source: "\(#var.host_source_directory)/images/ui/src", destination: "/app/src", mode: "ro" },
      ]
    }
  }
}
