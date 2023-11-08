package daemons

import (
  "github.com/ajbouh/substrate/services:lens"

  daemon_substrate "github.com/ajbouh/substrate/services/substrate:daemon"
)

let all = [
  daemon_substrate,
]

let var = #var
#var: {
  namespace: string
  hostprefix: string | *"\(namespace)-"
  image_prefix: string
  lenses: [string]: lens
  
  // plane_drone_host_plane_data_dir: "./data/plane"
  host_docker_socket: string

  substrate: internal_port: int
  substrate: origin: string

  secrets: substrate: session_secret: string
}

let services = {
  #manifest: {
    for service in all {
      "\(service.name)": service & {
        #host: "\(var.hostprefix)\(service.name)"
        #var: {
          namespace: var.namespace
        }
      }
    }

    "substrate": {
      #var: {
        "namespace": var.namespace
        "lenses": var.lenses
        "session_secret": var.secrets.substrate.session_secret
        "internal_port": var.substrate.internal_port
        "image": "\(var.image_prefix)substrate"
        "origin": var.substrate.origin

        "host_docker_socket": var.host_docker_socket

        // bind_mounts: [
        //   {source: "./cache", destination: "/cache"},
        // ]
      }
    }
  }
}

services.#manifest
