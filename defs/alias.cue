package defs

enable: "alias": true
enable: "~": true

live_edit: "~": bool

imagespecs: "alias": {
  image: "\(#var.image_prefix)alias"
  build: dockerfile: "images/alias/Dockerfile"
}

services: "~": {
  instances: [string]: {
    image_tag: imagespecs["alias"].image
    environment: [string]: string
    url_prefix: environment.SUBSTRATE_URL_PREFIX
  }
}

