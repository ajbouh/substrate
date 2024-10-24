package defs

enable: "primer-scene": true

live_edit: "primer-scene": bool

imagespecs: "primer-scene": {
  image: "\(#var.image_prefix)primer-scene"
  build: dockerfile: "images/primer-scene/Dockerfile"
}

services: "primer-scene": {
  instances: [string]: {
    parameters: {
      d: type: "space"
      mainfile: type: "string"
    }

    environment: {
      PORT: string
      MAINFILE: "/spaces/d/\(parameters.mainfile.value)"
      RENDER_DIR: "/spaces/d/render"
    }

    command: [
      "--log-level", "debug",
      "--port", environment.PORT,
      "--reload", "--reload-dir", "/app",
      "--access-log",
    ]

    if live_edit["primer-scene"] {
      mounts: {
        "/app/": { source: "\(#var.host_source_directory)/images/primer-scene", mode: ["ro"] }
      }
    }
  }
}
