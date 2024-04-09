package defs

import (
  "strings"
  "encoding/hex"
  cryptosha256 "crypto/sha256"

  systemd "github.com/ajbouh/substrate/defs/systemd"
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
  imagespec
  containerspec.#ContainerSpec

  depends_on: [string]: true
}

test_templates: [string]: #TestDef

tests: [key=string]: [suitealias=string]: #TestDef

imagespecs: [key=string]: imagespec & {
  image: "\(#var.image_prefix)\(key)"
  build: dockerfile: string | *"images/\(key)/Dockerfile"
}

// a way to reuse image names
image_tags: [key=string]: string

// for binding image_tags to image_ids
image_ids: [ref=string]: string | *ref

resourcedirs: [id=string]: {
  #containerspec: containerspec.#ContainerSpec
  #imagespec: imagespec
}

services: [key=string]: service & {
  "name": key
}

calls: [key=string]: [id=string]: call.#HTTPCall

daemons: [key=string]: containerspec.#ContainerSpec

#out: {
  services: [string]: service

  imagespecs: [string]: imagespec
  daemons: [string]: containerspec.#ContainerSpec
  systemd_containers: [string]: systemd.#Unit
  systemd_container_contents: [string]: string
  systemd_container_basenames: string
  image_podman_build_options: [string]: string

  "resourcedir_fetches": [alias=string]: {
    sha256: string
    #containerspec: containerspec.#ContainerSpec
    #imagespec: imagespec
  }
  "resourcedir_keys": string
  resourcedir_fetch_podman_build_options: [string]: string
  resourcedir_fetch_podman_run_options: [string]: string
}

#out: "imagespecs": {
  for key, def in imagespecs {
    if (enable[key] != _|_) {
      if (enable[key]) {
        (key): def
      }
    }
  }
}

for key, def in #out.services {
  if def.spawn != _|_ {
    for alias, rddef in def.spawn.resourcedirs {
      resourcedirs: (rddef.id): _
      #out: resourcedir_fetches: (rddef.id): {
        sha256: rddef.sha256
        target: "\(#var.build_resourcedirs_root)/\(rddef.sha256)"
        #containerspec: (resourcedirs[rddef.id].#containerspec & {
          image: resourcedirs[rddef.id].#imagespec.image
          // write to .build directory first
          mounts: [{source: "\(#var.build_resourcedirs_root)/\(rddef.sha256).build", "destination": "/res", "mode": "Z"}]
        })
        #imagespec: resourcedirs[rddef.id].#imagespec
      }
    }
  }
}

#out: "resourcedir_keys": strings.Join([
  for key, def in #out.resourcedir_fetches {
    key,
  }
], "\n")

for key, def in services if (enable[key]) {
  #out: "services": (key): def & { "name": key }
}

for key, def in services if (enable[key]) && def.spawn != _|_ {
  let image_tag = image_tags[key] | *#out.imagespecs[key].image
  image_ids: (image_tag): string
  #out: service_image_tags: (key): image_tag
}

for key, def in services if (enable[key]) && def.spawn != _|_ {
  #out: "services": (key): def & {
    "name": key 
    spawn: {
      image: image_ids[#out.service_image_tags[key]]

      "resourcedirs": [alias=string]: {
        id: string
        sha256: hex.Encode(cryptosha256.Sum256(id))
      }
      // This is so we can turn services into JSON. It should really be done inside of
      // substrate.go during boot so that nesting will work properly.
      "environment": SUBSTRATE_URL_PREFIX: string | *"/\(key)"
    }
  }
}

for key, def in daemons {
  if (enable[key]) {
    #out: "daemons": (key): def
    #out: "daemons": (key): image: #out.imagespecs[key].image
  }
}

for key, def in #out.daemons {
  #out: "systemd_containers": (containerspec.#SystemdUnits & {#name: key, #containerspec: def}).#out
}

for basename, unit in #out.systemd_containers {
  #out: "systemd_container_contents": (basename): (systemd.#render & {#unit: unit}).#out
}

#out: "systemd_container_basenames": strings.Join([
  for key, def in #out.systemd_containers { key }
], "\n")

#out: "image_references": strings.Join([
  for key, def in #out.imagespecs { def.image }
], "\n")

for key, def in #out.imagespecs {
  #out: "image_podman_build_options": (def.image): def.#podman_build_options
}

for key, def in #out.resourcedir_fetches {
  #out: "resourcedir_fetch_podman_build_options": (key): def.#imagespec.#podman_build_options
  #out: "resourcedir_fetch_dirs": (key): strings.Join([def.#containerspec.mounts[0].source], " ")
  #out: "resourcedir_fetch_podman_run_options": (key): (containerspec.#PodmanRunOptions & {
    #containerspec: def.#containerspec
  }).#out
}

#out: "calls": calls
