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

  host_user: string @tag(host_user)
  host_group: string @tag(host_group)
  host_home_directory: string @tag(host_home_directory)
  host_source_directory: string @tag(host_source_directory)

  use_bootc_storage: *false | bool @tag(use_bootc_storage,type=bool)

  image_prefix: string | *"ghcr.io/ajbouh/substrate:substrate-"
  host_machine_id_file: "/etc/machine-id"
  host_hostname_file: "/etc/hostname"

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

    mount_root: "/mnt"

    image_ids: [string]: string
    system_spaces: [string]: string
  }
}

#varsets: [string]: #Varset

#varsets: substrateos: {
  host_docker_socket: "/var/run/podman/podman.sock"
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

resourcedirs: [rdid=string]: {
  "id": string & rdid
  sha256: hex.Encode(cryptosha256.Sum256(rdid))
  #imagespec: imagespec.#ImageSpec
  image_tag: #imagespec.image
}

#alias: "resourcedirs": resourcedirs

// helper for resolving image tag to image id
resolve_image_ids: *true | bool @tag(resolve_image_ids,type=bool)
resolve_image_id: {
  image_tag: string
  if !resolve_image_ids || (image_ids[image_tag] == _|_) { image: image_tag }
  if resolve_image_ids && (image_ids[image_tag] != _|_) { image: image_ids[image_tag] }
}

for key, def in imagespecs if enable[key] {
  #var: substrate: "image_ids": (key): (resolve_image_id & {image_tag: def.image}).image
}

#var: substrate: "system_spaces": {
  "source": #var.host_source_directory
  "home": #var.host_home_directory
  "root": "/"
}

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

calls: [key=string]: [callid=string]: call.#HTTPCall

daemons: [key=string]: containerspec.#ContainerSpec & {
  image_tag: string | *imagespecs[key].image
  image: (resolve_image_id & {"image_tag": image_tag}).image
}

// "Templates" can be stored here
#commands: [key=string]: [commandname=string]: {#name: commandname} & command.Command

commands: [key=string]: [commandname=string]: {#name: commandname} & command.Command

if #var.use_bootc_storage {
  // So we can use bootc logically-bound images. See also: https://containers.github.io/bootc/logically-bound-images.html
  podman_storage_conf: storage: options: additionalimagestores: [
    "/usr/lib/bootc/storage",
  ]
}
