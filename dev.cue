package dev

import (
  fcos_ignition "github.com/ajbouh/substrate/os:ignition"
  services "github.com/ajbouh/substrate/services"
)

#namespace: string @tag(namespace)
#lenses_expr_path: string | *"" @tag(lenses_expr_path)
#root_source_directory: string | *"" @tag(root_source_directory)
#no_cuda: string | *"" @tag(no_cuda)

#services: services & {
  #var:{
    "namespace": #namespace
    "root_source_directory": #root_source_directory
    "image_prefix": "ghcr.io/ajbouh/substrate:substrate-"
    "no_cuda": #no_cuda != ""
    "lenses_expr_path": #lenses_expr_path
    "secrets": {
      "substrate": {
        "session_secret": "NhnxMMlvBM7PuNgZ6sAaSqnkoAso8LlMBqnHZsQjxDFoclD5RREDRROk"
      }
    }
    "host_docker_socket": string
    "substrate": {
      internal_port: 8080
      "origin": "http://localhost:\(internal_port)"
      "internal_network_name": "substrate"

      "mount_volumes": [
        {source: "\(#namespace)-torch-cache", destination: "/cache/torch"},
        {source: "\(#namespace)-huggingface-cache", destination: "/cache/huggingface"},
      ]
    }
  }
}

"substrateos": {
  let s = #services & {#var: {
    host_docker_socket: "/var/run/podman/podman.sock"
  }}

  "ignition": fcos_ignition
  "systemd": containers: s.#systemd_containers
  "systemd": container_units: s.#systemd_container_units
  "docker_compose": s.#docker_compose
}

// HACK so we can share hardware
#namespace_host_port_offsets: {[string]: int} & {
  "substrate-nobody": 17000
  "substrate-adamb": 18000
  "substrate-ajbouh": 19000
  "substrate-progrium": 20000
  "substrate-yoshikiohshima": 21000
}
#namespace_host_port_offset: #namespace_host_port_offsets[#namespace]

#service_host_port_offset: {[string]: int} & {
  "bridge": 1
  "substrate": 100
  "openvscode-server": 200
}

"substrate": {
  let s = #services & {#var: {
    host_docker_socket: "/var/run/docker.sock"
  }}

  "docker_compose": s.#docker_compose
  "docker_compose": {
    services: {
      // if #lenses["datasette"] != _|_ {
      //   datasette: {
      //     build: dockerfile: "services/\(#lenses["datasette"].name)/Dockerfile"
      //     build: args: #lenses["datasette"].build.args

      //     environment: {
      //       PORT: "8081"
      //     }

      //     ports: [
      //       "18083:\(environment.PORT)",
      //     ]

      //     // Mount the same volumes as substrate, so we can spy on the database
      //     environment: DATASETTE_DB: substrate.environment.SUBSTRATE_DB

      //     volumes: substrate.volumes
      //   }
      // }
      // if #lenses["ui"] != _|_ {
      //   ui: {
      //     build: target: "dev"
      //     build: dockerfile: "services/\(#lenses["ui"].name)/Dockerfile"

      //     volumes: [
      //       "./services/\(#lenses["ui"].name)/static:/app/static:ro",
      //       "./services/\(#lenses["ui"].name)/src:/app/src:ro",
      //     ]

      //     environment: {
      //       if #lenses["ui"].env != _|_ {
      //         #lenses["ui"].env
      //       }

      //       PORT: "8080"
      //       // ORIGIN: substrate.environment.ORIGIN
      //       // ORIGIN: "https://\(#daemons.#var.namespace)-substrate.tail87070.ts.net"
      //       ORIGIN: "http://127-0-0-1.my.local-ip.co"
      //       PUBLIC_EXTERNAL_ORIGIN: ORIGIN
      //     }
      //   }
      // }

      "daemon-openvscode-server" ?: {
        environment: PORT: string
        ports: [
          "127.0.0.1:\(#namespace_host_port_offset + #service_host_port_offset["openvscode-server"]):\(environment.PORT)",
        ]
      }

      "daemon-substrate": {
        ports: [
          "127.0.0.1:\(#namespace_host_port_offset + #service_host_port_offset["substrate"]):\(environment.PORT)",
        ]

        environment: {
          // PORT: "\(#namespace_host_port_offset + #service_host_port_offset["substrate"] + 1)"
          PORT: "8080"
          ORIGIN: "http://localhost:\(PORT)"
          // if #lenses["ui"] != _|_ {
          //   EXTERNAL_UI_HANDLER: "http://ui:\(services.ui.environment.PORT)"
          // }
        }
      }
    }
  }
}
