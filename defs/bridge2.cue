package defs

enable: "bridge2": true

live_edit: "bridge2": bool

imagespecs: "bridge2": {}

lenses: "bridge2": {
  spawn: {
    mounts: [
      if live_edit["bridge2"] {
        { source: "\(#var.host_source_directory)/images/bridge2/ui", destination: "/go/src/github.com/ajbouh/substrate/images/bridge2/ui", mode: "ro" },
      }
    ]
    environment: {
      BRIDGE_TRANSCRIBE_URL: "http://substrate:8080/faster-whisper/v1/transcribe",
    }
  }
}
