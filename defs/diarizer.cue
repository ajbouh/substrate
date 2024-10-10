package defs

enable: "diarizer": true

imagespecs: "diarizer": {
  image: "\(#var.image_prefix)diarizer"
  build: dockerfile: "images/diarizer/Dockerfile"
}

live_edit: "diarizer": bool

services: "diarizer": {
  instances: [string]: {
    environment: {
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
      PORT: string
    }

    command: ["--port", environment.PORT]

    if live_edit["diarizer"] {
      mounts: {
        "/app/": { source: "\(#var.host_source_directory)/images/diarizer", mode: "ro" }
      }
    }
  }
}

commands: "diarizer": {
  diarize: {
    description: ""
    parameters: {
      audio_data: type: "string"
    }
    returns: {
      timespans: type: "object"
    }
    run: http: {
      "parameters": {
        for parameter, v in parameters {
          (parameter): path: "request.body.\(parameter)"
        }
      }
      "returns": {
        for return, v in returns {
          (return): path: "response.body.\(return)"
        }
      }
      request: {
        method: "POST"
        url: "/diarizer/v1/diarize"
        headers: "Content-Type": ["application/json"]
        body: {}
      }
    }
  }
}
