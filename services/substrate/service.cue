package service

import (
  "encoding/json"

  "github.com/ajbouh/substrate:external"


  lens "github.com/ajbouh/substrate/lenses:lens"
)

#var: {
  "namespace": string
  "lenses": {[string]: lens}
  "session_secret": string
  "internal_port":  int
  "origin" ?:  string

  "plane_drone_substratefs_mountpoint": string

  "host_plane_data_dir": string | *"/opt/planedrone/shared"
  "bind_mounts": [...{
    source: string
    destination: string
  }]
}

name: "substrate"

let plane_data_dir = "/system/shared"
let plane_docker_socket = "/var/run/docker.sock"

build: {
  args: {
    JUICEFS_CE_VERSION: "v1.0.3"
  }
}

secrets: {


  GITHUB_CLIENT_ID: external.github[#var.namespace].GITHUB_CLIENT_ID
  GITHUB_CLIENT_SECRET: external.github[#var.namespace].GITHUB_CLIENT_SECRET

  SESSION_SECRET: #var.session_secret

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


  PLANE_DRONE_SUBSTRATEFS_MOUNTPOINT: #var.plane_drone_substratefs_mountpoint

  EXTERNAL_UI_HANDLER ?: string

  PLANE_CLUSTER_DOMAIN: "my.local-ip.co"
  PLANE_AGENT__IP: string
  PLANE_DATA_DIR: plane_data_dir
  PLANE_ACME__ADMIN_EMAIL: "paul@driftingin.space"
  PLANE_ACME__SERVER: "https://acme-v02.api.letsencrypt.org/directory"
  PLANE_AGENT__DOCKER__CONNECTION__SOCKET: plane_docker_socket
  PLANE_PROXY__BIND_IP: "0.0.0.0"
}


mounts: [
  {source: "substrate_data", destination: "/var/lib/substrate"},

  {source: "/var/run/docker.sock", destination: plane_docker_socket},
  {source: #var.host_plane_data_dir, destination: plane_data_dir},
]


#fly_app: {
  services: [
    {
      internal_port: #var.internal_port
      protocol: "tcp"
      ports: [
        {
          handlers: ["http", "tls"]
          port: "443"
        }
      ]
      tcp_checks: [{ interval: "10s",  timeout: "2s" }]
    },
  ]
}


#nomad_task: {
  #nomad_taskgroup: {
    networks: [
      {
        reservedports: [
          { label: "https", value: 443, hostnetwork: "tailscale" },
        ]
      },
    ]
  }

  resources: {
    cores: 2
    memorymb: 2048
  }
  config: {
    ports: ["https"]
  }
}
