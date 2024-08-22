package defs
enable: "karashi-renkon": true
imagespecs: "karashi-renkon": {
  image: "\(#var.image_prefix)karashi-renkon"
  build: dockerfile: "images/karashi-renkon/Dockerfile"
}
services: "miniService": {
    spawn: {
    }
}
