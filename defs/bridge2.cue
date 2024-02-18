package defs

enable: "bridge2": true

live_edit: "bridge2": bool

// HACK force amd64 because we need to build on apple silicon but copy .so files and we're hard-coding the paths like n00bs.
#out: "docker_compose": services: "bridge2": platform: "linux/amd64"

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
      BRIDGE_CHROMESTAGE_CHROMEDP_URL: "http://substrate:8080/chromestage",
      BRIDGE_CHROMESTAGE_UI_URL: "\(ORIGIN)/chromestage/vnc",
      ORIGIN: string
    }
  }
}
