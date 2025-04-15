package defs

enable: "webrtc-stream": true

imagespecs: "webrtc-stream": {
  image: "\(#var.image_prefix)webrtc-stream"
  build: dockerfile: "images/webrtc-stream/Dockerfile"
}

services: "webrtc-stream": {
  instances: [string]: {
    parameters: sessions: type: "space"
    parameters: event_prefix: type: "string"

    environment: [string]: string
    url_prefix: environment.SUBSTRATE_URL_PREFIX


    environment: {
      SUBSTRATE_EVENT_COMMANDS_URL: "http://substrate:8080/events;data=\(parameters.sessions.value)/"
      EVENT_PATH_PREFIX: "\(parameters.event_prefix.value)/"
    }
  }
}

live_edit: "webrtc-stream": bool

if live_edit["webrtc-stream"] {
  services: "webrtc-stream": spawn: {
    mounts: {
      "/go/src/github.com/ajbouh/substrate/images/webrtc-stream/ui": { source: "\(#var.host_source_directory)/images/webrtc-stream/ui", mode: ["ro"] }
    }
  }
}
