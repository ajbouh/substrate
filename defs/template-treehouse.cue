package defs

enable: "template-treehouse": true

imagespecs: "template-treehouse": {
  image: "\(#var.image_prefix)template-treehouse"
  build: dockerfile: "images/template-treehouse/Dockerfile"
}
