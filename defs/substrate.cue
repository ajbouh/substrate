package defs

import (
  quadlet "github.com/ajbouh/substrate/defs/podman:quadlet"
  command "github.com/ajbouh/substrate/defs/substrate:command"
)

#var: {
  namespace: string
  image_prefix: string
  cue_defs: string
  host_source_directory: string
  
  host_docker_socket: string
  host_machine_id_file: string
  host_hostname_file: string

  substrate: network_name_prefix: string | *""
  substrate: internal_network_name: string
  substrate: external_network_name: string
  substrate: internal_port: int
  substrate: internal_host: string
  substrate: internal_protocol: string
  substrate: event_stream_url: string
  substrate: event_writer_url: string

  substrate: image_ids: [string]: string
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
    "PORT": "443"
    "HOST": "0.0.0.0"
    "SUBSTRATE_MACHINE_ID_FILE": #var.host_machine_id_file
    "SUBSTRATE_HOSTNAME_FILE": "\(#var.host_hostname_file).host"
    "SUBSTRATE_CUE_DEFS": string | *substrate_cue_defs
    if live_edit["substrate"] {
      "SUBSTRATE_CUE_DEFS_LIVE": substrate_cue_defs_live
    }
    "SUBSTRATE_SOURCE": string | *#var.host_source_directory

    // TODO pass in internal_host
    // TODO pass in internal_protocol
    "SUBSTRATE_NAMESPACE": #var.namespace
    "SUBSTRATE_INTERNAL_NETWORK": string | *#var.substrate.internal_network_name
    "SUBSTRATE_EXTERNAL_NETWORK": string | *#var.substrate.external_network_name

    "SUBSTRATE_EVENT_STREAM_URL": string | *#var.substrate.event_stream_url
    "SUBSTRATE_EVENT_WRITER_URL": string | *#var.substrate.event_writer_url

    "CUE_DEBUG": "1"

    #docker_socket: "/var/run/docker.sock"

    "DOCKER_HOST": "unix://\(#docker_socket)"
  }

  mounts: {
    (substrate_data): {source: "\(#var.namespace)-substrate_data" , type: "volume"}
    "/var/lib/containers/storage": {source: "/var/lib/containers/storage"}
    (#var.host_machine_id_file): {source: #var.host_machine_id_file}
    (environment.SUBSTRATE_HOSTNAME_FILE): {source: #var.host_hostname_file}
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
        Requires: ["podman.socket"]
        After: ["podman.socket"]
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
        Network: [
          "substrate-external.network",
          "substrate-internal.network",
        ]
        Environment: {
          INTERNAL_SUBSTRATE_ORIGIN: "http://substrate:8080"
          environment
        }
      }
    }
  }
}

commands: "substrate": {
  "space:new": {
    description: "Create new space"
    meta: {
      "#/data/returns/space": {type: "string", description: "ID of space created"}
    }
    command.#ViaHTTP
    msg: data: request: {
        url: "/substrate/v1/spaces"
        method: "POST"
    }
  }
  "space:fork": {
    description: "Fork an existing space"
    meta: {
      "#/data/parameters/space_base_ref": {type: "string", description: "ID of space to fork"}

      "#/data/returns/space": {type: "string", description: "ID of space created"}
    }

    command.#ViaHTTP
    msg: data: request: {
      url: "/substrate/v1/spaces"
      method: "POST"
    }
  }
}
