package defs

enable: "webrtc-events": true

imagespecs: "webrtc-events": {
  image: "\(#var.image_prefix)webrtc-events"
  build: dockerfile: "images/webrtc-events/Dockerfile"
}

services: "webrtc-events": {
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

live_edit: "webrtc-events": bool

if live_edit["webrtc-events"] {
  services: "webrtc-events": spawn: {
    mounts: {
      "/go/src/github.com/ajbouh/substrate/images/webrtc-events/ui": { source: "\(#var.host_source_directory)/images/webrtc-events/ui", mode: ["ro"] }
    }
  }
}
