package defs

enable: "bridge": true

imagespecs: "bridge": {
  image: "\(#var.image_prefix)bridge"
  build: dockerfile: "images/bridge/Dockerfile"
}

services: "bridge": {
  instances: [string]: {
    parameters: sessions: type: "space"
    parameters: id: type: "string"

    environment: [string]: string
    url_prefix: environment.SUBSTRATE_URL_PREFIX


    environment: {
      SUBSTRATE_EVENT_COMMANDS_URL: "http://substrate:8080/events;data=\(parameters.sessions.value)/"
      SUBSTRATE_EVENT_WRITER_URL: "http://substrate:8080/events;data=\(parameters.sessions.value)/tree/fields/bridge/\(parameters.id.value)"
      SUBSTRATE_STREAM_URL_PATH: "/events;data=\(parameters.sessions.value)/stream/events"
      BRIDGE_EVENT_PATH_PREFIX: "/bridge/\(parameters.id.value)/"
      BRIDGE_COMMANDS_URL: "http://substrate:8080/substrate/v1/msgindex"
      BRIDGE_TRANSCRIBE_COMMAND: "faster-whisper/transcribe-data"
      BRIDGE_TRANSLATE_COMMAND: "seamlessm4t/translate"
      BRIDGE_DIARIZE_COMMAND: "diarizer/diarize"
      BRIDGE_SESSION_ID: "\(parameters.id.value)"
      BRIDGE_SESSION_DIR: "/spaces/sessions/\(parameters.id.value)"
    }
  }
}

live_edit: "bridge": bool

if live_edit["bridge"] {
  services: "bridge": spawn: {
    mounts: {
      "/go/src/github.com/ajbouh/substrate/images/bridge/ui": { source: "\(#var.host_source_directory)/images/bridge/ui", mode: ["ro"] }
      "/go/src/github.com/ajbouh/substrate/images/bridge/assistant/prompts": { source: "\(#var.host_source_directory)/images/bridge/assistant/prompts", mode: ["ro"] }
    }
  }
}
