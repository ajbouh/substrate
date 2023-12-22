package containerspec

import (
  "strings"

  docker_compose_service "github.com/ajbouh/substrate/pkg/docker/compose:service"
  imagespec "github.com/ajbouh/substrate/pkg/substrate:imagespec"
  systemd "github.com/ajbouh/substrate/pkg/systemd"
  quadlet "github.com/ajbouh/substrate/pkg/podman:quadlet"
)

#ContainerSpec: {
  command ?: [...string]

  image: string

  environment: [string]: string

  mounts ?: [
    ...{
      source: string
      destination: string
      mode: string | *"rw"
    }
  ]
}

#SystemdUnits: {
  #containerspec: #ContainerSpec
  #name: string

  #out: {
    if #containerspec.#systemd_units != _|_ {
      #containerspec.#systemd_units
    }

    [string]: systemd.#Unit
    [=~"\\.network$"]: quadlet.#Network
    [=~"\\.image$"]: quadlet.#Image
    [=~"\\.container$"]: quadlet.#Container

    "\(#name).container" ?: Container: {
      Pull: string | *"never"
      Image: #containerspec.image
      ContainerName: #name
      // HACK this might create a shell escaping issue...
      if #containerspec.command != _|_ {
        Exec: strings.Join(#containerspec.command, " ")
      }
      if #containerspec.mounts != _|_ {
        Volume: [
          for mount in #containerspec.mounts {
            "\(mount.source):\(mount.destination):\(mount.mode)",
          }
        ]
      }
    }
  }
}

#DockerComposeService: {
  #containerspec: #ContainerSpec
  #imagespec: imagespec

  #out: {
    docker_compose_service

    if #containerspec.command != _|_ { "command": #containerspec.command }
    if #containerspec.image != _|_ { "image": #containerspec.image }
    if #containerspec.environment != _|_ { "environment": #containerspec.environment }

    if #containerspec.mounts != _|_ {
      volumes: [
        for mount in #containerspec.mounts {
          "\(mount.source):\(mount.destination):\(mount.mode)"
        }
      ]
    }

    if #containerspec.#docker_compose_service != _|_ {
      #containerspec.#docker_compose_service
    }

    if #imagespec.build != _|_ { "build": #imagespec.build }
    if #imagespec.image != _|_ { "image": #imagespec.image }
  }
}

#DockerComposeVolumes: {
  #containerspec: #ContainerSpec

  #out: {
    [string]: _
  }

  if #containerspec.mounts != _|_ {
    for mount in #containerspec.mounts {
      if !strings.HasPrefix(mount.source, "/") && !strings.HasPrefix(mount.source, ".") {
        #out: "\(mount.source)": {}
      }
    }
  }
}

#DockerComposeNetworks: {
  #containerspec: #ContainerSpec

  #out: {
    [string]: _
  }

  if #containerspec.#docker_compose_networks != _|_ {
    #out: #containerspec.#docker_compose_networks
  }
}
