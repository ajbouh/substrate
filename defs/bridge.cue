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
      BRIDGE_TRANSCRIBE_URL: "http://substrate:8080/faster-whisper/v1/transcribe"
      BRIDGE_TRANSLATE_URL: "http://substrate:8080/seamlessm4t/v1/transcribe"
      BRIDGE_DIARIZE_URL: "http://substrate:8080/diarizer/v1/diarize"
      BRIDGE_SESSION_DIR: "/spaces/sessions/tree/\(parameters.id.value)"
    }
  }
}

live_edit: "bridge": bool

if live_edit["bridge"] {
  services: "bridge": spawn: {
    mounts: [
      { source: "\(#var.host_source_directory)/images/bridge/ui", destination: "/go/src/github.com/ajbouh/substrate/images/bridge/ui", mode: "ro" },
      { source: "\(#var.host_source_directory)/images/bridge/assistant/prompts", destination: "/go/src/github.com/ajbouh/substrate/images/bridge/assistant/prompts", mode: "ro" },
    ]
  }
}
