package defs

import (
  "strings"

  quadlet "github.com/ajbouh/substrate/defs/podman:quadlet"
)

#var: {
  namespace: string
  image_prefix: string
  cue_defs: string
  host_source_directory: string
  
  host_docker_socket: string
  host_resourcedirs_root: string
  host_resourcedirs_path: string

  substrate: network_name_prefix: string | *""
  substrate: internal_network_name: string
  substrate: external_network_name: string
  substrate: resourcedirs_root: string
  substrate: internal_port: int
  substrate: internal_host: string
  substrate: internal_protocol: string
}

enable: "substrate": true

live_edit: "substrate": bool

// Uncomment the line below to enable live def editing.
// We can default to `live_edit: "substrate": true` once:
// - the live ISO properly bundles source code
// - the installer properly copies source code
// - we have a valid "dummy" location that exists when source code is not present.
// live_edit: "substrate": true

let substrate_cue_defs = "/app/defs"
imagespecs: "substrate": {
  build: {
    args: {
      CUE_DEFS_SOURCE: #var.cue_defs
      CUE_DEFS_TARGET: substrate_cue_defs
    }
  }
}

let substrate_cue_defs_live = "/live/defs"
let substrate_data = "/var/lib/substrate/data"

tests: "substrate": go: {
  build: {
    target: "test"
    dockerfile: "images/substrate/Dockerfile"
  }
  command: [
    "go", "test",
    "-tags", "remote exclude_graphdriver_btrfs btrfs_noversion exclude_graphdriver_devicemapper containers_image_openpgp",
    "github.com/ajbouh/substrate/images/substrate/...",
  ]
}

