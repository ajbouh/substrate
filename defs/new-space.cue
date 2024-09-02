package defs

enable: "new-space": true

imagespecs: "new-space": {
  image: "\(#var.image_prefix)new-space"
  build: dockerfile: "images/new-space/Dockerfile"
}
