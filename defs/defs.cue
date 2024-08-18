package defs

import (
  "encoding/hex"
  cryptosha256 "crypto/sha256"

  service "github.com/ajbouh/substrate/defs/substrate:service"
  call "github.com/ajbouh/substrate/defs/substrate:call"
  imagespec "github.com/ajbouh/substrate/defs/substrate:imagespec"
  containerspec "github.com/ajbouh/substrate/defs/substrate:containerspec"
)

#Varset: {
  namespace: string @tag(namespace)
  cue_defs: string @tag(cue_defs)
  build_source_directory: string | *"" @tag(build_source_directory)
  use_varset: string @tag(use_varset)

  host_substratefs_root: string
  host_source_directory: string
  image_prefix: string | *"ghcr.io/ajbouh/substrate:substrate-"
  host_resourcedirs_root: string
  host_resourcedirs_path: string
  host_machine_id_file: "/etc/machine-id"
  build_resourcedirs_root: string

  host_docker_socket: string | *"/var/run/docker.sock"
  // host_docker_socket: "/var/run/podman/podman.sock"
  // host_docker_socket: "/run/user/1001/podman/podman.sock"

  substrate: {
    internal_port: int | *8080

    network_name_prefix: string | *""
    internal_host: "substrate:\(internal_port)"
    internal_protocol: "http:"
    internal_network_name: "substrate-internal"
    external_network_name: "substrate-external"
    resourcedirs_root: "/var/lib/substrate/resourcedirs"
  }
}

#varsets: [string]: #Varset

#varsets: substrateos: {
  build_source_directory: string
  host_source_directory: "/var/home/core/source"
  host_substratefs_root: "/var/lib/substratefs"
  host_docker_socket: "/var/run/podman/podman.sock"
  host_resourcedirs_root: "/var/lib/resourcedirs"
  host_resourcedirs_path: "/run/media/oob/resourcedirs"
  build_resourcedirs_root: "\(build_source_directory)/os/gen/oob/resourcedirs"
}

#varsets: docker_compose: {
  namespace: string
  build_source_directory: string
  host_source_directory: build_source_directory

  host_substratefs_root: "\(build_source_directory)/substratefs"
  host_resourcedirs_path: ""
  host_resourcedirs_root: "\(build_source_directory)/os/gen/oob/resourcedirs"
  host_docker_socket: "/var/run/docker.sock"
  build_resourcedirs_root: host_resourcedirs_root

  substrate: {
    network_name_prefix ?: "\(namespace)-substrate_"
  }
}

#var: #Varset

#use_varset: "substrateos" | "docker_compose" @tag(use_varset)
#var: #varsets[#use_varset]

enable: [string]: bool

#live_edit_default: bool @tag(live_edit,type=bool)
live_edit: [string]: bool | *#live_edit_default

system: [string]: _

#TestDef: {
  imagespec.#ImageSpec
  containerspec.#ContainerSpec

  depends_on: [string]: true
}

test_templates: [string]: #TestDef

tests: [key=string]: [suitealias=string]: #TestDef

imagespecs: [key=string] ?: imagespec.#ImageSpec

// a way to reuse image names

// for binding image_tags to image_ids
// default to the ref itself in case image_ids is missing.
image_ids ?: [ref=string]: string

resourcedirs: [id=string]: {
  #containerspec: containerspec.#ContainerSpec
  #imagespec: imagespec.#ImageSpec
}

services: [key=string]: service & {
  "name": key

  instances: [string]: {
    image_tag: string | *imagespecs[key].image

    if image_ids == _|_ {
      image: image_tag
    }

    if image_ids != _|_ {
      image: image_ids[image_tag]
    }

    "resourcedirs": [alias=string]: {
      id: string
      sha256: hex.Encode(cryptosha256.Sum256(id))
    }
    // This is so we can turn services into JSON. It should really be done inside of
    // substrate.go during boot so that nesting will work properly.
    "environment": SUBSTRATE_URL_PREFIX: string | *"/\(key)"
  }
}


calls: [key=string]: [id=string]: call.#HTTPCall

daemons: [key=string]: containerspec.#ContainerSpec
