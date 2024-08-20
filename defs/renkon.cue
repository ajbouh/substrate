package defs

live_edit: "renkon": bool

enable: "renkon": true

imagespecs: "renkon": {
  image: "\(#var.image_prefix)renkon"
  build: dockerfile: "images/renkon/Dockerfile"
}

services: "renkon": {
  instances: [string]: {
    url_prefix: "/renkon"
  }
}
