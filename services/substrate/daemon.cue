package daemon

import (
  "encoding/json"
  "strings"

  lens "github.com/ajbouh/substrate/services:lens"
)

#var: {
  "namespace": string
  "image": string

  "lenses": {[string]: lens}
  "session_secret": string
  "internal_port":  int
  "origin" ?:  string

  "host_docker_socket": string

  "bind_mounts": [...{
    source: string
    destination: string
  }]
}

name: "substrate"

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
  PORT: string | *"\(#var.internal_port)"
  SUBSTRATE_DB: "/var/lib/substrate/substrate.sqlite"
  if #var.origin != _|_ {
    ORIGIN: #var.origin
  }
  LENSES: json.Marshal(#var.lenses)

  // #var.substratefs.#out.environment

  EXTERNAL_UI_HANDLER ?: string

  // TAILSCALE_HOSTNAME ?: string
  // TAILSCALE_STATE_DIR ?: string

  #docker_host_socket: "/var/run/docker.sock"

  DOCKER_HOST: "unix://\(#docker_host_socket)"

  if len(#var.bind_mounts) > 0 {
    SUBSTRATE_SERVICE_DOCKER_MOUNTS: strings.Join([
      for bind in #var.bind_mounts {
        "\(bind.source):\(bind.destination)"
      }
    ], ",")
  }
}

mounts: [
  {source: "\(#var.namespace)-substrate_data", destination: "/var/lib/substrate"},
  {source: #var.host_docker_socket, destination: environment.#docker_host_socket},
]

// #docker_compose_service: network_mode: "host"

#podman_quadlet_container: {
  Unit: {
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
      "\(#Environment.PORT):\(#Environment.PORT)",
    ]
    // Pull: "never"
    EnvironmentFile: "substrate.env"
    #Environment: {
      environment

      DEBUG: "1"
      PORT: "2280"
      SUBSTRATE_DB: "/var/lib/substrate/substrate.sqlite"
      ORIGIN: "http://127-0-0-1.my.local-ip.co:\(#Environment.PORT)"
      SESSION_SECRET: "NhnxMMlvBM7PuNgZ6sAaSqnkoAso8LlMBqnHZsQjxDFoclD5RREDRROk"
      LENSES: json.Marshal(#var.lenses)
    }
  }
}
