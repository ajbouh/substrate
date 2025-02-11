package defs

import (
  command "github.com/ajbouh/substrate/defs/substrate:command"
)

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
        "/app/": { source: "\(#var.host_source_directory)/images/diarizer", mode: ["ro"] }
      }
    }
  }
}

commands: "diarizer": {
  diarize: {
    meta: {
      "#/data/parameters/audio_data": {type: "string"}

      "#/data/returns/timespans": {type: "object"}
    }
    command.ViaHTTP
    msg: http: request: {
      method: "POST"
      url: "/diarizer/v1/diarize"
      headers: "Content-Type": ["application/json"]
      body: {}
    }
  }
}
