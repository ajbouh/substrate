package defs

enable: "msgtun": true

imagespecs: "msgtun": {
  image: "\(#var.image_prefix)msgtun"
  build: dockerfile: "images/msgtun/Dockerfile"
}

services: "msgtun": {
  instances: [string]: {
    environment: {
      SUBSTRATE_URL_PREFIX: string
    }
    url_prefix: environment.SUBSTRATE_URL_PREFIX
  }
}

live_edit: "msgtun": bool
