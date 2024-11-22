package defs

enable: "spaceview": true

imagespecs: "spaceview": {
  image: "\(#var.image_prefix)spaceview"
  build: dockerfile: "images/spaceview/Dockerfile"
}

services: "spaceview": {
  instances: [string]: {
    environment: {
      SUBSTRATE_URL_PREFIX: string
      SPACE_ID: parameters.space.value
    }
    ephemeral: true
    url_prefix: environment.SUBSTRATE_URL_PREFIX

    parameters: space: type: "space"
  }
}
