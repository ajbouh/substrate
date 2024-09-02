package defs

import (
  quadlet "github.com/ajbouh/substrate/defs/podman:quadlet"
)

#var: {
  namespace: string
  image_prefix: string
  cue_defs: string
  host_source_directory: string
  
  host_docker_socket: string
  host_machine_id_file: string

  substrate: network_name_prefix: string | *""
  substrate: internal_network_name: string
  substrate: external_network_name: string
  substrate: internal_port: int
  substrate: internal_host: string
  substrate: internal_protocol: string

  substrate: new_space_image: string
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
  image: "\(#var.image_prefix)substrate"
  build: dockerfile: "images/substrate/Dockerfile"
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
    "SUBSTRATE_MACHINE_ID_FILE": #var.host_machine_id_file
    "SUBSTRATE_CUE_DEFS": string | *substrate_cue_defs
    if live_edit["substrate"] {
      "SUBSTRATE_CUE_DEFS_LIVE": substrate_cue_defs_live
    }
    "SUBSTRATE_SOURCE_DIRECTORY": string | *#var.host_source_directory

    "ORIGIN": string
    // TODO pass in internal_host
    // TODO pass in internal_protocol
    "SUBSTRATE_NAMESPACE": #var.namespace
    "SUBSTRATE_INTERNAL_NETWORK": string | *#var.substrate.internal_network_name
    "SUBSTRATE_EXTERNAL_NETWORK": string | *#var.substrate.external_network_name

    #docker_socket: "/var/run/docker.sock"

    "DOCKER_HOST": "unix://\(#docker_socket)"
  }

  mounts: {
    (substrate_data): {source: "\(#var.namespace)-substrate_data" , type: "volume"}
    "/var/lib/containers/storage": {source: "/var/lib/containers/storage"}
    (#var.host_substratefs_root): {source: #var.host_substratefs_root}
    (#var.host_machine_id_file): {source: #var.host_machine_id_file}
    (environment.#docker_socket): {source: #var.host_docker_socket}
    if live_edit["substrate"] {
      (substrate_cue_defs_live): {source: "\(#var.host_source_directory)/\(#var.cue_defs)"}
    }
  }

  #systemd_quadlet_units: {
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
        Requires: ["podman.socket", "nvidia-ctk-cdi-generate.service", "ensure-substratefs-root.service", "ensure-oob-imagestore.service"]
        After: ["podman.socket", "nvidia-ctk-cdi-generate.service", "ensure-substratefs-root.service", "ensure-oob-imagestore.service"]
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

commands: "substrate": {
  "space:new": {
    description: "Create new space"
    returns: {
      "space": {
        type: "string"
        description: "ID of space created"
      }
    }
    run: {
      http: {
        returns: space: path: "response.body.space"
        request: {
          url: "/substrate/v1/spaces"
          method: "POST"
        }
      }
    }
  }
  "space:fork": {
    description: "Fork an existing space"
    returns: "space": {
      type: "string"
      description: "ID of space created"
    }
    parameters: "space_base_ref": {
      type: "string"
      description: "ID of space to fork"
    }
    run: {
      http: {
        parameters: space_base_ref: path: "request.body.parameters.space_base_ref"
        returns: space: path: "response.body.space"
        request: {
          url: "/substrate/v1/spaces"
          method: "POST"
        }
      }
    }
  }
}
