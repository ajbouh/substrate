package defs

enable: "screenshot": true

imagespecs: "screenshot": {
  image: "\(#var.image_prefix)screenshot"
  build: dockerfile: "images/screenshot/Dockerfile"
}

services: "screenshot": {
  instances: [string]: {
    init: true
  }
}
