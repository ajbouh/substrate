package defs

enable: "primer-scene": true

live_edit: "primer-scene": bool

imagespecs: "primer-scene": {}

services: "primer-scene": {
  instances: [string]: {
    parameters: {
      d: type: "space"
      mainfile: type: "string"
    }

    environment: {
      PORT: string
      MAINFILE: "/spaces/d/tree/\(parameters.mainfile.value)"
      RENDER_DIR: "/spaces/d/tree/render"
    }

    command: [
      "--log-level", "debug",
      "--port", environment.PORT,
      "--reload", "--reload-dir", "/app",
      "--access-log",
    ]

    if live_edit["primer-scene"] {
      mounts: [
        { source: "\(#var.host_source_directory)/images/primer-scene", destination: "/app/", mode: "ro" },
      ]
    }
  }
}