daemons: "substrate": {
  environment: {
    "PORT": string | *"\(#var.substrate.internal_port)"
    "SUBSTRATE_DB": "\(substrate_data)/substrate.sqlite"
    "SUBSTRATEFS_ROOT": #var.host_substratefs_root
    "SUBSTRATE_CUE_DEFS": string | *substrate_cue_defs
    if live_edit["substrate"] {
      "SUBSTRATE_CUE_DEFS_LIVE": substrate_cue_defs_live
    }
    "SUBSTRATE_USE_VARSET": string | *#var.use_varset
    "SUBSTRATE_SOURCE_DIRECTORY": string | *#var.host_source_directory

    "ORIGIN": string
    // TODO pass in internal_host
    // TODO pass in internal_protocol
    "SUBSTRATE_NAMESPACE": #var.namespace
    "SUBSTRATE_INTERNAL_NETWORK": string | *#var.substrate.internal_network_name
    "SUBSTRATE_EXTERNAL_NETWORK": string | *#var.substrate.external_network_name
    "SUBSTRATE_RESOURCEDIRS_ROOT": string | *#var.host_resourcedirs_root
    "SUBSTRATE_RESOURCEDIRS_PATH": string | *#var.host_resourcedirs_path

    #docker_socket: "/var/run/docker.sock"

    "DOCKER_HOST": "unix://\(#docker_socket)"
  }

  mounts: [
    {source: "\(#var.namespace)-substrate_data", destination: substrate_data},
    {source: #var.host_substratefs_root, destination: #var.host_substratefs_root},
    {source: #var.host_docker_socket, destination: environment.#docker_socket},
    {source: #var.host_resourcedirs_root, destination: #var.host_resourcedirs_root},
    if live_edit["substrate"] {
      { source: "\(#var.host_source_directory)/\(#var.cue_defs)", destination: substrate_cue_defs_live },
    }
    if #var.host_resourcedirs_path != "" {
      for rddir in strings.Split(#var.host_resourcedirs_path, ":") {
        {source: rddir, destination: rddir},
      }
    }
  ]

  #docker_compose_service: {
    environment: {
      "SUBSTRATE_PROVISIONER": "docker"

      "ORIGIN": "http://localhost:8080"

      "SUBSTRATE_INTERNAL_NETWORK": "\(#var.substrate.network_name_prefix)\(#var.substrate.internal_network_name)"
      "SUBSTRATE_EXTERNAL_NETWORK": "\(#var.substrate.network_name_prefix)\(#var.substrate.external_network_name)"
    }

    networks: [
      #var.substrate.internal_network_name,
      #var.substrate.external_network_name,
    ]
  }

  #docker_compose_networks: {
    (#var.substrate.internal_network_name): {
      internal: true
      attachable: true
      driver: "bridge"
      driver_opts: {
        "com.docker.network.bridge.enable_icc": "true"
        "com.docker.network.bridge.enable_ip_masquerade": "true"
        "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0"
      }
      ipam: {
        driver: "default"
        config: [
          {
            subnet: "192.168.100.0/24"
          },
        ]
      }
    }
    (#var.substrate.external_network_name): {
      attachable: true
      driver: "bridge"
      driver_opts: {
        "com.docker.network.bridge.enable_icc": "true"
        "com.docker.network.bridge.enable_ip_masquerade": "true"
        "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0"
      }
      ipam: {
        driver: "default"
        config: [
          {
            subnet: "192.168.101.0/24"
          },
        ]
      }
    }
  }

  #systemd_units: {
    "substrate-internal.network": quadlet.#Network & {
      Network: {
        Driver: "bridge"
        NetworkName: #var.substrate.internal_network_name
        Internal: true
        IPAMDriver: "host-local"
      }
    }
    "substrate-external.network": quadlet.#Network & {
      Network: {
        Driver: "bridge"
        NetworkName: #var.substrate.external_network_name
        IPAMDriver: "host-local"
      }
    }
    "substrate.container": {
      Unit: {
        Requires: ["podman.socket", "nvidia-ctk-cdi-generate.service", "ensure-substratefs-root.service", "ensure-resourcedirs-root.service", "ensure-resourcedirs-path.service", "ensure-oob-imagestore.service"]
        After: ["podman.socket", "nvidia-ctk-cdi-generate.service", "ensure-substratefs-root.service", "ensure-resourcedirs-root.service", "ensure-resourcedirs-path.service", "ensure-oob-imagestore.service"]
      }
      Install: {
        WantedBy: ["multi-user.target", "default.target"]
      }
      Service: {
        // https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html#runfile-verifications
        ExecStartPre: ["-/usr/bin/nvidia-smi"]
      }
      Container: {
        SecurityLabelDisable: true
        PublishPort: [
          // To make localhost forwarding work (e.g. qemu, publish on the same port)
          "\(Environment.PORT):\(Environment.PORT)",
        ]
        AddDevice: ["nvidia.com/gpu=all"]
        Network: [
          "substrate-external.network",
          "substrate-internal.network",
        ]
        Environment: {
          ORIGIN: "https://substrate.home.arpa"
          environment
        }
      }
    }
  }
}

services: "substrate": {
  activities: {
    // attach: {
    //   request: {
    //     path: "/substrate/v1/collections/:owner/:name/servicespecs/:servicespec"
    //     method: "POST"
    //     schema: {
    //       owner: {
    //         type: "owner"
    //       }
    //       name: {
    //         type: "?"
    //       }
    //       servicespec: {
    //         type: "?"
    //       }
    //     }
    //   }
    // }
    new: {
      activity: "user:new-space"
      // image: (svg.#SVGImageData & {
      //   #src: """
      //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
      //     <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
      //   </svg>
      //   """
      // }).#out

      label: "Create new space"
      request: {
        path: "/substrate/v1/spaces"
        method: "POST"
      }
      response: {
        schema: {
          space: type: "space"
        }
      }
    }
    fork: {
      activity: "user:new-space"
      // image: (svg.#SVGImageData & {
      //   // Heroicon name: mini/document-duplicate
      //   #src: """
      //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      //       <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
      //       <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
      //     </svg>
      //   """
      // }).#out

      label: "fork space"
      request: {
        path: "/substrate/v1/spaces"
        method: "POST"
        schema: {
          space_base_ref: {
            type: "space"
            body: ["space_base_ref"]
          }
        }
      }
      response: {
        schema: {
          space: type: "space"
        }
      }
    }
  }
}
