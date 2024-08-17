package defs

enable: "datasette": false

imagespecs: "datasette": {
  image: "\(#var.image_prefix)datasette"
  build: dockerfile: "images/datasette/Dockerfile"
  build: args: VERSION: "0.64.1"
}

services: "datasette": {
  instances: [string]: {}
  instance: schema: data: type: "space"
}
