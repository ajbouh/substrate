package defs

enable: "navigator": true

imagespecs: "navigator": {
  image: "\(#var.image_prefix)navigator"
  build: dockerfile: "images/navigator/Dockerfile"
}
