package defs

enable: "source": true

imagespecs: "source": {
  image: "\(#var.image_prefix)source"
  build: dockerfile: "images/source/Dockerfile"
}
