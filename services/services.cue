package services

import (
  "github.com/ajbouh/substrate/lenses:lens"


  service_substrate "github.com/ajbouh/substrate/services/substrate:service"
  // service_nats "github.com/ajbouh/substrate/services/nats:service"
  // service_planecontroller "github.com/ajbouh/substrate/services/plane/controller:service"
)

let all = [
  service_substrate,
  // service_nats,
  // service_planecontroller,
]

let var = #var
#var: {
  namespace: string
  hostprefix: string | *"\(namespace)-"
  lenses: [string]: lens
  
  plane_drone_host_plane_data_dir: "./data/plane"


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
        "origin": var.substrate.origin
        "plane_drone_substratefs_mountpoint": var.plane_drone_substratefs_mountpoint // | #manifest["substratefs-mount"].#out.mountpoint

        host_plane_data_dir: var.plane_drone_host_plane_data_dir
        bind_mounts: [
          {source: "./cache", destination: "/cache"},
        ]
      }
    }
  }
}

services.#manifest
