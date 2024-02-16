package defs
enable: "miniService": true
live_edit: "miniService": true
imagespecs: "miniService": {}
lenses: "miniService": {
  spawn: {
    if live_edit["miniService"] {
      mounts: [
        { source: "\(#var.host_source_directory)/images/miniService", destination: "/app", mode: "rw" },
      ]
    }
  }
}
