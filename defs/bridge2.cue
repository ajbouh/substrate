package defs

enable: "bridge2": true

// HACK force amd64 because we need to build on apple silicon but copy .so files and we're hard-coding the paths like n00bs.
#out: "docker_compose": services: "bridge2": platform: "linux/amd64"

imagespecs: "bridge2": {}

services: "bridge2": {
  spawn: {
    parameters: sessions: type: "space"
    environment: {
      BRIDGE_TRANSCRIBE_URL: "http://substrate:8080/faster-whisper/v1/transcribe"
      BRIDGE_TRANSLATE_URL: "http://substrate:8080/seamlessm4t/v1/transcribe"
      BRIDGE_SESSIONS_DIR: "/spaces/sessions/tree"
    }
  }
}

live_edit: "bridge2": bool

if live_edit["bridge2"] {
  services: "bridge2": spawn: {
    mounts: [
      { source: "\(#var.host_source_directory)/images/bridge2/ui", destination: "/go/src/github.com/ajbouh/substrate/images/bridge2/ui", mode: "ro" },
      { source: "\(#var.host_source_directory)/images/bridge2/assistant/prompts", destination: "/go/src/github.com/ajbouh/substrate/images/bridge2/assistant/prompts", mode: "ro" },
    ]
  }
}
