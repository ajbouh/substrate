package daemon

import (
  "encoding/json"
  "strings"

  lens "github.com/ajbouh/substrate/services:lens"
)

#var: {
  "namespace": string
  "lenses": {[string]: lens}
  "session_secret": string
  "image": string
  "internal_port":  int
  "origin" ?:  string

  "host_plane_data_dir": string | *"/opt/planedrone/shared"
  "bind_mounts": [...{
    source: string
    destination: string
  }]
}

name: "substrate"

let plane_data_dir = "/system/shared"
let plane_docker_socket = "/var/run/docker.sock"

secrets: {
  SESSION_SECRET: #var.session_secret
}

build: {
  dockerfile: "services/substrate/Dockerfile"
  image: #var.image
}

#host: string

environment: {
  DEBUG: "1"
  PORT: "\(#var.internal_port)"
  SUBSTRATE_DB: "/var/lib/substrate/substrate.sqlite"
  if #var.origin != _|_ {
    ORIGIN: #var.origin
  }
  LENSES: json.Marshal(#var.lenses)

  // #var.substratefs.#out.environment

  // PLANE_DRONE_SUBSTRATEFS_MOUNTPOINT: #var.plane_drone_substratefs_mountpoint

  EXTERNAL_UI_HANDLER ?: string

  // TAILSCALE_HOSTNAME ?: string
  // TAILSCALE_STATE_DIR ?: string

  // RUST_LOG: string | *"info,sqlx=warn,rustls=off"
  // RUST_LOG: "info,bollard::docker=debug,sqlx=warn,rustls=off"
  // RUST_LOG: "debug"
  // RUST_BACKTRACE: "full"
  // PLANE_CLUSTER_DOMAIN: "-127-0-0-1.52-0-56-137.sslip.io"
  // PLANE_CLUSTER_DOMAIN: "my.local-ip.co"
  PLANE_CLUSTER_DOMAIN: string
  PLANE_AGENT__IP: string
  PLANE_DATA_DIR: plane_data_dir
  // PLANE_DB_PATH: "\(plane_data_dir)/state.db"
  // PLANE_CERT__KEY_PATH: "\(plane_data_dir)/cert.key"
  // PLANE_CERT__CERT_PATH: "\(plane_data_dir)/cert.pem"
  PLANE_ACME__ADMIN_EMAIL: "paul@driftingin.space"
  PLANE_ACME__SERVER: "https://acme-v02.api.letsencrypt.org/directory"
  // PLANE_AGENT__IP__API: "https://api.ipify.org"
  // PLANE_AGENT__IP: external.tailscale.drone_ip
  PLANE_AGENT__DOCKER__CONNECTION__SOCKET: plane_docker_socket

  PLANE_AGENT__DOCKER__EXTRA_HOSTS: string
  NATS_PORT: string
  PLANE_PROXY__HTTP_PORT: string
  PLANE_PROXY__HTTPS_PORT: string

  if len(#var.bind_mounts) > 0 {
    PLANE_AGENT__DOCKER__BINDS: strings.Join([
      for bind in #var.bind_mounts {
        "\(bind.source):\(bind.destination)"
      }
    ], ",")
  }
  PLANE_PROXY__BIND_IP: "0.0.0.0"
}

mounts: [
  {source: "substrate_data", destination: "/var/lib/substrate"},
  {source: "/var/run/podman/podman.sock", destination: plane_docker_socket},
  {source: "plane_data", destination: plane_data_dir},
]

#podman_quadlet_container: {
  Unit: {
    // TODO not everything needs this ... should be a parameter...
    Requires: ["podman.socket"]
    After: ["podman.socket"]
  }
  Install: {
    WantedBy: ["multi-user.target"]
  }
  Container: {
    ContainerName: "daemon-\(name)"
    Image: #var.image
    SecurityLabelDisable: true
    PublishPort: [
      // To make localhost forwarding work (e.g. qemu, publish on the same port)
      "\(#Environment.PLANE_PROXY__HTTP_PORT):\(#Environment.PLANE_PROXY__HTTP_PORT)",
      "\(#Environment.PORT):\(#Environment.PORT)",
      "\(#Environment.NATS_PORT):\(#Environment.NATS_PORT)"
    ]
    // Pull: "never"
    EnvironmentFile: "substrate.env"
    #Environment: {
      environment

      DEBUG: "1"
      PORT: "2280"
      SUBSTRATE_DB: "/var/lib/substrate/substrate.sqlite"
      // PLANE_DRONE_SUBSTRATEFS_MOUNTPOINT: "/mnt/substrate"
      ORIGIN: "http://127-0-0-1.my.local-ip.co:\(#Environment.PORT)"
      PLANE_CLUSTER_DOMAIN: "127-0-0-1.my.local-ip.co"
      // PLANE_AGENT__IP: "127.0.0.1"
      PLANE_AGENT__IP: "127.0.0.1"
      PLANE_AGENT__DOCKER__CONNECTION__SOCKET: "/var/run/docker.sock"
      NATS_PORT: "4222"
      PLANE_AGENT__DOCKER__EXTRA_HOSTS: "127-0-0-1.my.local-ip.co:10.0.2.15"
      PLANE_PROXY__BIND_IP: "0.0.0.0"
      PLANE_PROXY__HTTP_PORT: "2281"
      PLANE_PROXY__HTTPS_PORT: "4333"
      SESSION_SECRET: "NhnxMMlvBM7PuNgZ6sAaSqnkoAso8LlMBqnHZsQjxDFoclD5RREDRROk"
      LENSES: json.Marshal(#var.lenses)
    }
  }
}
