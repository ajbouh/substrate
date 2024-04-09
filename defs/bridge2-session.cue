package defs

enable: "bridge2-session": true

// HACK force amd64 because we need to build on apple silicon but copy .so files and we're hard-coding the paths like n00bs.
#out: "docker_compose": services: "bridge2-session": platform: "linux/amd64"

imagespecs: "bridge2-session": {}

services: "bridge2-session": {
  spawn: {
    parameters: sessions: type: "space"
    parameters: id: type: "string"
    environment: {
      BRIDGE_TRANSCRIBE_URL: "http://substrate:8080/faster-whisper/v1/transcribe"
      BRIDGE_TRANSLATE_URL: "http://substrate:8080/seamlessm4t/v1/transcribe"
      BRIDGE_DIARIZE_URL: "http://substrate:8080/diarizer/v1/diarize"
      BRIDGE_SESSION_DIR: "/spaces/sessions/tree/\(parameters.id.value)"
    }
  }
}

live_edit: "bridge2-session": bool

if live_edit["bridge2-session"] {
  services: "bridge2-session": spawn: {
    mounts: [
      { source: "\(#var.host_source_directory)/images/bridge2-session/ui", destination: "/go/src/github.com/ajbouh/substrate/images/bridge2-session/ui", mode: "ro" },
      { source: "\(#var.host_source_directory)/images/bridge2-session/assistant/prompts", destination: "/go/src/github.com/ajbouh/substrate/images/bridge2-session/assistant/prompts", mode: "ro" },
    ]
  }
}
