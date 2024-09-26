package defs

import (
  cryptosha256 "crypto/sha256"
  "encoding/hex"

  command "github.com/ajbouh/substrate/defs/substrate:command"
  service "github.com/ajbouh/substrate/defs/substrate:service"
  call "github.com/ajbouh/substrate/defs/substrate:call"
  imagespec "github.com/ajbouh/substrate/defs/substrate:imagespec"
  containerspec "github.com/ajbouh/substrate/defs/substrate:containerspec"
)

#Varset: {
  namespace: string @tag(namespace)
  cue_defs: string @tag(cue_defs)
  build_source_directory: string | *"" @tag(build_source_directory)

  host_substratefs_root: string
  host_source_directory: string
  image_prefix: string | *"ghcr.io/ajbouh/substrate:substrate-"
  host_machine_id_file: "/etc/machine-id"

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

    event_stream_url: "/events;data=substrate-bootstrap-0/stream/events"
    event_writer_url: "/events;data=substrate-bootstrap-0/tree/fields"

    new_space_image: string
  }
}

#varsets: [string]: #Varset

#varsets: substrateos: {
  build_source_directory: string
  host_source_directory: "/var/home/core/source"
  host_substratefs_root: "/var/lib/substratefs"
  host_docker_socket: "/var/run/podman/podman.sock"
}

#varsets: docker_compose: {
  namespace: string
  build_source_directory: string
  host_source_directory: build_source_directory

  host_substratefs_root: "\(build_source_directory)/substratefs"
  host_docker_socket: "/var/run/docker.sock"

  substrate: {
    network_name_prefix ?: "\(namespace)-substrate_"
  }
}

#var: #Varset
#var: #varsets["substrateos"]

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

// for binding image_tags to image_ids
// default to the ref itself in case image_ids is missing.
image_ids ?: [ref=string]: string

resourcedirs: [id=string]: {
  "id": string & id
  sha256: hex.Encode(cryptosha256.Sum256(id))
  #imagespec: imagespec.#ImageSpec
  image_tag: #imagespec.image
}

#alias: "resourcedirs": resourcedirs

// helper for resolving image tag to image id
resolve_image_id: {
  image_tag: string
  if image_ids == _|_ { image: image_tag }
  if image_ids != _|_ { image: image_ids[image_tag] }
}

#var: substrate: new_space_image: (resolve_image_id & {"image_tag": imagespecs["new-space"].image}).image

services: [key=string]: service & {
  "name": key

  instances: [string]: {
    image_tag: string | *imagespecs[key].image

    image: (resolve_image_id & {"image_tag": image_tag}).image

    // TODO we should be able to delete this now...
    // This is so we can turn services into JSON. It should really be done inside of
    // substrate.go during boot so that nesting will work properly.
    "environment": SUBSTRATE_URL_PREFIX: string | *"/\(key)"

    resourcedirs: _
    for rdalias, rdid in resourcedirs {
      mounts: "/res/\(rdalias)": {
        type: "image"
        source: #alias.resourcedirs[rdid].image_tag
        mode: ["ro"]
      }
    }
  }
}

calls: [key=string]: [id=string]: call.#HTTPCall

daemons: [key=string]: containerspec.#ContainerSpec & {
  image_tag: string | *imagespecs[key].image
  image: (resolve_image_id & {"image_tag": image_tag}).image
}

// "Templates" can be stored here
#commands: [key=string]: [commandname=string]: {#name: commandname} & command.#Command

commands: [key=string]: [commandname=string]: {#name: commandname} & command.#Command
