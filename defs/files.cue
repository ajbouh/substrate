package defs

enable: "files": true

imagespecs: "files": {}

services: "files": {
  spawn: {
    environment: {
      SUBSTRATE_URL_PREFIX: string
      UPLOADS: "true"
    }
    ephemeral: true
    url_prefix: environment.SUBSTRATE_URL_PREFIX
  }

  spawn: parameters: data: type: "space"
}

live_edit: "files": bool

if live_edit["files"] {
  services: "files": spawn: {
    mounts: [
      { source: "\(#var.host_source_directory)/images/files/assets", destination: "/go/src/github.com/ajbouh/substrate/images/files/assets", mode: "ro" },
    ]
  }
}
