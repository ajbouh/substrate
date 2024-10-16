package defs

enable: "styletts2": false

live_edit: "styletts2": bool

imagespecs: "styletts2": {
  image: "\(#var.image_prefix)styletts2"
  build: dockerfile: "images/styletts2/Dockerfile"
}

resourcedirs: "huggingface:model:yl4579/StyleTTS2-LibriTTS:d2ca3f14cf019cd2da653c74564e04f8e1f5c5ab": _

services: "styletts2": {
  instances: [string]: {
    resourcedirs: {
      model: "huggingface:model:yl4579/StyleTTS2-LibriTTS:d2ca3f14cf019cd2da653c74564e04f8e1f5c5ab"
    }

    environment: {
      MODEL: "/res/model/huggingface/local"
    }

    command: [
      "--log-level", "debug",
      "--port", environment.PORT,
      "--reload", "--reload-dir", "/app",
      "--access-log",
    ]

    if live_edit["styletts2"] {
      mounts: {
        "/app/": { source: "\(#var.host_source_directory)/images/styletts2", mode: ["ro"] }
      }
    }
  }
}
