package defs

enable: "mdns": true

live_edit: "mdns": bool

imagespecs: "mdns": {
  image: "\(#var.image_prefix)mdns"
  build: dockerfile: "images/mdns/Dockerfile"
}

daemons: "mdns": {
  environment: {}

  #systemd_quadlet_units: {
    "mdns.container": {
      Install: {
        WantedBy: ["multi-user.target", "default.target"]
      }
      Container: {
        Network: ["host"]
      }
    }
  }
}

