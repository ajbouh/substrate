package defs

enable: "files": true

imagespecs: "files": {
  image: "\(#var.image_prefix)files"
  build: dockerfile: "images/files/Dockerfile"
}

services: "files": {
  instances: [string]: {
    environment: {
      SUBSTRATE_URL_PREFIX: string
      UPLOADS: "true"
    }
    ephemeral: true
    url_prefix: environment.SUBSTRATE_URL_PREFIX

    parameters: data: type: "space"
  }
}

live_edit: "files": bool

if live_edit["files"] {
  services: "files": instances: [string]: {
    mounts: {
      "/go/src/github.com/ajbouh/substrate/images/files/assets": { source: "\(#var.host_source_directory)/images/files/assets", mode: ["ro"] }
    }
  }
}
